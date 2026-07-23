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

