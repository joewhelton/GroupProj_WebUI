const { admin, db, rdb } = require('../util/admin');
const { getData } = require('../util/databaseHelpers');
const config = require('../util/config');
const firebase = require('firebase');
const md5 = require('md5');
const cors = require('cors')({origin: true});

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData, validateNewLoanOfficer } = require('../util/validators');

// Login
// exports.loginUser = (request, response) => {
//     return cors(request, response, () => {
//         response.set('Access-Control-Allow-Origin', '*');
//         const user = {
//             email: request.body.email,
//             password: request.body.password
//         }
//
//         const {valid, errors} = validateLoginData(user);
//         if (!valid) return response.status(400).json(errors);
//
//         firebase
//             .auth()
//             .signInWithEmailAndPassword(user.email, user.password)
//             .then((data) => {
//                 return data.user.getIdToken();
//             })
//             .then((token) => {
//                 return response.json({token});
//             })
//             .catch((error) => {
//                 console.error(error);
//                 return response.status(403).json({general: 'wrong credentials, please try again'});
//             })
//     });
// };

// exports.newLoanOfficer = (request, response) => {
//     const newOfficer = {
//         firstName: request.body.firstName,
//         lastName: request.body.lastName,
//         email: request.body.email,
//         password: request.body.password,
//         confirmPassword: request.body.confirmPassword,
//         phoneNumber: request.body.phoneNumber,
//     }
//     let ref = rdb
//         .ref('/finaiapp')
//         .child("users")
//         .orderByChild('email')
//         .equalTo(newOfficer.email);
//
//     //console.log(ref);
//
//     const { valid, errors } = validateNewLoanOfficer(newOfficer);
//     if (!valid) return response.status(400).json(errors);
//
//     let token, userId;
//
//     getData(ref)
//         .then((snapshot) => {
//             if(snapshot.val() !== null){
//                 return response.status(400).json({ username: 'A user is already registered to this email address' });
//             }
//             return firebase
//                 .auth()
//                 .createUserWithEmailAndPassword(
//                     newOfficer.email,
//                     newOfficer.password
//                 );
//         })
//         .then((data) =>{
//             userId = data.user.uid;
//             return data.user.getIdToken();
//         })
//         .then((idtoken) => {
//             token = idtoken;
//             const userCredentials = {
//                 firstName: newOfficer.firstName,
//                 lastName: newOfficer.lastName,
//                 email: newOfficer.email,
//                 createdAt: new Date().toISOString(),
//                 userId,
//                 authLevels: ['client', 'loanofficer']
//             };
//             const usersRef = rdb.ref('/users');
//             usersRef.child(userId)
//                 .set( userCredentials )
//                 .then(()=>{
//                     const loanOfficerRef = rdb.ref('/loanOfficer');
//
//
//                     return response.status(201).json({ token });
//                 })
//                 .catch((error)=> {
//                     console.log(error);
//                     return response.status(403).json({ error });
//                 });
//         })
//         .catch((error) => {
//             console.log(error);
//             return response.status(500).json({ error: 'Something went very wrong' });
//     });
// }

//Register
exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        country: request.body.country,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        username: request.body.username
    };

    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    let token, userId;

    db.doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idtoken) => {
            token = idtoken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                phoneNumber: newUser.phoneNumber,
                country: newUser.country,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db
                .doc(`/users/${newUser.username}`)
                .set(userCredentials);
        })
        .then(()=>{
            return response.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({ email: 'Email already in use' });
            } else {
                return response.status(500).json({ general: 'Something went wrong, please try again' });
            }
        });
}

// deleteImage = (imageName) => {
//     const bucket = admin.storage().bucket();
//     const path = `${imageName}`
//     return bucket.file(path).delete()
//         .then(() => {
//             return
//         })
//         .catch((error) => {
//             return
//         })
// }
//
// // Upload profile picture
// exports.uploadProfilePhoto = (request, response) => {
//     const BusBoy = require('busboy');
//     const path = require('path');
//     const os = require('os');
//     const fs = require('fs');
//     const busboy = new BusBoy({ headers: request.headers });
//
//     let imageFileName;
//     let imageToBeUploaded = {};
//
//     busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//         if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
//             return response.status(400).json({ error: 'Wrong file type submited' });
//         }
//         const imageExtension = filename.split('.')[filename.split('.').length - 1];
//         imageFileName = `${request.user.username}.${imageExtension}`;
//         const filePath = path.join(os.tmpdir(), imageFileName);
//         imageToBeUploaded = { filePath, mimetype };
//         file.pipe(fs.createWriteStream(filePath));
//     });
//     deleteImage(imageFileName);
//     busboy.on('finish', () => {
//         admin
//             .storage()
//             .bucket()
//             .upload(imageToBeUploaded.filePath, {
//                 resumable: false,
//                 metadata: {
//                     metadata: {
//                         contentType: imageToBeUploaded.mimetype
//                     }
//                 }
//             })
//             .then(() => {
//                 const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
//                 return db.doc(`/users/${request.user.username}`).update({
//                     imageUrl
//                 });
//             })
//             .then(() => {
//                 return response.json({ message: 'Image uploaded successfully' });
//             })
//             .catch((error) => {
//                 console.error(error);
//                 return response.status(500).json({ error: error.code });
//             });
//     });
//     busboy.end(request.rawBody);
// };

// //Get Details
// exports.getUserDetail = (request, response) => {
//     return cors(request, response, () => {
//         response.set('Access-Control-Allow-Origin', '*');
//         let userData = {};
//         db
//             .doc(`/users/${request.user.username}`)
//             .get()
//             .then((doc) => {
//                 // eslint-disable-next-line promise/always-return
//                 if (doc.exists) {
//                     userData.userCredentials = doc.data();
//                     return response.json(userData);
//                 }
//             })
//             .catch((error) => {
//                 console.error(error);
//                 return response.status(500).json({error: error.code});
//             });
//     });
// }

//Edit Details
// exports.updateUserDetails = (request, response) => {
//     let document = db.collection('users').doc(`${request.user.username}`);
//     document.update(request.body)
//         .then(()=> {
//             return response.json({message: 'Updated successfully'});
//         })
//         .catch((error) => {
//             console.error(error);
//             return response.status(500).json({
//                 message: "Cannot Update the value"
//             });
//         });
// }