const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const rdb = admin.database();

module.exports = { admin, db, rdb };
