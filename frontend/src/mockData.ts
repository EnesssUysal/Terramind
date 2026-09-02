import { Field, WeatherData, NotificationItem, SensorItem, AlertItem, Task, WaterSavingEvent, CarbonFootprintData } from './types';

export const mockFields: Field[] = [
  {
    id: '1',
    name: 'Kuzey Tarlası',
    location: 'Malatya, Yeşilyurt',
    area: '120 Dönüm',
    ndvi: 0.81,
    history: [
      { day: 'Pzt', moisture: 38, ndvi: 0.76 },
      { day: 'Sal', moisture: 39, ndvi: 0.77 },
      { day: 'Çar', moisture: 41, ndvi: 0.79 },
      { day: 'Per', moisture: 40, ndvi: 0.78 },
      { day: 'Cum', moisture: 43, ndvi: 0.80 },
      { day: 'Cmt', moisture: 41, ndvi: 0.80 },
      { day: 'Paz', moisture: 42, ndvi: 0.81 },
    ],
    lastSync: '2 dk önce',
    status: 'Sağlıklı',
    aiSummary: 'Kuzey Tarlası güney bölgesinde son 24 saatte %8 toprak nemi kaybetti.',
    weatherImpact: 'Olumlu',
    aiConfidence: 94,
    criticalAlerts: 0,
    activeSensors: 12,
    tasksCount: 2,
    nextAction: 'Akşam sulaması',
    sensors: {
      moisture: { value: 42, change: 2, status: 'up', recommendation: 'Acil sulama gerekmiyor.' },
      temperature: { value: 26.4, change: -1.5, status: 'down', recommendation: 'Sıcaklık bitki gelişimi için ideal.' },
      nitrogen: { value: 140, change: 5, status: 'up', recommendation: 'Azot seviyeleri optimumda.' },
      ph: { value: 6.8, change: 0, status: 'stable', recommendation: 'pH seviyesi stabil.' },
    },
    irrigation: {
      current: 'Kapalı',
      next: 'Yarın 06:00',
      coverage: 100,
    }
  },
  {
    id: '2',
    name: 'Güney Bahçesi',
    location: 'Malatya, Doğanşehir',
    area: '45 Dönüm',
    ndvi: 0.55,
    history: [
      { day: 'Pzt', moisture: 35, ndvi: 0.62 },
      { day: 'Sal', moisture: 33, ndvi: 0.60 },
      { day: 'Çar', moisture: 31, ndvi: 0.58 },
      { day: 'Per', moisture: 30, ndvi: 0.57 },
      { day: 'Cum', moisture: 29, ndvi: 0.56 },
      { day: 'Cmt', moisture: 28, ndvi: 0.55 },
      { day: 'Paz', moisture: 28, ndvi: 0.55 },
    ],
    lastSync: '15 dk önce',
    status: 'Dikkat',
    aiSummary: 'Yarın yağmur bekleniyor, bu nedenle Güney Bahçesi için sulama önerilmiyor.',
    weatherImpact: 'Riskli',
    aiConfidence: 88,
    criticalAlerts: 1,
    activeSensors: 8,
    tasksCount: 3,
    nextAction: 'Azot gübrelemesi',
    sensors: {
      moisture: { value: 28, change: -5, status: 'down', recommendation: 'Nem seviyesi kritik, sulama planlayın.' },
      temperature: { value: 31.2, change: 2.1, status: 'up', recommendation: 'Yüksek sıcaklık, buharlaşma artabilir.' },
      nitrogen: { value: 110, change: -10, status: 'down', recommendation: 'Azot eksikliği tespit edildi.' },
      ph: { value: 7.2, change: 0.1, status: 'up', recommendation: 'Hafif asidik, kireçleme düşünülebilir.' },
    },
    irrigation: {
      current: 'Açık',
      next: 'Şu an çalışıyor',
      coverage: 85,
    }
  },
  {
    id: '3',
    name: 'Doğu Serası',
    location: 'Malatya, Battalgazi',
    area: '12 Dönüm',
    ndvi: 0.32,
    history: [
      { day: 'Pzt', moisture: 27, ndvi: 0.48 },
      { day: 'Sal', moisture: 24, ndvi: 0.44 },
      { day: 'Çar', moisture: 21, ndvi: 0.40 },
      { day: 'Per', moisture: 19, ndvi: 0.37 },
      { day: 'Cum', moisture: 17, ndvi: 0.35 },
      { day: 'Cmt', moisture: 16, ndvi: 0.33 },
      { day: 'Paz', moisture: 15, ndvi: 0.32 },
    ],
    lastSync: '1 saat önce',
    status: 'Kritik',
    aiSummary: 'Doğu Serasında toprak nemi kritik seviyede.',
    weatherImpact: 'Olumsuz',
    aiConfidence: 97,
    criticalAlerts: 3,
    activeSensors: 5,
    tasksCount: 4,
    nextAction: 'Manuel sulama',
    sensors: {
      moisture: { value: 15, change: -12, status: 'down', recommendation: 'Acil sulama başlatılmalı.' },
      temperature: { value: 35.8, change: 4.5, status: 'up', recommendation: 'Aşırı sıcak, havalandırma açılmalı.' },
      nitrogen: { value: 85, change: -25, status: 'down', recommendation: 'Kritik azot eksikliği.' },
      ph: { value: 5.9, change: -0.4, status: 'down', recommendation: 'Asidik toprak yapısı.' },
    },
    irrigation: {
      current: 'Kapalı',
      next: 'Manuel başlatma gerekli',
      coverage: 40,
    }
  }
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Güney Bahçesi güney bölgesini sula.', priority: 'High', field: 'Güney Bahçesi', duration: '2s', actionLabel: 'Sulamayı Başlat' },
  { id: '2', title: 'Kuzey Tarlası azot seviyesini ölç.', priority: 'Medium', field: 'Kuzey Tarlası', duration: '30dk', actionLabel: 'Analiz Et' },
  { id: '3', title: 'Sensör #12 bataryası düşük.', priority: 'Low', field: 'Kuzey Tarlası', duration: '15dk', actionLabel: 'Sensör Detayı' }
];

