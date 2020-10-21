const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const app = require('express')();
const auth = require('./util/auth');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos');

app.get('/todos', auth, getAllTodos);
app.post('/todos', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users');

app.post('/login', loginUser);

app.post('/signup', signUpUser);

app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);
app.post('/user/image', auth, uploadProfilePhoto);

exports.api = functions.https.onRequest(app);