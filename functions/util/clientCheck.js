const { rdb } = require('./admin');

exports.clientCheck = async (clientId, loanOfficerId) => {
    const clRef = rdb.ref(`/users/${clientId}`);
    const snapshot = await clRef.once('value');
    let client = (snapshot.val() || {});
    if(client.profile){
        if(client.profile.loanOfficerId === loanOfficerId){
            return true;
        }
    }
    return false;
}