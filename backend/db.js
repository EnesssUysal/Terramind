const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const fs = require('fs');
const path = require('path');

let db = null;

try {
  const keyPath = path.join(__dirname, 'firebase-key.json');
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    // Modüler yapıyla Firebase'i başlatıyoruz
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://terramind-adb3e-default-rtdb.firebaseio.com/" // Kendi veritabanı URL'ni buraya yapıştır
    });
    db = getDatabase();
  } else {
    console.warn("⚠️ firebase-key.json bulunamadı. Firebase DB özellikleri (Karbon vs.) devre dışı.");
    // Sahte bir db nesnesi oluştur (Crash olmaması için)
    db = { ref: () => ({ set: async () => console.log('Mock Firebase set') }) };
  }
} catch (error) {
  console.error("Firebase başlatılamadı:", error);
  db = { ref: () => ({ set: async () => console.log('Mock Firebase set') }) };
}

// Veritabanı referansını dışarı aktarıyoruz
module.exports = db;
