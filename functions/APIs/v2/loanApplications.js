const { rdb } = require('../../util/admin');
const clientCheck = require('../../util/clientCheck');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const { validateNewLoanApplication } = require('../../util/validators');

exports.newLoanApplication = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        if(!clientCheck(request.body.clientId, request.user.user_id)) {
            return response.status(403).json({error: 'Unauthorized operation'});
        }
    }

    const newApplication = {
        clientId: request.body.clientId,
        amount: request.body.amount,
        term: request.body.term,
        propertyArea: request.body.propertyArea
    }
    const { valid, errors } = validateNewLoanApplication(newApplication);
    if (!valid) return response.status(400).json(errors);

    const clRef = rdb.ref(`/users/${newApplication.clientId}`);
    const snapshot = await clRef.once('value');
    let client = (snapshot.val() || {});

    newApplication.applicantIncome = client.profile.applicantincome || 0;
    newApplication.coappIncome = client.profile.coapplicantIncome || 0;
    newApplication.dependents = client.profile.dependents || 0;
    newApplication.education = client.profile.education || 0;
    newApplication.married = client.profile.marital || 0;
    newApplication.selfemployed = client.profile.selfemployed || 0;
    newApplication.credithistory = client.profile.credithistory || 0;

    newApplication.createdDate = new Date().toISOString();
    const applicationRef = rdb.ref('/loanApplications');
    const newApplicationRef = applicationRef.push();
    newApplicationRef
        .set(newApplication)
        .then(()=>{
            let key = newApplicationRef.key;
            return response.status(201).json({key});
        }).catch((error) => {
        console.log(error);
        response.status(500).json({ error });
    });
}

exports.getLoanApplicationById = async (request, response) => {
    const apID = request.params.apID;
    const applicationRef = rdb.ref(`/loanApplications/${apID}`);
    const snapshot = await applicationRef.once("value");
    let application = snapshot.val();

    if(!request.user.userRoles.sysAdmin){
        if(!clientCheck(application.clientId, request.user.user_id)) {
            return response.status(403).json({error: 'Unauthorized operation'});
        }
    }
    return response.status(201).json({application});
}

exports.getLoanApplicationByClient = async (request, response) => {
    const clID = request.params.clID;

    if(!request.user.userRoles.sysAdmin){
        if(!clientCheck(clID, request.user.user_id)) {
            return response.status(403).json({error: 'Unauthorized operation'});
        }
    }

    const applicationRef = rdb.ref('/loanApplications');
    const query = applicationRef.orderByChild("clientId").equalTo(clID);
    const snapshot = await query.once('value');
    let applications = ( snapshot.val() || {} );

    return response.status(201).json({applications});
}

exports.updateLoanApplicationById = async (request, response) => {
    const apID = request.params.apID;

    if(!request.user.userRoles.sysAdmin){
        if(!clientCheck(request.body.clientId, request.user.user_id)) {
            return response.status(403).json({error: 'Unauthorized operation'});
        }
    }

    const updateApplication = {
        amount: request.body.amount,
        term: request.body.term,
        propertyArea: request.body.propertyArea
    }
    console.log(apID);
    const apRef = rdb.ref(`/loanApplications/${apID}`);
    apRef.update(updateApplication)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}

exports.saveDecision = async (request, response) => {
    const apID = request.params.apID;

    if(!request.user.userRoles.sysAdmin){
        if(!clientCheck(request.body.clientId, request.user.user_id)) {
            return response.status(403).json({error: 'Unauthorized operation'});
        }
    }

    const updateApplication = {
        approvedByLoanOfficer: request.body.approved
    }

    const apRef = rdb.ref(`/loanApplications/${apID}`);
    apRef.update(updateApplication)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });

}

