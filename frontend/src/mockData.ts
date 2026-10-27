import { Field, WeatherData, NotificationItem, SensorItem, AlertItem, Task, WaterSavingEvent, CarbonFootprintData } from './types';

export const mockFields: Field[] = [
  {
    id: '1793109118563',
    name: 'Üzüm Bağı',
    location: 'Manisa, Yunusemre',
    area: '63.7 Dönüm',
    crop: 'Üzüm',
    lat: 38.7377604815913,
    lng: 27.434862654640995,
    polygon: [
      [38.7377604815913, 27.434862654640995],
      [38.7389915490909, 27.43727966132707],
      [38.74011468692338, 27.43641143758065],
      [38.740909681568176, 27.435487820011026],
      [38.74005918493525, 27.433410330488574]
    ],
    ndvi: 0.84,
    ndviScore: 0.84,
    history: [
      { day: 'Pzt', moisture: 44, ndvi: 0.82 },
      { day: 'Sal', moisture: 43, ndvi: 0.83 },
      { day: 'Çar', moisture: 42, ndvi: 0.83 },
      { day: 'Per', moisture: 42, ndvi: 0.84 },
      { day: 'Cum', moisture: 41, ndvi: 0.84 },
      { day: 'Cmt', moisture: 42, ndvi: 0.84 },
      { day: 'Paz', moisture: 42, ndvi: 0.84 },
    ],
    lastSync: '10 dk önce',
    status: 'Sağlıklı',
    aiSummary: 'Manisa Yunusemre taban nemi optimum seviyede. Külleme mantarına karşı koruyucu kükürt ve yer altı damlama takibi tavsiye edilir.',
    weatherImpact: 'Olumlu',
    aiConfidence: 96,
    criticalAlerts: 0,
    activeSensors: 10,
    tasksCount: 3,
    nextAction: 'Bağ külleme koruyucu kükürt uygulaması',
    sensors: {
      moisture: { value: 42, change: 1, status: 'stable', recommendation: 'Yer altı damlama sistemi kök derinliğinde nemi dengeliyor.' },
      temperature: { value: 28.0, change: 2.1, status: 'up', recommendation: 'Sıcaklık vejetatif gelişimi destekliyor.' },
      nitrogen: { value: 78, change: -1, status: 'stable', recommendation: 'Azot dengeli, salkım kalitesi korunuyor.' },
      ph: { value: 6.9, change: 0, status: 'stable', recommendation: 'Gediz alüvyon toprağı nötr/ideal aralıkta.' },
    },
    irrigation: {
      current: 'Kapalı',
      next: 'Yarın 21:00 (Gece Programı)',
      coverage: 100,
    }
  },
  {
    id: '1793109250136',
    name: 'Kayısı Tarlası',
    location: 'Malatya, Battalgazi',
    area: '16.8 Dönüm',
    crop: 'Kayısı',
    lat: 38.44961407555695,
    lng: 38.35766552927494,
    polygon: [
      [38.44961407555695, 38.35766552927494],
      [38.44907632348891, 38.35582903387487],
      [38.44825288286856, 38.35592569152751],
      [38.448673006808086, 38.35785884458023]
    ],
    ndvi: 0.84,
    ndviScore: 0.84,
    history: [
      { day: 'Pzt', moisture: 42, ndvi: 0.81 },
      { day: 'Sal', moisture: 43, ndvi: 0.82 },
      { day: 'Çar', moisture: 42, ndvi: 0.83 },
      { day: 'Per', moisture: 42, ndvi: 0.84 },
      { day: 'Cum', moisture: 41, ndvi: 0.84 },
      { day: 'Cmt', moisture: 42, ndvi: 0.84 },
      { day: 'Paz', moisture: 42, ndvi: 0.84 },
    ],
    lastSync: '2 dk önce',
    status: 'Sağlıklı',
    aiSummary: 'Battalgazi kayısı bahçesinde sürgün ve meyve tutum evresi. Gece sıcaklık farkı ve Monilya takibi önerilir.',
    weatherImpact: 'Olumlu',
    aiConfidence: 94,
    criticalAlerts: 0,
    activeSensors: 8,
    tasksCount: 2,
    nextAction: 'Monilya koruyucu kontrol & sulama',
    sensors: {
      moisture: { value: 42, change: 0, status: 'stable', recommendation: 'Damla sulama altyapısı optimum nemi sağlıyor.' },
      temperature: { value: 18.2, change: -1.5, status: 'down', recommendation: 'Gece serinliği meyve kalitesini pekiştiriyor.' },
      nitrogen: { value: 92, change: 2, status: 'stable', recommendation: 'Azot dengesi taç gelişimi için optimum.' },
      ph: { value: 7.8, change: 0, status: 'stable', recommendation: 'Killi-tınlı alüvyal toprak pH değeri stabil.' },
    },
    irrigation: {
      current: 'Kapalı',
      next: 'Yarın 05:30',
      coverage: 100,
    }
  },
  {
    id: '1793109326110',
    name: 'Buğday Tarlası',
    location: 'Kayseri, Develi',
    area: '55.5 Dönüm',
    crop: 'Buğday',
    lat: 38.36509719705687,
    lng: 35.453427189205456,
    polygon: [
      [38.36509719705687, 35.453427189205456],
      [38.36664502101616, 35.45328757259611],
      [38.366599861712785, 35.44994129644126],
      [38.36505203678775, 35.44936135052545]
    ],
    ndvi: 0.84,
    ndviScore: 0.84,
    history: [
      { day: 'Pzt', moisture: 44, ndvi: 0.82 },
      { day: 'Sal', moisture: 43, ndvi: 0.83 },
      { day: 'Çar', moisture: 42, ndvi: 0.83 },
      { day: 'Per', moisture: 41, ndvi: 0.84 },
      { day: 'Cum', moisture: 42, ndvi: 0.84 },
      { day: 'Cmt', moisture: 42, ndvi: 0.84 },
      { day: 'Paz', moisture: 42, ndvi: 0.84 },
    ],
    lastSync: '5 dk önce',
    status: 'Sağlıklı',
    aiSummary: 'Develi ovasında kuru rüzgar etkisi kontrol altında. Center-pivot sulama ve sarı pas gözlemi önerilmektedir.',
    weatherImpact: 'Olumlu',
    aiConfidence: 91,
    criticalAlerts: 0,
    activeSensors: 12,
    tasksCount: 2,
    nextAction: 'Center-Pivot gece sulaması',
    sensors: {
      moisture: { value: 42, change: 0, status: 'stable', recommendation: 'Buğday kardeşlenme bölgesi nemi tatminkar.' },
      temperature: { value: 23.4, change: 1.2, status: 'up', recommendation: 'Sıcaklık vejetatif büyüme için elverişli.' },
      nitrogen: { value: 135, change: 4, status: 'up', recommendation: 'Azot/Potasyum dengesi başak gelişimini destekliyor.' },
      ph: { value: 8.1, change: 0.1, status: 'stable', recommendation: 'Kireçli İç Anadolu toprağı referans aralıkta.' },
    },
    irrigation: {
      current: 'Açık',
      next: 'Pivot Devrede (20:00)',
      coverage: 95,
    }
  }
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Üzüm Bağı külleme mantarı kükürtleme ve gölgeleme kontrolü.', priority: 'High', field: 'Üzüm Bağı', duration: '1s', actionLabel: 'İlaçlama Emri' },
  { id: '2', title: 'Kayısı Tarlası don pervaneleri ve Monilya fungisit takibi.', priority: 'Medium', field: 'Kayısı Tarlası', duration: '15dk', actionLabel: 'Kontrol Et' },
  { id: '3', title: 'Buğday Tarlası center-pivot nozul basıncını test et.', priority: 'High', field: 'Buğday Tarlası', duration: '30dk', actionLabel: 'Test Başlat' }
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
  { id: '1', title: 'Gece Don Uyarısı', time: '10 dk önce', priority: 'Critical', description: 'Battalgazi Güneş Kayısılığı sahasında gece sıcaklığının 1.0°C altına inmesi bekleniyor. Don pervanelerini hazırlayın.', relatedField: 'Battalgazi Güneş Kayısılığı' },
  { id: '2', title: 'Pivot Sulama Tamamlandı', time: '2 saat önce', priority: 'Success', description: 'Develi Ovası Bereket Parseli 120 dönümlük center-pivot sulama programı başarıyla tamamlandı.', relatedField: 'Develi Ovası Bereket Parseli' },
  { id: '3', title: 'Külleme Mantarı Riski', time: 'Dün, 15:30', priority: 'Warning', description: 'Alaşehir Gediz Sultaniye Bağı yüksek nem ve 31°C sıcaklık sebebiyle külleme riski altında. Mikronize kükürtleme tavsiye edilir.', relatedField: 'Alaşehir Gediz Sultaniye Bağı' },
  { id: '4', title: 'Sistem Güncellemesi', time: 'Dün, 09:00', priority: 'Info', description: 'TerraMind v2.4 güncellemesi yüklendi. Gerçekçi saha simülasyonları ve çoklu tarla desteği devrede.' },
];

