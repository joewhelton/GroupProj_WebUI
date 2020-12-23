const { admin, rdb } = require('../../util/admin');
const { getData } = require('../../util/databaseHelpers');
const config = require('../../util/config');
const firebase = require('firebase');
const { validateNewLoanOfficer, validateUpdateLoanOfficer } = require('../../util/validators');

exports.getById = (request, response) => {
    const userId = request.params.userId;
    const userRef = rdb.ref(`/users/${userId}`);
    userRef.once("value")
        .then( (data) => {
            const userData = data.val();
            if(userData && !userData.userRoles.loanOfficer) {
                data = null;
            }
            return response.status(201).json({data});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

exports.getAll = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const userRef = rdb.ref(`/users/`);
    const query = userRef.orderByChild("userRoles/loanOfficer").equalTo(true);

    const snapshot = await query.once('value');
    return response.status(201).json(snapshot.val() || {});
}

exports.newLoanOfficer = (request, response) => {
    const newOfficer = {
        firstName: request.body.firstName,
        surname: request.body.surname,
        email: request.body.email,
        userRoles: {
            client: false,
            loanOfficer: true,
            sysAdmin: false
        },
        profile: {
            mobile: request.body.phoneNumber || '',
            description: request.body.description || ''
        },
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
    }

    const userRef = rdb.ref('/users');

    const { valid, errors } = validateNewLoanOfficer(newOfficer);
    if (!valid) return response.status(400).json(errors);

    let token, userId;
    const query = userRef.orderByChild('email').equalTo(newOfficer.email);

    getData(query)
        .then((snapshot) => {
            if(snapshot.val() !== null){
                return response.status(400).json({ username: 'A user is already registered to this email address' });
            }
            return firebase
                .auth()
                .createUserWithEmailAndPassword(
                    newOfficer.email,
                    newOfficer.password
                );
        })
        .then((data) =>{
            userId = data.user.uid;
            console.log(data.user.getIdToken());
            return data.user.getIdToken();
        })
        // eslint-disable-next-line promise/always-return
        .then((idtoken) => {
            token = idtoken;
            delete newOfficer.password;
            delete newOfficer.confirmPassword;
            newOfficer.createdAt = new Date().toISOString(),
                // eslint-disable-next-line promise/no-nesting
            userRef.child(userId)
                .set( newOfficer )
                .then(()=>{
                    return response.status(201).json({ token });
                })
                .catch((error)=> {
                    console.log(error);
                    return response.status(400).json({ error });
                });
        })
        .catch((error) => {
            console.log(error);
            return response.status(400).json({ error: 'Something went wrong creating the Loan Officer' });
        });
}

const createUpdateUser = (requestBody) => {
    let updateUser = {};
    if(requestBody.firstName){
        updateUser.firstName = requestBody.firstName;
    }
    if(requestBody.surname){
        updateUser.firstName = requestBody.firstName;
    }
    if(requestBody.profile){
        updateUser.profile = {};
        if(requestBody.profile.mobile){
            updateUser.profile.mobile = requestBody.profile.mobile;
        }
        if(requestBody.profile.description){
            updateUser.profile.description = requestBody.profile.description;
        }
        if(requestBody.profile.financialInstitutionID){
            updateUser.profile.financialInstitutionID = requestBody.profile.financialInstitutionID;
        }
    }
    return updateUser;
}

exports.updateLoanOfficer = async (request, response) => {
    if(!request.user.userRoles.loanOfficer){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const updateUser = createUpdateUser(request.body);
    const { valid, errors } = await validateUpdateLoanOfficer(updateUser);
    if (!valid) {
        console.log(valid);
        return response.status(400).json(errors);
    }
    const userRef = rdb.ref(`/users/${request.user.user_id}`);
    const snapshot = await userRef.once('value');
    const user = snapshot.val();
    updateUser.profile = Object.assign(user.profile, updateUser.profile);

    userRef.update(updateUser)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}

exports.updateLoanOfficerById = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const updateUser = createUpdateUser(request.body);
    const { valid, errors } = await validateUpdateLoanOfficer(updateUser);
    if (!valid) {
        console.log(valid);
        return response.status(400).json(errors);
    }
    const userId = request.params.userId;
    const userRef = rdb.ref(`/users/${userId}`);
    const snapshot = await userRef.once('value');
    const user = snapshot.val();
    updateUser.profile = Object.assign(user.profile, updateUser.profile);

    userRef.update(updateUser)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {
            return
        })
        .catch((error) => {
            return
        })
}

exports.uploadProfilePhoto = (request, response) => {
    if(!request.user.userRoles.loanOfficer){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({ error: 'Wrong file type submitted' });
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${request.user.user_id}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName);
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                resumable: false,
                destination: `loanOfficerImages/${imageFileName}`,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then((data) => {
                console.log(data[0].id);
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${data[0].id}?alt=media`;
                const userRef = rdb.ref(`/users/${request.user.user_id}/profile`);
                return userRef.update({photo: imageUrl});
            })
            .then(() => {
                return response.json({ message: 'Image uploaded successfully' });
            })
            .catch((error) => {
                console.error(error);
                return response.status(500).json({ error: error.code });
            });
    });
    busboy.end(request.rawBody);
}

exports.uploadProfilePhotoById = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploaded = {};
    const userId = request.params.userId;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({ error: 'Wrong file type submitted' });
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${userId}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName);
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                resumable: false,
                destination: 'loanOfficerImages',
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                const userRef = rdb.ref(`/users/${userId}`);
                return userRef.update({profile: {photo: imageUrl}});
            })
            .then(() => {
                return response.json({ message: 'Image uploaded successfully' });
            })
            .catch((error) => {
                console.error(error);
                return response.status(500).json({ error: error.code });
            });
    });
    busboy.end(request.rawBody);
}