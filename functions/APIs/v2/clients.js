const { rdb } = require('../../util/admin');

const getAllClients = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const clientRef = rdb.ref('/users');
    const query = clientRef.orderByChild("userRole/client").equalTo(true);
    query.once("value")
        .then( (data) => {
            const fiData = data.val();
            return response.status(201).json({fiData});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

const getOwnClients = (request, response) => {
    const loanOfficerId = request.user.user_id;
    const userRef = rdb.ref(`/users/${request.user.user_id}`);
}