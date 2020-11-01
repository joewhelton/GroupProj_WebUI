const { admin, rdb } = require('../../util/admin');
const { getData } = require('../../util/databaseHelpers');
const config = require('../../util/config');
const firebase = require('firebase');
const { validateLoginData } = require('../../util/validators');

firebase.initializeApp(config);

//Login
exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const {valid, errors} = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(async (data) => {
            console.log(data.user.uid);
            const userRef = rdb.ref(`/users/${data.user.uid}`);
            const snapshot = await userRef.once('value');
            if(snapshot.val().userRoles.loanOfficer || snapshot.val().userRoles.sysAdmin) {
                return data.user.getIdToken();
            } else {
                throw new Error('Insufficient access');
            }
        })
        .then((token) => {
            return response.json({token});
        })
        .catch((error) => {
            console.error(error);
            return response.status(403).json({general: 'wrong credentials, please try again'});
        })
};

//Get own user details
exports.getUserDetail = (request, response) => {
    let userData = {};
    const userRef = rdb.ref(`/users/${request.user.user_id}`);
    userRef.once('value')
        .then((data)=>{
            userData = data.val();
            userData.userId = request.user.user_id;
            return response.json(userData);
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({error: error.code});
        });
}