export const mapLegends: Record<string, { label: string; color: string; desc: string }[]> = {
  'NDVI (Uydu)': [
    { label: 'Sağlıklı Bitki Örtüsü', color: 'rgba(76, 175, 80, 0.6)', desc: 'NDVI > 0.7 — optimum fotosentez.' },
    { label: 'Orta Yoğunluk', color: 'rgba(255, 235, 59, 0.6)', desc: 'NDVI 0.55-0.7 — takip önerilir.' },
    { label: 'Stres Belirtisi', color: 'rgba(255, 152, 0, 0.6)', desc: 'NDVI 0.4-0.55 — su/besin stresi olası.' },
    { label: 'Kuraklık / Kritik', color: 'rgba(244, 67, 54, 0.6)', desc: 'NDVI < 0.4 — acil müdahale gerekli.' }
  ],
  'Toprak Nemi': [
    { label: 'Sağlıklı Nem', color: 'rgba(76, 175, 80, 0.6)', desc: 'Optimum su seviyesi.' },
    { label: 'Hafif Kuru', color: 'rgba(255, 235, 59, 0.6)', desc: 'Sulama planlanmalı.' },
    { label: 'Düşük Nem', color: 'rgba(255, 152, 0, 0.6)', desc: 'Bitki stresi başlıyor.' },
    { label: 'Kritik Kuruluk', color: 'rgba(244, 67, 54, 0.6)', desc: 'Acil sulama gerekli.' }
  ],
  'Su': [
    { label: 'Stres Yok', color: 'rgba(33, 150, 243, 0.6)', desc: 'Su alımı normal.' },
    { label: 'Hafif Stres', color: 'rgba(0, 188, 212, 0.6)', desc: 'Transpirasyon azalıyor.' },
    { label: 'Orta Stres', color: 'rgba(255, 152, 0, 0.6)', desc: 'Fotosentez yavaşlıyor.' },
    { label: 'Yüksek Stres', color: 'rgba(244, 67, 54, 0.6)', desc: 'Solma riski yüksek.' }
  ],
  'pH': [
    { label: 'Optimum (6.5-7.5)', color: 'rgba(76, 175, 80, 0.6)', desc: 'İdeal.' },
    { label: 'Hafif Asidik', color: 'rgba(255, 235, 59, 0.6)', desc: 'Kabul edilebilir.' },
    { label: 'Asidik', color: 'rgba(255, 152, 0, 0.6)', desc: 'Besin alımı zorlaşır.' },
    { label: 'Kritik Asidik', color: 'rgba(244, 67, 54, 0.6)', desc: 'Kritik seviye.' }
  ],
  'Azot': [
    { label: 'Yeterli Azot', color: 'rgba(76, 175, 80, 0.6)', desc: 'İdeal büyüme koşulu.' },
    { label: 'Azalıyor', color: 'rgba(255, 235, 59, 0.6)', desc: 'Yakında gübreleme gerekli.' },
    { label: 'Düşük Azot', color: 'rgba(255, 152, 0, 0.6)', desc: 'Gelişim yavaşlıyor.' },
    { label: 'Kritik Eksiklik', color: 'rgba(244, 67, 54, 0.6)', desc: 'Acil gübreleme gerekli.' }
  ],
  'Fosfor': [
    { label: 'Yeterli', color: 'rgba(76, 175, 80, 0.6)', desc: 'İdeal.' },
    { label: 'Azalıyor', color: 'rgba(255, 235, 59, 0.6)', desc: 'Takip gerekli.' },
    { label: 'Düşük', color: 'rgba(255, 152, 0, 0.6)', desc: 'Eksiklik belirtileri.' },
    { label: 'Kritik', color: 'rgba(244, 67, 54, 0.6)', desc: 'Kritik seviye.' }
  ],
  'Hastalık Riski': [
    { label: 'Düşük Risk', color: 'rgba(76, 175, 80, 0.6)', desc: 'Uygun değil.' },
    { label: 'Orta Risk', color: 'rgba(255, 235, 59, 0.6)', desc: 'Önleyici ilaçlama düşünülebilir.' },
    { label: 'Yüksek Risk', color: 'rgba(255, 152, 0, 0.6)', desc: 'Uygun ortam.' },
    { label: 'Kritik', color: 'rgba(244, 67, 54, 0.6)', desc: 'Aktif enfeksiyon riski.' }
  ]
};