export const mockSensors: SensorItem[] = [
  { id: 'MLT-S1', name: 'M-1 (Malatya Toprak)', type: 'Çoklu Sensör', field: 'Battalgazi Güneş Kayısılığı', location: 'Bölge A, Battalgazi', latestReading: '%38 Nem, 18.2°C', battery: 88, signal: 'Excellent', lastSync: '2 dk önce', status: 'Active' },
  { id: 'KYS-S2', name: 'K-2 (Kayseri Pivot)', type: 'Meteoroloji İstasyonu', field: 'Develi Ovası Bereket Parseli', location: 'Pivot Merkez, Develi', latestReading: '23.4°C, %30 Nem', battery: 94, signal: 'Good', lastSync: '5 dk önce', status: 'Active' },
  { id: 'MNS-S3', name: 'G-1 (Manisa Kök)', type: 'Çoklu Sensör', field: 'Alaşehir Gediz Sultaniye Bağı', location: 'Gediz Tabanı, Alaşehir', latestReading: '%42 Nem, 31.0°C', battery: 78, signal: 'Good', lastSync: '10 dk önce', status: 'Active' },
  { id: 'MLT-S4', name: 'M-2 (Don Sensörü)', type: 'Sıcaklık/Nem', field: 'Battalgazi Güneş Kayısılığı', location: 'Eski Ark Çukuru', latestReading: '14.5°C, %55 Nem', battery: 65, signal: 'Good', lastSync: '15 dk önce', status: 'Warning' },
];

