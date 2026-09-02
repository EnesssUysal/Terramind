const express = require('express');
const cors = require('cors');
const db = require('./db');
const { calculateWaterBalance } = require('./fao56Service');
const { calculateClimateData } = require('./climateService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mevcut Karbon Ayakizi Rotası (Korundu)
app.post('/api/carbon/calculate', async (req, res) => {
  try {
    const { nitrogen, diesel, electricity } = req.body;
    
    // Varsayılan değerler frontend'den gelmezse
    const n = nitrogen || 2.5;
    const d = diesel || 1.2;
    const e = electricity || 12.0;

    const currentEmissions = (n * 4.68) + (d * 2.64) + (e * 0.44);
    const traditionalEmissions = ((n / 0.8) * 4.68) + (d * 2.64) + ((e / 0.7) * 0.44);
    const savedEmissions = traditionalEmissions - currentEmissions;
    const efficiencyRatio = traditionalEmissions > 0 ? savedEmissions / traditionalEmissions : 0;
    const optScore = Math.min(100, Math.max(0, Math.floor(efficiencyRatio * 100 * 3.5)));

    const result = {
      total_co2_kg: parseFloat(currentEmissions.toFixed(2)),
      saved_co2_kg: Math.max(0, parseFloat(savedEmissions.toFixed(2))),
      optimization_score: optScore,
      timestamp: new Date().toISOString()
    };

    const carbonRef = db.ref('terramind_live/carbon_footprint');
    await carbonRef.set(result);
    
    res.json(result);
  } catch (error) {
    console.error('Carbon calc error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Yeni Su/Toprak Nemi (FAO-56) Simülasyon Rotası
app.post('/api/analysis/water-soil', (req, res) => {
  try {
    const params = req.body;
    // params içerisinde thetaFC, thetaWP, currentTheta, Zr, p, Kc, ETo gelebilir.
    // Gelmeyenler için fao56Service içinde varsayılan (demo) değerler kullanılacak.
    
    const analysisResult = calculateWaterBalance(params);
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Water/Soil analysis error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Yeni İklim ve Güneş Analizi Rotası
app.post('/api/analysis/climate', (req, res) => {
  try {
    const params = req.body;
    const analysisResult = calculateClimateData(params);
    res.json(analysisResult);
  } catch (error) {
    console.error('Climate analysis error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API sunucusu ${PORT} portunda çalışıyor.`);
});