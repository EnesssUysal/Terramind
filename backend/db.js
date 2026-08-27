const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./firebase-key.json');

// Modüler yapıyla Firebase'i başlatıyoruz
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://terramind-adb3e-default-rtdb.firebaseio.com/" // Kendi veritabanı URL'ni buraya yapıştır
});

// Veritabanı referansını dışarı aktarıyoruz
const db = getDatabase();
module.exports = db;
