export interface SubParcel {
  id: string;
  code: string;
  name: string;
  description: string;
  area: string;
  cropVariety: string;
  center: [number, number];
  coordinates: [number, number][];
  defaultThreatLevel?: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface RealisticFarmProfile {
  id: string;
  code: string;
  name: string;
  province: 'Malatya' | 'Kayseri' | 'Manisa';
  district: string;
  region: string;
  area: string;
  areaValue: number;
  crop: string;
  cropCategory: 'Meyve Bahçesi' | 'Endüstri Bitkisi / Tahıl' | 'Bağ & Zeytinlik';
  soilType: string;
  irrigationInfrastructure: string;
  climateProfile: string;
  lat: number;
  lng: number;
  center: [number, number];
  zoom: number;
  ndvi: number;
  status: 'Sağlıklı' | 'Dikkat' | 'Kritik';
  testScenarioProfile: {
    recommendedScenario: string;
    targetThreat: string;
    threatDescription: string;
    criticalThresholds: {
      minTemp?: number;
      maxTemp?: number;
      minMoisture?: number;
      maxMoisture?: number;
      maxHumidity?: number;
      optimumPh: string;
      criticalPh: number;
      riskDisease: string;
    };
  };
  baseParams: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    ec: number;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
    extremeWeather: string;
    pumpFailure: boolean;
    dripBlockage: boolean;
    diseaseType: string;
    severity: number;
  };
  parcels: SubParcel[];
}

