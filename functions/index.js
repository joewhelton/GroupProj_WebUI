const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const app = require('express')();
const auth = require('./util/auth');
const authenticate = require('./util/authenticate');
const authorize = require('./util/authorize');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE");
    next();
});

//General user endpoints
const {
    loginUser,
    getUserDetail
} = require('./APIs/v2/users');

    app.post('/V2/login', loginUser);
    app.get('/V2/user', authenticate, getUserDetail);

// Loan Officer endpoints
const {
    newLoanOfficer,
    getById,
    getAll,
    updateLoanOfficer,
    updateLoanOfficerById,
    uploadProfilePhoto,
    uploadProfilePhotoById
} = require('./APIs/v2/loanOfficers');

    app.post('/v2/loanofficer', newLoanOfficer);
    app.post('/v2/loanofficer/image/:userId', authenticate, authorize, uploadProfilePhotoById);
    app.post('/v2/loanofficer/image', authenticate, authorize, uploadProfilePhoto);
    app.get('/v2/loanofficer/:userId', authenticate, authorize, getById);
    app.get('/v2/loanofficer/', authenticate, authorize, getAll);
    app.put('/v2/loanofficer/:userId', authenticate, authorize, updateLoanOfficerById);
    app.put('/v2/loanofficer', authenticate, authorize, updateLoanOfficer);

// Financial Institution Endpoints
const {
    getFinancialInstitution,
    getAllFinancialInstitutions,
    newFinancialInstitution,
    updateFinancialInstitution,
    deleteFinancialInstitution,
    getLoanOfficersByFiID
} = require('./APIs/v2/financialInstitution');

    app.get('/v2/financialinstitution/:fiID/getLoanOfficers', authenticate, getLoanOfficersByFiID);
    app.get('/v2/financialinstitution/:fiID', authenticate, getFinancialInstitution);
    app.get('/v2/financialinstitution', authenticate, getAllFinancialInstitutions);
    app.post('/v2/financialinstitution', authenticate, authorize, newFinancialInstitution);
    app.put('/v2/financialinstitution/:fiID', authenticate, authorize, updateFinancialInstitution);
    app.delete('/v2/financialinstitution/:fiID', authenticate, authorize, deleteFinancialInstitution);

//House Price endpoints
const {
    predict,
    upload,
    exportCSV
} = require('./APIs/v2/housePrices');

    app.post('/v2/houseprice/predict', authenticate, predict);
    app.post('/v2/houseprice/upload', authenticate, authorize, upload);
    app.get('/v2/houseprice/export', authenticate, authorize, exportCSV);

exports.api = functions.https.onRequest(app);

//Loan Application endpoints
const {
    newLoanApplication,
    getLoanApplicationById,
    updateLoanApplicationById,
    getLoanApplicationByClient,  //This one actually gets used in the Client endpoint list further down
    uploadModel,
    predictLoan,
    saveDecision,
    exportLoanCSV
} = require('./APIs/v2/loanApplications');

    app.post('/v2/loanapplication/upload', authenticate, authorize, uploadModel);
    app.post('/v2/loanapplication', authenticate, authorize, newLoanApplication);
    app.get('/v2/loanapplication/:apID', authenticate, authorize, getLoanApplicationById);
    app.put('/v2/loanapplication/:apID', authenticate, authorize, updateLoanApplicationById);
    app.put('/v2/loanapplication/approve/:apID', authenticate, authorize, saveDecision);
    app.post('/v2/loanapplication/predict', authenticate, predictLoan);
    app.get('/v2/loanapplication/export', authenticate, authorize, exportLoanCSV);

//Client endpoints
const {
    getAllClients,
    getOwnClients,
    getClientById,
    setClientLoanOfficer
} = require('./APIs/v2/clients');

    app.get('/v2/client/own', authenticate, getOwnClients);
    app.get('/v2/client', authenticate, authorize, getAllClients);
    app.get('/v2/client/:clID/loanapplication', authenticate, authorize, getLoanApplicationByClient);
    app.get('/v2/client/:clID', authenticate, authorize, getClientById);
    app.put('/v2/client/:clID/setloanofficer', authenticate, authorize, setClientLoanOfficer);

//Chatbot endpoints
const {
    chatbot
} = require ('./APIs/v2/chatbot');

    app.post('/v2/chatbot', chatbot);


//Feedback Endpoints
const {
    getAllFeedback,
    getFeedbackById,
    updateFeedbackById,
    deleteFeedbackById
} = require('./APIs/v2/feedback');

    app.get('/v2/feedback', authenticate, authorize, getAllFeedback);
    app.get('/v2/feedback/:feedbackID', authenticate, authorize, getFeedbackById);
    app.put('/v2/feedback/:feedbackID', authenticate, authorize, updateFeedbackById);
    app.delete('/v2/feedback/:feedbackID', authenticate, authorize, deleteFeedbackById);