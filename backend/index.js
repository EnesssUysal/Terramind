const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const { calculateWaterBalance } = require('./fao56Service');
const { calculateClimateData } = require('./climateService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { 
  systemState, 
  getEffectiveState, 
  runCalculations, 
  addHistory, 
  parameters 
} = require('./impactEngine');

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send initial state to the client
  socket.emit('state:init', systemState);
  socket.emit('state:effective', getEffectiveState());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Admin API
app.get('/api/admin/state', (req, res) => {
  res.json(systemState);
});

app.post('/api/admin/override', (req, res) => {
  const { parameter, value } = req.body;
  const oldValue = getEffectiveState()[parameter] || systemState.realData[parameter];
  
  systemState.overrides[parameter] = value;
  
  addHistory('OVERRIDE', parameter, oldValue, value);
  
  const effectiveState = getEffectiveState();
  
  const impacts = runCalculations();
  
  // Broadcast to all clients (admin & user)
  io.emit('state:update', systemState);
  io.emit('state:effective', effectiveState);
  
  io.emit('analysis:updated', { source: parameter, effect: 'Recalculated based on override', impacts });

  res.json({ success: true, effectiveState });
});

app.post('/api/admin/scenario', (req, res) => {
  const { name, overrides } = req.body;
  
  systemState.overrides = { ...systemState.overrides, ...overrides };
  addHistory('SCENARIO', name, 'N/A', 'Applied');
  
  const effectiveState = getEffectiveState();
  
  const impacts = runCalculations();
  
  io.emit('state:update', systemState);
  io.emit('state:effective', effectiveState);
  
  io.emit('analysis:updated', { source: name, effect: 'Scenario applied', impacts });

  res.json({ success: true, effectiveState });
});

app.post('/api/admin/reset', (req, res) => {
  systemState.overrides = {};
  addHistory('RESET', 'ALL', 'Overrides', 'Real Data');
  
  const effectiveState = getEffectiveState();
  
  const impacts = runCalculations();
  
  io.emit('state:update', systemState);
  io.emit('state:effective', effectiveState);
  
  io.emit('analysis:updated', { source: 'RESET', effect: 'Returned to real data', impacts });

  res.json({ success: true, effectiveState });
});

app.post('/api/admin/sensor-status', (req, res) => {
  const { sensor, status } = req.body;
  const oldValue = systemState.sensorStatus[sensor];
  
  systemState.sensorStatus[sensor] = status;
  addHistory('SENSOR_STATUS', sensor, oldValue, status);
  
  io.emit('state:update', systemState);
  
  res.json({ success: true, sensorStatus: systemState.sensorStatus });
});


// Mevcut Karbon Ayakizi Rotası (Korundu)
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

// İklim ve Su rotaları artık kendi içinden değil, impactEngine'den dönen sonuçları da alabilir
// veya frontend direkt olarak state'i dinleyebilir.
// Geriye dönük uyumluluk için, eğer bir HTTP isteği gelirse hesaplanmış güncel durumu döndürelim:
app.post('/api/analysis/water-soil', (req, res) => {
  res.json(systemState.calculatedResults.water || {});
});

app.post('/api/analysis/climate', (req, res) => {
  res.json(systemState.calculatedResults.climate || {});
});

server.listen(PORT, () => {
  console.log(`🚀 Backend API sunucusu ${PORT} portunda çalışıyor.`);
});