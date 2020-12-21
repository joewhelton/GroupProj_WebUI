const { rdb } = require('../../util/admin');

exports.getAllFeedback = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const feedbackRef = rdb.ref(`/feedback/`);
    let snapshot = await feedbackRef.once('value');
    let feedback = ( snapshot.val() || {} );

    const tempUserInfo = {};

    for (const key of Object.keys(feedback)) {
        if(!tempUserInfo.hasOwnProperty(feedback[key].uid)) {
            console.log('fetching client info');
            const clientRef = rdb.ref(`/users/${feedback[key].uid}`);
            // eslint-disable-next-line no-await-in-loop
            let snapshot = await clientRef.once('value');
            let client = (snapshot.val() || {});
            tempUserInfo[feedback[key].uid] = {
                firstName: client.firstName,
                surname: client.surname
            }
        }
        feedback[key].userData = {
            firstName: tempUserInfo[feedback[key].uid].firstName,
            surname: tempUserInfo[feedback[key].uid].surname
        }
    }
    return response.status(201).json({feedback});
}

exports.getFeedbackById = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const feedbackID = request.params.feedbackID;
    const feedbackRef = rdb.ref(`/feedback/${feedbackID}`);
    const snapshot = await feedbackRef.once('value');

    let feedback = ( snapshot.val() || {} );
    const clientRef = rdb.ref(`/users/${feedback.uid}`);
    const clientSnapshot = await clientRef.once('value');
    let client = (clientSnapshot.val() || {});

    feedback.userData = {
        firstName: client.firstName,
        surname: client.surname
    }
    feedback.ID = feedbackID;

    return response.status(201).json({feedback});
}

exports.updateFeedbackById = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const feedbackID = request.params.feedbackID;
    const updatedFeedback = {
        msg: request.body.msg,
        rating: request.body.rating,
    }
    const feedbackRef = rdb.ref(`/feedback/${feedbackID}`);
    feedbackRef.update(updatedFeedback)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}

exports.deleteFeedbackById = (request, response) =>{
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const feedbackID = request.params.feedbackID;
    const feedbackRef = rdb.ref(`/feedback/${feedbackID}`);
    feedbackRef.remove()
        .then(() => {
            return response.json({message: 'Deleted successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot delete the record"
            });
        });
}