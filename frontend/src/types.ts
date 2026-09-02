export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  field: string;
  duration: string;
  actionLabel: string;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  area: string;
  lastSync: string;
  status: 'Sağlıklı' | 'Dikkat' | 'Kritik';
  aiSummary: string;
  weatherImpact: string;
  aiConfidence: number;
  criticalAlerts: number;
  activeSensors: number;
  tasksCount: number;
  nextAction: string;
  sensors: {
    moisture: { value: number; change: number; status: 'up' | 'down' | 'stable'; recommendation: string };
    temperature: { value: number; change: number; status: 'up' | 'down' | 'stable'; recommendation: string };
    nitrogen: { value: number; change: number; status: 'up' | 'down' | 'stable'; recommendation: string };
    ph: { value: number; change: number; status: 'up' | 'down' | 'stable'; recommendation: string };
  };
  irrigation: {
    current: 'Açık' | 'Kapalı';
    next: string;
    coverage: number;
  };
  ndvi: number;
  history: { day: string; moisture: number; ndvi: number }[];
}

export interface WaterSavingEvent {
  id: string;
  title: string;
  detail: string;
  savedLiters: number;
  time: string;
  field: string;
  type: 'saving' | 'irrigation' | 'alert';
}

export interface CarbonFootprintData {
  farmAverageTonPerHa: number;
  regionAveragePerHa: number;
  tractorEmissionFactor: number;
  history: { month: string; farm: number; region: number }[];
}

export interface WeatherData {
  currentTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  hourly: { time: string; temp: number; icon: string }[];
  daily: { day: string; min: number; max: number; icon: string; rainProb: number }[];
  recommendation: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  priority: 'Critical' | 'Warning' | 'Info' | 'Success';
  description: string;
  relatedField?: string;
}

export interface SensorItem {
  id: string;
  name: string;
  type: string;
  field: string;
  location: string;
  latestReading: string;
  battery: number;
  signal: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastSync: string;
  status: 'Active' | 'Offline' | 'Warning';
}

export interface AlertItem {
  id: string;
  title: string;
  type: 'Critical' | 'Warning' | 'Info' | 'Resolved';
  time: string;
  field: string;
  description: string;
}

export interface WaterAnalysisResult {
  parameters: {
    thetaFC: number;
    thetaWP: number;
    currentTheta: number;
    Zr: number;
    p: number;
    Kc: number;
    ETo: number;
  };
  results: {
    TAW: number;
    RAW: number;
    Dr: number;
    Ks: number;
    ETc: number;
    stressStatus: string;
    irrigationStatus: string;
  };
  aiSummary: string;
  history: {
    date: string;
    Dr: number;
    TAW: number;
    RAW: number;
    Ks: number;
    ETc: number;
    P: number;
    I: number;
    moisture: number;
  }[];
}

export interface ClimateAnalysisResult {
  parameters: {
    Tmax: number;
    Tmin: number;
    Tavg: number;
    Tbase: number;
    radiation: number | null;
    RUE: number;
    hasRadiationData: boolean;
  };
  results: {
    dailyGDD: number;
    totalGDD: number;
    biomassEstimate: number | null;
    tempStatus: string;
    tempMessage: string;
    radStatus: string;
    radMessage: string;
    growthStatus: string;
    growthMessage: string;
  };
  history: {
    date: string;
    Tmax: number;
    Tmin: number;
    Tavg: number;
    GDD: number;
    radiation: number | null;
  }[];
}

export interface NPKData {
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  unit: "mg/kg";
  source: "sensor" | "laboratory" | "demo" | "none";
  timestamp?: string;
  calibrationStatus?: "calibrated" | "needs_calibration" | "evaluating";
  dataQuality?: number;
}

export interface NPKAnalysisResult {
  npk: NPKData;
  soil: {
    pH: number | null;
    ec: number | null; // dS/m
    organicMatter: number | null; // %
    soilType: string | null;
  };
  crop: {
    type: string | null;
    growthStage: string | null;
    targetYield: string | null;
  };
  analysis: {
    nitrogenStatus: "Yüksek" | "Yeterli" | "Orta" | "Düşük" | "Kritik" | "Veri Yok";
    phosphorusStatus: "Yüksek" | "Yeterli" | "Orta" | "Düşük" | "Kritik" | "Veri Yok";
    potassiumStatus: "Yüksek" | "Yeterli" | "Orta" | "Düşük" | "Kritik" | "Veri Yok";
    overallStatus: "Dengeli" | "İyi" | "Dikkat" | "Kritik" | "Veri Yok";
    overallMessage: string;
    nitrogenMessage: string;
    phosphorusMessage: string;
    potassiumMessage: string;
  };
  fertilizerRecommendation: {
    isReady: boolean;
    missingData: string[];
    message: string;
  };
}

