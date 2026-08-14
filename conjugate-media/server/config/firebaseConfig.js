/**
 * Conjugate Media Server - Firebase Admin Initialization
 * 
 * Provides authenticated Firestore database access scoped by user credentials.
 * Includes graceful fallback for local development or offline environments.
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db = null;
let isFirebaseConnected = false;

try {
  // Check for service account key in current directory or main server directory
  const localKeyPath = path.join(__dirname, '../serviceAccountKey.json');
  const mainKeyPath = path.join(__dirname, '../../../server/serviceAccountKey.json');

  let serviceAccount = null;
  if (fs.existsSync(localKeyPath)) {
    serviceAccount = require(localKeyPath);
  } else if (fs.existsSync(mainKeyPath)) {
    serviceAccount = require(mainKeyPath);
  }

  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'engageiqv1'
    });
    db = admin.firestore();
    isFirebaseConnected = true;
    console.log('[Conjugate Media Firebase] Connected to Firestore project:', serviceAccount.project_id);
  } else if (admin.apps.length) {
    db = admin.firestore();
    isFirebaseConnected = true;
  }
} catch (error) {
  console.warn('[Conjugate Media Firebase] Warning: Could not initialize Firebase Admin SDK. Using resilient local store.', error.message);
  isFirebaseConnected = false;
  db = null;
}

module.exports = {
  admin,
  db,
  isFirebaseConnected
};