export const mapOverlays: Record<string, string[]> = {
  'NDVI (Uydu)': ['rgba(76, 175, 80, 0.4)', 'rgba(255, 152, 0, 0.4)', 'rgba(244, 67, 54, 0.4)', 'rgba(76, 175, 80, 0.4)'],
  'Toprak Nemi': ['rgba(244, 67, 54, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(255, 235, 59, 0.4)', 'rgba(76, 175, 80, 0.4)'],
  'Su': ['rgba(255, 152, 0, 0.4)', 'rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0.4)', 'rgba(0, 188, 212, 0.4)'],
  'pH': ['rgba(76, 175, 80, 0.4)', 'rgba(255, 235, 59, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(255, 152, 0, 0.4)'],
  'Azot': ['rgba(255, 152, 0, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(255, 235, 59, 0.4)'],
  'Fosfor': ['rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(255, 235, 59, 0.4)', 'rgba(255, 152, 0, 0.4)'],
  'Hastalık Riski': ['rgba(76, 175, 80, 0.4)', 'rgba(255, 235, 59, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0.4)']
};

export const mockWeather: WeatherData = {
  currentTemp: 24,
  condition: 'Parçalı Bulutlu',
  humidity: 45,
  windSpeed: 12,
  rainProb: 15,
  uvIndex: 6,
  sunrise: '05:45',
  sunset: '19:30',
  hourly: [
    { time: '12:00', temp: 24, icon: 'cloud-sun' },
    { time: '13:00', temp: 25, icon: 'sun' },
    { time: '14:00', temp: 26, icon: 'sun' },
    { time: '15:00', temp: 26, icon: 'sun' },
    { time: '16:00', temp: 25, icon: 'cloud-sun' },
    { time: '17:00', temp: 23, icon: 'cloud' },
  ],
  daily: [
    { day: 'Pzt', min: 14, max: 26, icon: 'sun', rainProb: 0 },
    { day: 'Sal', min: 15, max: 28, icon: 'sun', rainProb: 10 },
    { day: 'Çar', min: 16, max: 25, icon: 'cloud-rain', rainProb: 60 },
    { day: 'Per', min: 14, max: 22, icon: 'cloud', rainProb: 30 },
    { day: 'Cum', min: 13, max: 24, icon: 'sun', rainProb: 0 },
    { day: 'Cmt', min: 15, max: 27, icon: 'sun', rainProb: 0 },
    { day: 'Paz', min: 16, max: 29, icon: 'sun', rainProb: 5 },
  ],
  recommendation: 'Bugün planlanan ilaçlama için uygun rüzgar koşulları mevcut. Ancak Çarşamba günü beklenen yağış nedeniyle gübreleme işlemini ertelemeniz önerilir.'
};

export const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'Kritik Düşük Nem', time: '10 dk önce', priority: 'Critical', description: 'Güney Bahçesi bölgesinde toprak nemi %28 seviyesine geriledi. Acil sulama gerekiyor.', relatedField: 'Güney Bahçesi' },
  { id: '2', title: 'Sulama Tamamlandı', time: '2 saat önce', priority: 'Success', description: 'Kuzey Tarlası 1. bölge sulama programı başarıyla tamamlandı.', relatedField: 'Kuzey Tarlası' },
  { id: '3', title: 'Azot Seviyesi Uyarısı', time: 'Dün, 15:30', priority: 'Warning', description: 'Doğu Serası azot değerlerinde normalin altında bir seyir var. AI gübreleme öneriyor.', relatedField: 'Doğu Serası' },
  { id: '4', title: 'Sistem Güncellemesi', time: 'Dün, 09:00', priority: 'Info', description: 'TerraMind v2.4 güncellemesi yüklendi. Yeni AI özellikleri aktif.' },
];

