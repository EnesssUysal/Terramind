const db = require('./db');
const carbonRef = db.ref('terramind_live/carbon_footprint');

function calculateCarbon(nitrogenKg, dieselL, electricityKwh) {
  // 1. Güncel Emisyon (IPCC Katsayıları: Azot=4.68, Dizel=2.64, Elektrik=0.44)
  const currentEmissions = (nitrogenKg * 4.68) + (dieselL * 2.64) + (electricityKwh * 0.44);
  
  // 2. Geleneksel Tarım Kıyaslaması (%20 fazla gübre ve %30 fazla elektrik israfı varsayımı)
  const traditionalEmissions = ((nitrogenKg / 0.8) * 4.68) + (dieselL * 2.64) + ((electricityKwh / 0.7) * 0.44);
  
  // 3. Tasarruf ve Skor Hesaplaması
  const savedEmissions = traditionalEmissions - currentEmissions;
  const efficiencyRatio = traditionalEmissions > 0 ? savedEmissions / traditionalEmissions : 0;
  const optScore = Math.min(100, Math.max(0, Math.floor(efficiencyRatio * 100 * 3.5)));

  return {
    total_co2_kg: parseFloat(currentEmissions.toFixed(2)),
    saved_co2_kg: Math.max(0, parseFloat(savedEmissions.toFixed(2))),
    optimization_score: optScore
  };
}

// Örnek Girdiler (Frontend bağlanana kadar test amaçlı manuel değerler)
const inputs = {
  nitrogen: 2.5,  // kg
  diesel: 1.2,    // litre
  electricity: 12.0 // kWh
};

// Matematiği çalıştır ve sonucu al
const result = calculateCarbon(inputs.nitrogen, inputs.diesel, inputs.electricity);

// Sonucu Firebase'e gönder
carbonRef.set(result)
  .then(() => {
    console.log('✅ Karbon matematiği çözüldü ve Firebase\'e başarıyla yazıldı:');
    console.log(result);
    process.exit(0); // İşlem bitince terminali kapat
  })
  .catch(err => {
    console.error('❌ Firebase Hatası:', err);
    process.exit(1);
  });