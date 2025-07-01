const admin = require("firebase-admin");
const serviceAccount = require("./config/projet-final-62a74-firebase-adminsdk-fbsvc-929f4a9659.json"); // ← vérifie bien le chemin

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
