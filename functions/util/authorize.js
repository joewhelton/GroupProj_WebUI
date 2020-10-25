const { rdb } = require('./admin');

module.exports = (request, response, next) => {
    const user_id = request.user.user_id;
    const userRef = rdb.ref(`/users/${user_id}`);
    userRef.once("value")
        .then( (data) => {
            request.user.userRoles = data.val().userRoles;
            return next();
        })
        .catch((error) => {
            console.error('Error while retrieving user auth levels', error);
            return response.status(403).json(error);
        });
};