export const mockSensors: SensorItem[] = [
  { id: 'S1', name: 'N-1 (Toprak)', type: 'Çoklu Sensör', field: 'Kuzey Tarlası', location: 'Bölge A, Kuzey', latestReading: '%42 Nem, 26.4°C', battery: 85, signal: 'Excellent', lastSync: '2 dk önce', status: 'Active' },
  { id: 'S2', name: 'N-2 (Hava)', type: 'Meteoroloji İstasyonu', field: 'Kuzey Tarlası', location: 'Merkez', latestReading: '24°C, %45 Nem', battery: 92, signal: 'Good', lastSync: '5 dk önce', status: 'Active' },
  { id: 'S3', name: 'G-1 (Toprak)', type: 'Çoklu Sensör', field: 'Güney Bahçesi', location: 'Bölge C, Güney', latestReading: '%28 Nem, 31.2°C', battery: 15, signal: 'Fair', lastSync: '15 dk önce', status: 'Warning' },
  { id: 'S4', name: 'D-1 (pH)', type: 'pH Sensörü', field: 'Doğu Serası', location: 'Giriş', latestReading: '5.9 pH', battery: 0, signal: 'Poor', lastSync: '2 gün önce', status: 'Offline' },
];

export const mockAlerts: AlertItem[] = [
  { id: 'A1', title: 'Su Basıncı Düşük', type: 'Critical', time: '1 Saat Önce', field: 'Doğu Serası', description: 'Ana su hattında basınç 1.2 bar seviyesine düştü. Sulama sistemi etkilenebilir.' },
  { id: 'A2', title: 'Sensör Pili Zayıf', type: 'Warning', time: '5 Saat Önce', field: 'Güney Bahçesi', description: 'G-1 numaralı sensörün pil seviyesi %15. En kısa sürede değiştiriniz.' },
  { id: 'A3', title: 'Hastalık Riski Tespit Edildi', type: 'Warning', time: 'Dün', field: 'Kuzey Tarlası', description: 'Yüksek nem ve sıcaklık pas hastalığı riskini artırıyor.' },
  { id: 'A4', title: 'Bağlantı Koptu', type: 'Resolved', time: '2 Gün Önce', field: 'Doğu Serası', description: 'Ağ geçidi bağlantısı 15 dakika koptu, tekrar bağlandı.' },
];

export const aiMessages = [
  { id: 1, text: "Merhaba, ben TerraMind Asistan. Tarlalarınızla ilgili size nasıl yardımcı olabilirim?", sender: 'ai' }
];

// Vitrin 1: AI Su Tasarruf Motoru — HomeTab ve AnalysisTab'de kullanılır
export const mockWaterSavingEvents: WaterSavingEvent[] = [
  {
    id: 'W1',
    title: 'Sulama İptal Edildi',
    detail: '18 saat sonra yağmur bekleniyor, AI sulamayı otomatik iptal etti.',
    savedLiters: 420,
    time: '2 saat önce',
    field: 'Kuzey Tarlası',
    type: 'saving',
  },
  {
    id: 'W2',
    title: 'Akıllı Sulama Devrede',
    detail: 'Toprak nemi %28 eşik değerinin altına düştü, damla sulama başlatıldı.',
    savedLiters: 0,
    time: '5 saat önce',
    field: 'Güney Bahçesi',
    type: 'irrigation',
  },
  {
    id: 'W3',
    title: 'Sulama Süresi Kısaltıldı',
    detail: 'Nem seviyesi hedefe ulaştı, program 40 dakika erken durduruldu.',
    savedLiters: 180,
    time: 'Dün, 18:20',
    field: 'Kuzey Tarlası',
    type: 'saving',
  },
  {
    id: 'W4',
    title: 'Kritik Kuraklık Uyarısı',
    detail: 'Doğu Serasında nem %15 seviyesine geriledi, manuel müdahale gerekiyor.',
    savedLiters: 0,
    time: 'Dün, 09:10',
    field: 'Doğu Serası',
    type: 'alert',
  },
];

// Vitrin 3: Karbon Ayak İzi (COP31 Vizyonu) — CarbonFootprintScreen'de kullanılır
export const mockCarbonFootprint: CarbonFootprintData = {
  farmAverageTonPerHa: 3.2,
  regionAveragePerHa: 4.8,
  tractorEmissionFactor: 0.08, // ton CO2 / traktör saati
  history: [
    { month: 'Nis', farm: 3.6, region: 4.9 },
    { month: 'May', farm: 3.4, region: 4.8 },
    { month: 'Haz', farm: 3.1, region: 4.7 },
    { month: 'Tem', farm: 2.9, region: 4.8 },
    { month: 'Ağu', farm: 3.0, region: 4.9 },
  ],
};



