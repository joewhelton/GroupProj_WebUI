const { rdb } = require('../../util/admin');
const clientCheck = require('../../util/clientCheck');
const { validateNewLoanApplication } = require('../../util/validators');

exports.newLoanApplication = (request, response) => {
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