export const REALISTIC_FARMS: RealisticFarmProfile[] = [
  // =========================================================================
  // 1. MANİSA — ÜZÜM BAĞI (BAĞ & ZEYTİNLİK)
  // =========================================================================
  {
    id: '1793109118563',
    code: 'UZM-01',
    name: 'Üzüm Bağı',
    province: 'Manisa',
    district: 'Yunusemre',
    region: 'Manisa, Yunusemre (38.7378° N, 27.4349° E)',
    area: '63.7 Dönüm',
    areaValue: 63.7,
    crop: 'Üzüm',
    cropCategory: 'Bağ & Zeytinlik',
    soilType: 'Gediz alüvyon taban toprağı, geçirgen kumlu-tınlı (pH 6.9)',
    irrigationInfrastructure: 'Yer Altı Basınç Dengelemeli Damlama (Subsurface Drip)',
    climateProfile: 'Ege mikro-kliması; yüksek yaz nemi (%70), sıcak hava dalgaları (42°C+)',
    lat: 38.7377604815913,
    lng: 27.434862654640995,
    center: [38.7390, 27.4355],
    zoom: 16,
    ndvi: 0.84,
    status: 'Sağlıklı',
    testScenarioProfile: {
      recommendedScenario: 'Ege Sıcak Dalgası & Külleme Salgını',
      targetThreat: 'Aşırı Sıcak Dalgası (43°C) ve Bağ Küllemesi (Uncinula necator)',
      threatDescription: 'Ege mikro-klimasında ani sıcak hava dalgası omcalarda aşırı terlemeye yol açar. Damlama hattı tıkandığında kökler hızla kurur; yüksek nem ise yaprak altlarında külleme sporlarının yayılmasına neden olur.',
      criticalThresholds: {
        minTemp: 10.0,
        maxTemp: 40.0,
        minMoisture: 30,
        maxMoisture: 70,
        maxHumidity: 80,
        optimumPh: '6.5 - 7.2',
        criticalPh: 7.8,
        riskDisease: 'Bağ Küllemesi (Uncinula necator)'
      }
    },
    baseParams: {
      nitrogen: 78,
      phosphorus: 42,
      potassium: 130,
      ph: 6.9,
      ec: 1.1,
      soilMoisture: 42,
      temperature: 28,
      humidity: 55,
      windSpeed: 10,
      extremeWeather: 'none',
      pumpFailure: false,
      dripBlockage: false,
      diseaseType: 'none',
      severity: 0
    },
    parcels: [
      {
        id: 'G-1',
        code: 'Parsel U-1',
        name: 'Güneş Yamaç Üzüm Parseli',
        description: 'Güneşlenme açısı yüksek, salkım kalitesi optimum üst yamaç bağı (20 Dönüm)',
        area: '20 Dönüm',
        cropVariety: 'Sultaniye Çekirdeksiz Üzüm',
        center: [38.7385, 27.4360],
        coordinates: [
          [38.7378, 27.4349],
          [38.7390, 27.4373],
          [38.7395, 27.4360],
          [38.7385, 27.4345]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'G-2',
        code: 'Parsel U-2',
        name: 'Nemli Taban Külleme Odak Bloğu',
        description: 'Vadi tabanında nem birikme alanı; yüksek sıcaklıkta külleme mantarı riski kritik (18 Dönüm)',
        area: '18 Dönüm',
        cropVariety: 'Sultaniye Çekirdeksiz',
        center: [38.7398, 27.4358],
        coordinates: [
          [38.7390, 27.4373],
          [38.7401, 27.4364],
          [38.7405, 27.4350],
          [38.7395, 27.4360]
        ],
        defaultThreatLevel: 'WARNING'
      },
      {
        id: 'G-3',
        code: 'Parsel U-3',
        name: 'Damlama ve Filtrasyon Bloğu',
        description: 'Yer altı damlama ana dağıtım merkezi ve basınç regülatörleri (14 Dönüm)',
        area: '14 Dönüm',
        cropVariety: 'Trilye Zeytin & Asma',
        center: [38.7404, 27.4345],
        coordinates: [
          [38.7401, 27.4364],
          [38.7409, 27.4355],
          [38.7401, 27.4334],
          [38.7405, 27.4350]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'G-4',
        code: 'Parsel U-4',
        name: 'Genç Omcalar Bloğu',
        description: '3 yaşlı yeni dikim sertifikalı asma omcaları (11.7 Dönüm)',
        area: '11.7 Dönüm',
        cropVariety: 'Yeni Dikim Asma',
        center: [38.7390, 27.4340],
        coordinates: [
          [38.7378, 27.4349],
          [38.7385, 27.4345],
          [38.7401, 27.4334],
          [38.7388, 27.4338]
        ],
        defaultThreatLevel: 'NORMAL'
      }
    ]
  },

  // =========================================================================
  // 2. MALATYA — KAYISI TARLASI (MEYVE BAHÇESİ)
  // =========================================================================
  {
    id: '1793109250136',
    code: 'KYS-02',
    name: 'Kayısı Tarlası',
    province: 'Malatya',
    district: 'Battalgazi',
    region: 'Malatya, Battalgazi (38.4496° N, 38.3577° E)',
    area: '16.8 Dönüm',
    areaValue: 16.8,
    crop: 'Kayısı',
    cropCategory: 'Meyve Bahçesi',
    soilType: 'Killi-tınlı, derin profilli, kireçli alüvyal toprak (pH 7.8)',
    irrigationInfrastructure: 'Basınçlı Hat Damla Sulama & Otomatik Gübre Dozajlama',
    climateProfile: 'Doğu Anadolu geçiş kuşağı karasal iklimi, gece-gündüz sıcaklık farkı yüksek (18°C)',
    lat: 38.44961407555695,
    lng: 38.35766552927494,
    center: [38.4490, 38.3568],
    zoom: 16,
    ndvi: 0.84,
    status: 'Sağlıklı',
    testScenarioProfile: {
      recommendedScenario: 'Erken İlkbahar Donu & Monilya Mantarı',
      targetThreat: 'Çiçeklenme Dönemi Ani Gece Donu (-3°C) ve Çiçek Yanıklığı (Monilinia laxa)',
      threatDescription: 'Erken çiçeklenme evresindeki kayısı ağaçlarında gece sıcaklığının aniden sıfırın altına inmesi taç yapraklarını dondurur; sabah oluşan nem tabakası ise Monilya mantarı sporlarını infilak ettirir.',
      criticalThresholds: {
        minTemp: 1.0,
        maxTemp: 38.0,
        minMoisture: 30,
        maxMoisture: 75,
        maxHumidity: 85,
        optimumPh: '7.2 - 8.0',
        criticalPh: 8.4,
        riskDisease: 'Monilya (Monilinia laxa) & Yaprak Delen (Çil)'
      }
    },
    baseParams: {
      nitrogen: 92,
      phosphorus: 38,
      potassium: 160,
      ph: 7.8,
      ec: 1.4,
      soilMoisture: 42,
      temperature: 18,
      humidity: 42,
      windSpeed: 12,
      extremeWeather: 'none',
      pumpFailure: false,
      dripBlockage: false,
      diseaseType: 'none',
      severity: 0
    },
    parcels: [
      {
        id: 'M-1',
        code: 'Parsel K-1',
        name: 'Güneş Yamaç Hacıhaliloğlu Bloğu',
        description: 'Güneşlenme açısı yüksek, meyve iriliği homojen üst seki bahçesi (6 Dönüm)',
        area: '6 Dönüm',
        cropVariety: 'Hacıhaliloğlu Aşılı Kayısı',
        center: [38.4493, 38.3568],
        coordinates: [
          [38.4496, 38.3577],
          [38.4491, 38.3558],
          [38.4487, 38.3565],
          [38.4492, 38.3578]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'M-2',
        code: 'Parsel K-2',
        name: 'Eski Ark Çukuru (Don & Monilya Hassas)',
        description: 'Vadi tabanında soğuk hava birikme çukuru; erken ilkbahar ayazında don riski kritik (4.8 Dönüm)',
        area: '4.8 Dönüm',
        cropVariety: 'Şekerpare Kayısı',
        center: [38.4486, 38.3565],
        coordinates: [
          [38.4491, 38.3558],
          [38.4483, 38.3559],
          [38.4485, 38.3570],
          [38.4487, 38.3565]
        ],
        defaultThreatLevel: 'WARNING'
      },
      {
        id: 'M-3',
        code: 'Parsel K-3',
        name: 'Damla Sulama Pompa & Filtrasyon',
        description: 'Ana derin kuyu sondajı, debimetre ve asit/gübre tankları (3.5 Dönüm)',
        area: '3.5 Dönüm',
        cropVariety: 'Kabaaşı Kayısı',
        center: [38.4485, 38.3574],
        coordinates: [
          [38.4487, 38.3565],
          [38.4485, 38.3570],
          [38.4487, 38.3579],
          [38.4492, 38.3578]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'M-4',
        code: 'Parsel K-4',
        name: 'Genç Fidanlık Bloğu',
        description: 'Yeni dikilmiş genç fidanlar (2.5 Dönüm)',
        area: '2.5 Dönüm',
        cropVariety: 'Şekerpare Genç Fidan',
        center: [38.4484, 38.3563],
        coordinates: [
          [38.4483, 38.3559],
          [38.4487, 38.3579],
          [38.4485, 38.3570],
          [38.4482, 38.3560]
        ],
        defaultThreatLevel: 'NORMAL'
      }
    ]
  },

  // =========================================================================
  // 3. KAYSERİ — BUĞDAY TARLASI (TAHIL)
  // =========================================================================
  {
    id: '1793109326110',
    code: 'BGD-03',
    name: 'Buğday Tarlası',
    province: 'Kayseri',
    district: 'Develi',
    region: 'Kayseri, Develi (38.3651° N, 35.4534° E)',
    area: '55.5 Dönüm',
    areaValue: 55.5,
    crop: 'Buğday',
    cropCategory: 'Endüstri Bitkisi / Tahıl',
    soilType: 'Kireçli-tınlı karasal bozkır toprağı, yüksek kalsiyum karbonat (pH 8.1)',
    irrigationInfrastructure: 'Merkezi Dairesel Center-Pivot & Yağmurlama Tabancaları',
    climateProfile: 'İç Anadolu karasal step iklimi, şiddetli kuru rüzgarlar, yaz kuraklığı',
    lat: 38.36509719705687,
    lng: 35.453427189205456,
    center: [38.3658, 35.4515],
    zoom: 16,
    ndvi: 0.84,
    status: 'Sağlıklı',
    testScenarioProfile: {
      recommendedScenario: 'Şiddetli Bozkır Kuraklığı & Sarı Pas Mantarı',
      targetThreat: 'Aşırı Kuru Rüzgar (Fön), Toprak Nem Kaybı ve Sarı Pas (Puccinia striiformis)',
      threatDescription: 'İç Anadolu bozkırında kuvvetli kuru rüzgarlar ve sıcak hava dalgası toprak nemini aniden düşürür. Center-pivot arızası ve aşırı azot birikimi sarı pas mantarını tetikler.',
      criticalThresholds: {
        minTemp: 5.0,
        maxTemp: 42.0,
        minMoisture: 20,
        maxMoisture: 65,
        maxHumidity: 70,
        optimumPh: '7.5 - 8.3',
        criticalPh: 8.6,
        riskDisease: 'Sarı Pas (Puccinia striiformis)'
      }
    },
    baseParams: {
      nitrogen: 135,
      phosphorus: 48,
      potassium: 220,
      ph: 8.1,
      ec: 2.1,
      soilMoisture: 42,
      temperature: 23,
      humidity: 34,
      windSpeed: 24,
      extremeWeather: 'none',
      pumpFailure: false,
      dripBlockage: false,
      diseaseType: 'none',
      severity: 0
    },
    parcels: [
      {
        id: 'K-1',
        code: 'Parsel B-1',
        name: 'Bereket Kışlık Buğday Bloğu',
        description: 'Tane dolum evresinde kışlık ekmeklik sert buğday ekim alanı (20 Dönüm)',
        area: '20 Dönüm',
        cropVariety: 'Kışlık Sert Ekmeklik Buğday',
        center: [38.3660, 35.4525],
        coordinates: [
          [38.3651, 35.4534],
          [38.3666, 35.4533],
          [38.3666, 35.4516],
          [38.3651, 35.4514]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'K-2',
        code: 'Parsel B-2',
        name: 'Rüzgarlı Tepe Buğday Sırtı',
        description: 'Kuzeydoğu rüzgarına açık, fön etkisinde nemi en hızlı kaybeden tepe (18 Dönüm)',
        area: '18 Dönüm',
        cropVariety: 'Kışlık Sert Buğday',
        center: [38.3660, 35.4505],
        coordinates: [
          [38.3666, 35.4516],
          [38.3666, 35.4499],
          [38.3651, 35.4494],
          [38.3651, 35.4514]
        ],
        defaultThreatLevel: 'WARNING'
      },
      {
        id: 'K-3',
        code: 'Parsel B-3',
        name: 'Center-Pivot Kuyu & Pompa Merkezi',
        description: 'Dairesel pivot ana kulesi ve derin kuyu sondaj trafosu (10 Dönüm)',
        area: '10 Dönüm',
        cropVariety: 'Buğday & Şeker Pancarı',
        center: [38.3655, 35.4510],
        coordinates: [
          [38.3655, 35.4520],
          [38.3662, 35.4520],
          [38.3662, 35.4505],
          [38.3655, 35.4505]
        ],
        defaultThreatLevel: 'NORMAL'
      },
      {
        id: 'K-4',
        code: 'Parsel B-4',
        name: 'Yol Kenarı Tahıl Parseli',
        description: 'Karasal rüzgarkıran ağaç şeridi kenarındaki düzensiz köşe (7.5 Dönüm)',
        area: '7.5 Dönüm',
        cropVariety: 'Sert Buğday',
        center: [38.3652, 35.4520],
        coordinates: [
          [38.3651, 35.4534],
          [38.3655, 35.4520],
          [38.3655, 35.4505],
          [38.3651, 35.4494]
        ],
        defaultThreatLevel: 'NORMAL'
      }
    ]
  }
];