export interface SoilPHData {
  value: number | null;
  unit: "pH";
  source: "sensor" | "laboratory" | "demo" | "none";
  timestamp?: string;
  calibrationStatus: "calibrated" | "needs_calibration" | "not_available";
}

export interface PHAnalysisResult {
  ph: SoilPHData;
  soil: {
    nitrogen: number | null;
    phosphorus: number | null;
    potassium: number | null;
    ec: number | null;
    moisture: number | null;
    temperature: number | null;
    organicMatter: number | null;
    soilType: string | null;
  };
  crop: {
    type: string | null;
    growthStage: string | null;
  };
  analysis: {
    status: "Asidik" | "Hafif asidik" | "Nötr" | "Hafif alkali" | "Alkali" | "Veri Yok";
    message: string;
    cropSpecificMessage: string | null;
  };
}

export interface SoilECData {
  value: number | null;
  unit: "dS/m";
  source: "sensor" | "laboratory" | "demo" | "none";
  temperature?: number | null;
  moisture?: number | null;
  temperatureCompensation: "applied" | "sensor_applied" | "not_applied" | "unavailable";
  calibrationStatus: "calibrated" | "needs_calibration" | "not_available";
  timestamp?: string;
}

export interface SoilSalinityAnalysis {
  eca: number | null;
  ece: number | null;
  eceSource: "laboratory" | "calibrated_model" | "unavailable";
  salinityClass?: string;
  cropRisk?: string;
  relativeYield?: number | null;
}

export interface DetailedWeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export interface WeatherHourlyData {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  weatherCode: number;
  frostRisk: string;
  sprayingSuitability: string;
  heatStress: string;
}

export interface WeatherDailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windDirection: number;
  weatherCode: number;
  frostRisk: string;
  sprayingSuitability: string;
}

export interface DetailedWeatherData {
  location: DetailedWeatherLocation;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    weatherCode: number;
    isDay: boolean;
    soilTemp?: number;
    soilMoisture?: number;
    shortwaveRadiation?: number;
    uvIndex?: number;
  };
  yesterday?: {
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
    soilTemp: number;
    effectiveTemp: number;
  };
  hourly: WeatherHourlyData[];
  daily: WeatherDailyData[];
  source: "open-meteo" | "sensor" | "demo";
  updatedAt: string;
}

export interface SoilTexture {
  clayPercent: number;
  sandPercent: number;
  siltPercent: number;
  textureClass: string;
}

export interface SoilProperties {
  organicMatter: number;
  organicCarbon: number;
  ph: number;
  cec: number;
  bulkDensity: number;
  soilDepth: string;
  drainage: string;
  waterHoldingCapacity: string;
  salinity: number;
}

export interface CropSuitability {
  cropName: string;
  suitabilityScore: 1 | 2 | 3 | 4; // 1: Çok Uygun, 2: Uygun, 3: Koşullu Uygun, 4: Daha Az Uygun
  suitabilityLabel: string;
  icon: string;
  reasoning: string;
  strengths: string[];
  limitations: string[];
}

export interface SoilAnalysisResult {
  location: {
    latitude: number;
    longitude: number;
    resolvedName: string;
  };
  texture: SoilTexture;
  properties: SoilProperties;
  generalEvaluation: string;
  strengths: { title: string; status: 'good' | 'medium' | 'bad'; text: string }[];
  limitations: { title: string; status: 'medium' | 'bad'; text: string }[];
  cropSuitabilities: CropSuitability[];
  source: string;
  updatedAt: string;
}

export interface AgriculturalWeatherAnalysis {
  weather: DetailedWeatherData;
  metrics: {
    eto: number | null;
    etc: number | null;
    gdd: number | null;
    vpd: number | null;
    sunrise?: string;
    sunset?: string;
  };
  risks: {
    frostRisk: "Yok" | "Düşük" | "Orta" | "Yüksek";
    heatStress: "Yok" | "Düşük" | "Orta" | "Yüksek";
    diseaseRisk: "Yok" | "Düşük" | "Orta" | "Yüksek";
    heavyRainRisk: "Yok" | "Düşük" | "Orta" | "Yüksek";
  };
  activities: {
    spraying: "Uygun" | "Dikkat" | "Uygun Değil";
    planting: "Uygun" | "Dikkat" | "Uygun Değil";
    fertilizing: "Uygun" | "Dikkat" | "Uygun Değil";
    harvesting: "Uygun" | "Dikkat" | "Uygun Değil";
  };
  summary: {
    generalStatus: "Genel Olarak Uygun" | "Dikkat Edilmeli" | "Riskli";
    message: string;
    impactMessage: string;
    irrigationMessage: string;
  };
}
