const { rdb } = require('../../util/admin');

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const { validateHousePriceQuery } = require('../../util/validators');

exports.predict = async (request, response) => {
    const houseQuery = {
        bedrooms: request.body.bedrooms,
        sqft_living: request.body.sqft_living,
        sqft_lot: request.body.sqft_lot,
        grade: request.body.grade,
        sqft_above: request.body.sqft_above,
        sqft_lot15: request.body.sqft_lot15,
    }

    const { valid, errors } = validateHousePriceQuery(houseQuery);
    if (!valid) return response.status(400).json(errors);

    const normValues = {
        bedrooms: {
            mean: 3.366889,
            std: 0.902464
        },
        sqft_living: {
            mean: 2078.696324,
            std: 913.585933
        },
        sqft_lot: {
            mean: 15125.213430,
            std: 41046.643512
        },
        grade: {
            mean: 7.655977,
            std: 1.174447
        },
        sqft_above: {
            mean: 1786.696324,
            std: 832.667747
        },
        sqft_lot15: {
            mean: 12801.776266,
            std: 26868.801571
        },
    }

    for (const [key, value] of Object.entries(houseQuery)) {
        houseQuery[key] = (
            value - normValues[key].mean
        ) / normValues[key].std;
    }

    if(request.body.userID){
        houseQuery.userID = request.body.userID
    }

    const model = await tf.loadLayersModel('file://./AI_Models/House_Price/model.json')
        .catch((error) => {
            console.log(`Error - Model Loading - ${error}`);
            return response.status(503).json({message: `${error}`});
        });

    let prediction;
    try {
        prediction = model.predict(tf.tensor([
            parseFloat(houseQuery.bedrooms),
            parseFloat(houseQuery.sqft_living),
            parseFloat(houseQuery.sqft_lot),
            parseFloat(houseQuery.grade),
            parseFloat(houseQuery.sqft_above),
            parseFloat(houseQuery.sqft_lot15)
        ], [1, 6]));
    } catch (error){
        console.log(`Error - Prediction failure - ${error}`);
        return response.status(500).json({message: `${error}`});
    }

    let buffer = await prediction.data();
    console.log(buffer);
    const result = buffer[0];

    if(request.body.userID){
        houseQuery.predictedPrice = result;
        houseQuery.createdDate = new Date().toISOString();
        const hpRef = rdb.ref('/houseData');
        const newHpRef = hpRef.push();
        await newHpRef.set(houseQuery);
    }

    return response.status(201).json({result});
}

exports.upload = async (request, response) => {
    console.log("Uploading");
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
            modelToBeUploaded = { filePath, mimetype, filename };
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
        const directory = './AI_Models/House_Price';
        //Remove existing files
        await fs.readdir(directory,{}, (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                fs.unlinkSync(`${directory}/${file}`);
            })
            console.log(modelToBeUploaded.filePath);
            fs.renameSync(modelToBeUploaded.filePath, `${directory}/model.json`);
            console.log(weightsToBeUploaded.filePath);
            fs.renameSync(weightsToBeUploaded.filePath, `${directory}/${weightsToBeUploaded.filename}`);
        });
        return response.json({ message: 'Uploaded successfully' });
    });

    busboy.end(request.rawBody);
}

exports.exportCSV = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const hpRef = rdb.ref('/houseData');
    hpRef.once("value")
        .then( (data) => {
            const fiData = data.val();
            let array = [];
            Object.keys(fiData).forEach((key) => {
                array.push(fiData[key]);
            })
            const json2csv = require("json2csv").parse;
            const csv = json2csv(array);
            response.setHeader(
                "Content-disposition",
                "attachment; filename=housePriceQueries.csv"
            )
            response.set("Content-Type", "text/csv");
            return response.status(201).send(csv);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}


