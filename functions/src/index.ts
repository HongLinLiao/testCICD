import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onCall((data, context) => {
  return null;
});
