const { rdb } = require('../../util/admin');

exports.getAllClients = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const clientRef = rdb.ref('/users');
    const query = clientRef.orderByChild("userRole").equalTo("client");
    query.once("value")
        .then( (data) => {
            const clientData = data.val();
            return response.status(201).json({clientData});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

exports.getOwnClients = (request, response) => {
    const loanOfficerId = request.user.user_id;
    const clientRef = rdb.ref('/users');
    const query = clientRef.orderByChild("profile/loanOfficerId").equalTo(loanOfficerId);
    query.once("value")
        .then( (data) => {
            const clientData = data.val();
            return response.status(201).json({clientData});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

exports.getClientById = async (request, response) => {
    const clID = request.params.clID;
    const clRef = rdb.ref(`/users/${clID}`);
    const snapshot = await clRef.once('value');
    let client = (snapshot.val() || {});
    if(!request.user.userRoles.sysAdmin && client.profile){
        if(client.profile.loanOfficerId !== request.user.user_id){
            return response.status(403).json({ error: 'Unauthorized operation' });
        }
    } else if(!request.user.userRoles.sysAdmin && !client.profile){
        return response.status(403).json({ error: 'Unauthorized operation - No Client Profile' });
    }
    if(client.profile){
        if(client.profile.loanOfficerId){
            const loRef = rdb.ref(`/users/${client.profile.loanOfficerId}`);
            const loSnapshot = await loRef.once('value');
            let lo = (loSnapshot.val() || {});
            client.profile.loanOfficer = lo;
        }
    }

    console.log(client);
    return response.status(201).json(client);
}

exports.setClientLoanOfficer = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const clID = request.params.clID;
    const updateClient = { loanOfficerId: request.body.loanOfficerId };

    const clRef = rdb.ref(`/users/${clID}/profile`);
    clRef.update(updateClient)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}