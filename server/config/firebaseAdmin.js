require("dotenv").config();
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : "";

if (!projectId) {
  console.error("❌ FIREBASE_PROJECT_ID missing in server/.env");
}

if (!clientEmail) {
  console.error("❌ FIREBASE_CLIENT_EMAIL missing in server/.env");
}

if (!privateKey) {
  console.error("❌ FIREBASE_PRIVATE_KEY missing in server/.env");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

module.exports = admin;