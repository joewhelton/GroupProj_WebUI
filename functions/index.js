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
    updateLoanOfficer,
    updateLoanOfficerById,
    uploadProfilePhoto,
    uploadProfilePhotoById
} = require('./APIs/v2/loanOfficers');

    app.post('/v2/loanofficer', newLoanOfficer);
    app.post('/v2/loanofficer/image/:userId', authenticate, authorize, uploadProfilePhotoById);
    app.post('/v2/loanofficer/image', authenticate, authorize, uploadProfilePhoto);
    app.get('/v2/loanofficer/:userId', authenticate, authorize, getById);
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
// const {
//     predict
// } = require('./APIs/v2/model');
const {
    predict
} = require('./APIs/v2/housePrices')

    app.get('/v2/houseprice/predict', authenticate, predict);

exports.api = functions.https.onRequest(app);