export const mockAlerts: AlertItem[] = [
  { id: 'A1', title: 'Gece Don ve Monilya Riski', type: 'Critical', time: '15 Dk Önce', field: 'Battalgazi Güneş Kayısılığı', description: 'Battalgazi kayısı çiçeklenme evresinde hava sıcaklığı gece 0°C sınırına gerileyebilir.' },
  { id: 'A2', title: 'Rüzgarlı Kuru Hava Uyarısı', type: 'Warning', time: '2 Saat Önce', field: 'Develi Ovası Bereket Parseli', description: 'Develi bozkırında 24 km/h kuru rüzgar terlemeyi artırıyor, nem düşüşüne dikkat.' },
  { id: 'A3', title: 'Yüksek Nem & Külleme Tehdidi', type: 'Warning', time: 'Dün', field: 'Alaşehir Gediz Sultaniye Bağı', description: 'Gediz havzasında nem %66 seviyesinde; salkımlarda külleme mantarı riski %78.' },
];

export const aiMessages = [
  { id: 1, text: "Merhaba, ben TerraMind Asistan. Malatya Kayısılığı, Kayseri Develi Parseli ve Manisa Sultaniye Bağı tarlalarınızla ilgili size nasıl yardımcı olabilirim?", sender: 'ai' }
];

// Vitrin 1: AI Su Tasarruf Motoru — HomeTab ve AnalysisTab'de kullanılır
export const mockWaterSavingEvents: WaterSavingEvent[] = [
  {
    id: 'W1',
    title: 'Sulama İptal Edildi (Yağış Tahmini)',
    detail: '18 saat sonra yağmur beklendiği için Develi parselinde pivot sulaması otomatik ertelendi.',
    savedLiters: 4200,
    time: '2 saat önce',
    field: 'Develi Ovası Bereket Parseli',
    type: 'saving',
  },
  {
    id: 'W2',
    title: 'Hassas Damla Sulama Devrede',
    detail: 'Malatya kayısı kök bölgesinde nem %38 eşiğinde tutuluyor.',
    savedLiters: 0,
    time: '5 saat önce',
    field: 'Battalgazi Güneş Kayısılığı',
    type: 'irrigation',
  },
  {
    id: 'W3',
    title: 'Yer Altı Damlama Tasarrufu',
    detail: 'Alaşehir bağında yüzey buharlaşması sıfırlandı, gece programı optimize edildi.',
    savedLiters: 1850,
    time: 'Dün, 18:20',
    field: 'Alaşehir Gediz Sultaniye Bağı',
    type: 'saving',
  },
  {
    id: 'W4',
    title: 'Düşük Don Eşiği Takibi',
    detail: 'Battalgazi çukur parselde gece mikro-iklim sensörleri devrede.',
    savedLiters: 0,
    time: 'Dün, 09:10',
    field: 'Battalgazi Güneş Kayısılığı',
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



