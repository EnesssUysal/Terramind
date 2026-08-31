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
  // NDVI (Normalized Difference Vegetation Index): 0-1 arası bitki sağlığı skoru.
  // 0.7+ Sağlıklı, 0.4-0.7 Riskli, <0.4 Kurak/Kritik.
  ndvi: number;
  // Son 7 günlük nem & NDVI geçmişi — Analiz ekranındaki gerçek grafikler için.
  history: { day: string; moisture: number; ndvi: number }[];
}

// Vitrin 1: AI Su Tasarruf Motoru
export interface WaterSavingEvent {
  id: string;
  title: string;
  detail: string;
  savedLiters: number;
  time: string;
  field: string;
  type: 'saving' | 'irrigation' | 'alert';
}

// Vitrin 3: Karbon Ayak İzi (COP31 Vizyonu)
export interface CarbonFootprintData {
  farmAverageTonPerHa: number;
  regionAveragePerHa: number;
  // Traktör saati başına ortalama emisyon (ton CO2/saat)
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