exports.uploadModel = async (request, response) => {
    console.log("Uploading loan applications");
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let modelToBeUploaded = {};
    let weightsToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log("Busboy On")
        if (fieldname === 'modelFile'){
            if( mimetype !== 'application/json') {
                return response.status(400).json({ error: 'Model file is not in JSON format' });
            }
            const filePath = path.join(os.tmpdir(), filename);
            modelToBeUploaded = { filePath, mimetype };
            file.pipe(fs.createWriteStream(filePath));
        } else if (fieldname === 'weightsFile'){
            if( mimetype !== 'application/octet-stream') {
                return response.status(400).json({ error: 'Weights file is not in .bin format' });
            }
            const filePath = path.join(os.tmpdir(), filename);
            weightsToBeUploaded = { filePath, mimetype, filename };
            file.pipe(fs.createWriteStream(filePath));
        }
    });

    busboy.on('finish', async () => {
        if(!modelToBeUploaded.filePath || !weightsToBeUploaded.filePath){
            return response.status(400).json({ error: 'Both files must be uploaded' });
        }
        const directory = './AI_Models/Loan_Approval';
        try {
            //Remove existing files
            await fs.readdir(directory,{}, (err, files) => {
                if (err) throw err;
                files.forEach((file) => {
                    fs.unlinkSync(`${directory}/${file}`);
                })
            });

            await fs.rename(modelToBeUploaded.filePath, `${directory}/model.json`, (err) => {
                if (err) throw err;
            });
            await fs.rename(weightsToBeUploaded.filePath, `${directory}/${weightsToBeUploaded.filename}`, (err) => {
                if (err) throw err;
            });
            return response.json({ message: 'Uploaded successfully' });
        } catch (err) {
            return response.status(500).json({
                message: e
            });
        }

    });

    busboy.end(request.rawBody);
}

exports.predictLoan = async (request, response) => {
    const loanQuery = {
        clientId: request.body.clientId,
        loanApplicationID: request.body.loanApplicationID,
        applicantIncome: request.body.applicantIncome,
        coappIncome: request.body.coappIncome,
        amount: request.body.amount || 0,
        term: request.body.term,
        credithistory: request.body.credithistory || 0,
    }

    switch(request.body.propertyArea){
        case 'rural':
            loanQuery.propertyarea = 0;
            break;
        case 'semirural':
            loanQuery.propertyarea = 1;
            break;
        default:
            loanQuery.propertyarea = 2;
    }

    if(request.body.gender === 'Female'){
        loanQuery.gender = 1
    } else {
        loanQuery.gender = 0
    }

    switch(request.body.dependents){
        case "0":
            loanQuery.dependents = 0;
            break;
        case "1":
            loanQuery.dependents = 1;
            break;
        case "2":
            loanQuery.dependents = 2;
            break;
        default:
            loanQuery.dependents = 3;
    }

    if(request.body.education === 'Yes'){
        loanQuery.education = 0
    } else {
        loanQuery.education = 1
    }

    if(request.body.married === 'Yes'){
        loanQuery.married = 1
    } else {
        loanQuery.married = 0
    }

    if(request.body.selfemployed === 'Yes'){
        loanQuery.selfemployed = 1
    } else {
        loanQuery.selfemployed = 0
    }

    if(request.body.credithistory === 'Yes'){
        loanQuery.credithistory = 1
    } else {
        loanQuery.credithistory = 0
    }

    console.log(loanQuery);

    const model = await tf.loadLayersModel('file://./AI_Models/Loan_Approval/model.json')
        .catch((error) => {
            console.log(`Error - Model Loading - ${error}`);
            return response.status(503).json({message: `${error}`});
        });

    let prediction;
    try {
        prediction = model.predict(tf.tensor([
            parseFloat(loanQuery.gender),
            parseFloat(loanQuery.married),
            parseFloat(loanQuery.dependents),
            parseFloat(loanQuery.education),
            parseFloat(loanQuery.selfemployed),
            parseFloat(loanQuery.applicantIncome),
            parseFloat(loanQuery.coappIncome),
            parseFloat(loanQuery.amount),
            parseFloat(loanQuery.term),
            parseFloat(loanQuery.credithistory),
            parseFloat(loanQuery.propertyarea),
        ], [1, 11]));
    } catch (error){
        console.log(`Error - Prediction failure - ${error}`);
        return response.status(500).json({message: `${error}`});
    }

    let buffer = await prediction.data();
    console.log(buffer);
    const result = buffer[0];

    let updatedResult = {};
    updatedResult["Loan Model Answer"] = result;

    const laRef = rdb.ref(`/loanApplications/${loanQuery.loanApplicationID}`);
    laRef.update(updatedResult)
        .then(() => {
            return response.status(201).json({result});
        })
        .catch((error) => {
            return response.status(201).json({result});
        });
}

exports.exportLoanCSV = (request, response) => {
    console.log('exporting');
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const hpRef = rdb.ref('/loanApplications');
    hpRef.once("value")
        .then( (data) => {
            const fiData = data.val();
            console.log(fiData);
            const json2csv = require("json2csv").parse;
            const csv = json2csv(fiData);
            response.setHeader(
                "Content-disposition",
                "attachment; filename=loanData.csv"
            )
            response.set("Content-Type", "text/csv");
            return response.status(201).send(csv);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}