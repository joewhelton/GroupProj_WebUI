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
    }
    console.log(client);
    return response.status(201).json(client);
}