const { calculateWaterBalance } = require('./fao56Service');
const { calculateClimateData } = require('./climateService');

// Merkezi Parametre Kayıt ve Etki-Tepki Motoru
const parameters = {
  soilMoisture: { id: 'soilMoisture', name: 'Toprak Nemi', category: 'Toprak', unit: '%', min: 0, max: 100, type: 'number' },
  temperature: { id: 'temperature', name: 'Hava Sıcaklığı', category: 'Meteoroloji', unit: '°C', min: -20, max: 60, type: 'number' },
  pH: { id: 'pH', name: 'Toprak pH', category: 'Kimyasal', unit: '', min: 0, max: 14, type: 'number' },
  ec: { id: 'ec', name: 'Toprak EC', category: 'Kimyasal', unit: 'dS/m', min: 0, max: 20, type: 'number' },
  nitrogen: { id: 'nitrogen', name: 'Azot (N)', category: 'Besin', unit: 'kg/ha', min: 0, max: 500, type: 'number' },
  phosphorus: { id: 'phosphorus', name: 'Fosfor (P)', category: 'Besin', unit: 'kg/ha', min: 0, max: 300, type: 'number' },
  potassium: { id: 'potassium', name: 'Potasyum (K)', category: 'Besin', unit: 'kg/ha', min: 0, max: 500, type: 'number' },
  radiation: { id: 'radiation', name: 'Güneş Radyasyonu', category: 'Meteoroloji', unit: 'MJ/m²', min: 0, max: 40, type: 'number' },
  humidity: { id: 'humidity', name: 'Bağıl Nem', category: 'Meteoroloji', unit: '%', min: 0, max: 100, type: 'number' },
  windSpeed: { id: 'windSpeed', name: 'Rüzgar Hızı', category: 'Meteoroloji', unit: 'm/s', min: 0, max: 50, type: 'number' },
};

// Gerçek veriler ve Override verileri
let systemState = {
  overrides: {},
  realData: {
    soilMoisture: 32,
    temperature: 24,
    pH: 6.8,
    ec: 1.2,
    nitrogen: 86,
    phosphorus: 42,
    potassium: 120,
    radiation: 22.4,
    humidity: 45,
    windSpeed: 12,
  },
  sensorStatus: {
    soilMoisture: 'ONLINE',
    temperature: 'ONLINE',
    pH: 'ONLINE',
    ec: 'ONLINE',
    npk: 'ONLINE',
    weather: 'ONLINE'
  },
  history: [],
  calculatedResults: {}
};

// Yardımcı: Geçerli (Etkin) Durumu Al (Gerçek veri + Override)
const getEffectiveState = () => {
  return { ...systemState.realData, ...systemState.overrides };
};

// Etki-Tepki Zincirini Çalıştır
const runCalculations = () => {
  const effective = getEffectiveState();
  const impacts = [];
  
  // 1. İklim & Sıcaklık Analizi (GDD vb.)
  try {
    const climateResult = calculateClimateData({
      Tmax: effective.temperature + 5, // basit simülasyon Tmax
      Tmin: effective.temperature - 5,
      Tavg: effective.temperature,
      Tbase: 10,
      radiation: effective.radiation,
      RUE: 1.8,
      hasRadiationData: true
    });
    systemState.calculatedResults.climate = climateResult;
    impacts.push('İklim & GDD Analizi güncellendi');
  } catch(e) {
    console.error("Climate calculation failed", e);
  }

  // 2. Su ve Toprak Analizi (FAO-56)
  try {
    // ETo'yu sıcaklık ve rüzgara göre tahmini değiştirelim (basitleştirilmiş)
    let etoBase = 4.5;
    if (effective.temperature > 30) etoBase += 1.5;
    if (effective.humidity < 30) etoBase += 0.5;
    if (effective.windSpeed > 10) etoBase += 0.5;

    const waterResult = calculateWaterBalance({
      thetaFC: 0.35,
      thetaWP: 0.15,
      currentTheta: effective.soilMoisture / 100, // Yüzdeden volumetrik değere
      Zr: 0.6,
      p: 0.5,
      Kc: 1.1,
      ETo: etoBase
    });
    systemState.calculatedResults.water = waterResult;
    impacts.push('Su Dengesi, Su Stresi ve Sulama İhtiyacı yeniden hesaplandı');
  } catch(e) {
    console.error("Water calculation failed", e);
  }
  
  return impacts;
};

// Sistemi Başlat
runCalculations();

module.exports = {
  parameters,
  systemState,
  getEffectiveState,
  runCalculations,
  addHistory: (action, parameter, oldValue, newValue, impacts = [], status = 'Başarılı') => {
    systemState.history.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      parameter,
      oldValue,
      newValue,
      impacts,
      status
    });
    if (systemState.history.length > 200) systemState.history.pop();
  }
};
