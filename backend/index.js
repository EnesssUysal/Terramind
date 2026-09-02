const express = require('express');
const cors = require('cors');
const db = require('./db');
const { calculateWaterBalance } = require('./fao56Service');
const { calculateClimateData } = require('./climateService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- SIMULATION STATE ENGINE ---
let simulationState = {
  isSimulationActive: false,
  scenario: null, // e.g. 'drought', 'heavy_rain'
  overrides: {
    soilMoisture: null,
    temperature: null,
    humidity: null,
    rainfall: null,
    windSpeed: null,
    radiation: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    ph: null,
    ec: null,
    sand: null,
    silt: null,
    clay: null,
    organicMatter: null,
    bulkDensity: null,
    soilDepth: null,
    irrigationAmount: null,
    irrigationDuration: null
  },
  sensorStatus: {
    soilMoisture: 'online', // 'online', 'offline', 'noise'
    temperature: 'online',
    weather: 'online',
    npk: 'online',
    ph_ec: 'online'
  },
  logs: []
};

let clients = [];

const broadcastState = () => {
  const data = JSON.stringify(simulationState);
  clients.forEach(client => client.res.write(`data: ${data}\n\n`));
};

const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  simulationState.logs.unshift(`[${timestamp}] ${message}`);
  if (simulationState.logs.length > 50) simulationState.logs.pop();
};

// SSE Endpoint for Main Platform
app.get('/api/live-sync', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  
  res.write(`data: ${JSON.stringify(simulationState)}\n\n`);
  
  const clientId = Date.now();
  clients.push({ id: clientId, res });
  
  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Admin Endpoints
app.post('/api/admin/override', (req, res) => {
  const { param, value } = req.body;
  if (simulationState.overrides[param] !== undefined) {
    const oldVal = simulationState.overrides[param];
    simulationState.overrides[param] = value;
    simulationState.isSimulationActive = true;
    addLog(`${param.toUpperCase()} OVERRIDE: ${oldVal !== null ? oldVal : 'REAL'} → ${value}`);
    broadcastState();
    res.json({ success: true, state: simulationState });
  } else {
    res.status(400).json({ error: 'Invalid param' });
  }
});

app.post('/api/admin/scenario', (req, res) => {
  const { scenario, name, overrides, sensorStatus } = req.body;
  simulationState.isSimulationActive = true;
  simulationState.scenario = scenario;
  
  // Apply all dynamic overrides provided by the frontend
  if (overrides) {
    Object.keys(overrides).forEach(key => {
      simulationState.overrides[key] = overrides[key];
    });
  }

  if (sensorStatus) {
    Object.keys(sensorStatus).forEach(key => {
      simulationState.sensorStatus[key] = sensorStatus[key];
    });
  }
  
  addLog(`SCENARIO ACTIVATED: ${name || scenario}`);
  
  broadcastState();
  res.json({ success: true, state: simulationState });
});

app.post('/api/admin/reset', (req, res) => {
  simulationState = {
    isSimulationActive: false,
    scenario: null,
    overrides: {
      soilMoisture: null, temperature: null, humidity: null,
      rainfall: null, windSpeed: null, radiation: null,
      nitrogen: null, phosphorus: null, potassium: null,
      ph: null, ec: null, sand: null, silt: null, clay: null,
      organicMatter: null, bulkDensity: null, soilDepth: null,
      irrigationAmount: null, irrigationDuration: null
    },
    sensorStatus: {
      soilMoisture: 'online', temperature: 'online', weather: 'online',
      npk: 'online', ph_ec: 'online'
    },
    logs: simulationState.logs // keep logs
  };
  addLog('SYSTEM RESET: Returned to REAL DATA MODE');
  broadcastState();
  res.json({ success: true, state: simulationState });
});

// GET state explicitly (for initial load if not using SSE)
app.get('/api/admin/state', (req, res) => {
  res.json(simulationState);
});


// --- MEVCUT ROTALAR (Güncellenmiş) ---

app.post('/api/carbon/calculate', async (req, res) => {
  try {
    const { nitrogen, diesel, electricity } = req.body;
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

app.post('/api/analysis/water-soil', (req, res) => {
  try {
    let params = { ...req.body };
    
    // Eğer simülasyon aktifse parametreleri ez
    if (simulationState.isSimulationActive) {
      if (simulationState.overrides.soilMoisture !== null) {
        params.currentTheta = simulationState.overrides.soilMoisture / 100;
        addLog('WATER BALANCE RECALCULATION: Overridden Moisture applied');
      }
      if (simulationState.overrides.temperature !== null) {
        // Rough ET0 recalculation mock for demo
        params.ETo = (simulationState.overrides.temperature * 0.2).toFixed(1); 
      }
      // Add more as needed for soil params...
    }
    
    const analysisResult = calculateWaterBalance(params);
    
    if (simulationState.isSimulationActive) {
      analysisResult.isSimulated = true;
      analysisResult.simulationState = simulationState; // Pass full state so frontend can show overrides
    }

    res.json(analysisResult);
  } catch (error) {
    console.error('Water/Soil analysis error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/analysis/climate', (req, res) => {
  try {
    let params = { ...req.body };
    
    if (simulationState.isSimulationActive) {
      if (simulationState.overrides.temperature !== null) params.temperature = simulationState.overrides.temperature;
      if (simulationState.overrides.humidity !== null) params.humidity = simulationState.overrides.humidity;
      if (simulationState.overrides.rainfall !== null) params.precipitation = simulationState.overrides.rainfall;
      if (simulationState.overrides.windSpeed !== null) params.windSpeed = simulationState.overrides.windSpeed;
    }

    const analysisResult = calculateClimateData(params);
    if (simulationState.isSimulationActive) {
      analysisResult.isSimulated = true;
    }
    res.json(analysisResult);
  } catch (error) {
    console.error('Climate analysis error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API sunucusu ${PORT} portunda çalışıyor.`);
});