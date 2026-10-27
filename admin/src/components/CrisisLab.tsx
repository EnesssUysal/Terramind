import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  AlertTriangle, Droplets, ThermometerSun, 
  FlaskConical, Bug, MapPin, CheckCircle2, RotateCcw, 
  Radio, Copy, Check, Flame, Snowflake, CloudRain, 
  Power, Sparkles, Layers, RefreshCw, Sun, Zap
} from 'lucide-react';
import { REALISTIC_FARMS } from '../data/seedFarms';
import type { RealisticFarmProfile } from '../data/seedFarms';

// Çıktı Şablonu Tipleri
export interface AiCrisisFeedback {
  threatLevel: 'CRITICAL' | 'WARNING' | 'NORMAL';
  identifiedIssue: string;
  locationScope: string;
  immediateActions: string[];
  aiRecommendation: string;
}

interface CrisisLabProps {
  selectedFarmId?: string;
  onSelectFarm?: (farmId: string) => void;
}

export default function CrisisLab({ selectedFarmId: propFarmId, onSelectFarm: propOnSelectFarm }: CrisisLabProps) {
  // 1. Tarla Seçimi
  const [farmId, setFarmId] = useState<string>(propFarmId || REALISTIC_FARMS[0].id);

  // Prop senkronizasyonu
  useEffect(() => {
    if (propFarmId && propFarmId !== farmId) {
      setFarmId(propFarmId);
    }
  }, [propFarmId]);

  const activeFarm = useMemo<RealisticFarmProfile>(() => {
    return REALISTIC_FARMS.find(f => f.id === farmId) || REALISTIC_FARMS[0];
  }, [farmId]);

  // Seçili Parsel
  const [targetParcel, setTargetParcel] = useState<string>(activeFarm.parcels[0].id);

  // 2. Kapsamlı Değişken Matrisi
  // Toprak & Besin (NPK)
  const [nitrogen, setNitrogen] = useState<number>(activeFarm.baseParams.nitrogen);
  const [phosphorus, setPhosphorus] = useState<number>(activeFarm.baseParams.phosphorus);
  const [potassium, setPotassium] = useState<number>(activeFarm.baseParams.potassium);
  const [ph, setPh] = useState<number>(activeFarm.baseParams.ph);
  const [ec, setEc] = useState<number>(activeFarm.baseParams.ec);

  // Hidrolojik Durum
  const [soilMoisture, setSoilMoisture] = useState<number>(activeFarm.baseParams.soilMoisture);
  const [pumpFailure, setPumpFailure] = useState<boolean>(activeFarm.baseParams.pumpFailure);
  const [dripBlockage, setDripBlockage] = useState<boolean>(activeFarm.baseParams.dripBlockage);

  // Mikro-İklim & Hava Olayları
  const [temperature, setTemperature] = useState<number>(activeFarm.baseParams.temperature);
  const [humidity, setHumidity] = useState<number>(activeFarm.baseParams.humidity);
  const [windSpeed, setWindSpeed] = useState<number>(activeFarm.baseParams.windSpeed);
  const [extremeWeather, setExtremeWeather] = useState<string>(activeFarm.baseParams.extremeWeather);

  // Biyolojik Tehditler & Hastalıklar
  const [diseaseType, setDiseaseType] = useState<string>(activeFarm.baseParams.diseaseType);
  const [severity, setSeverity] = useState<number>(activeFarm.baseParams.severity);

  // UI Durumları
  const [copied, setCopied] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  // Tarla değiştiğinde parametreleri ve ilk parseli otomatik güncelle
  const handleFarmSwitch = (newFarmId: string) => {
    const target = REALISTIC_FARMS.find(f => f.id === newFarmId);
    if (!target) return;

    setFarmId(newFarmId);
    if (propOnSelectFarm) propOnSelectFarm(newFarmId);

    // Baz parametreleri yükle
    setNitrogen(target.baseParams.nitrogen);
    setPhosphorus(target.baseParams.phosphorus);
    setPotassium(target.baseParams.potassium);
    setPh(target.baseParams.ph);
    setEc(target.baseParams.ec);
    setSoilMoisture(target.baseParams.soilMoisture);
    setTemperature(target.baseParams.temperature);
    setHumidity(target.baseParams.humidity);
    setWindSpeed(target.baseParams.windSpeed);
    setExtremeWeather(target.baseParams.extremeWeather);
    setPumpFailure(target.baseParams.pumpFailure);
    setDripBlockage(target.baseParams.dripBlockage);
    setDiseaseType(target.baseParams.diseaseType);
    setSeverity(target.baseParams.severity);

    // İlk parseli seç
    setTargetParcel(target.parcels[0].id);

    // Backend'e senkronize et
    fetch('http://localhost:3001/api/admin/select-farm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmId: newFarmId })
    }).catch(e => console.warn("Backend farm sync deferred:", e));
  };

  // Leaflet Harita Referansı
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<{ [key: string]: L.Polygon }>({});

  // =========================================================================
  // 3. ANLIK YAPAY ZEKA GERİ BİLDİRİM MOTORU (BÖLGE & ÜRÜN DUYARLI)
  // =========================================================================
  const aiFeedback = useMemo<AiCrisisFeedback>(() => {
    let threatLevel: 'CRITICAL' | 'WARNING' | 'NORMAL' = 'NORMAL';
    const issues: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    const activeParcelObj = activeFarm.parcels.find(p => p.id === targetParcel) || activeFarm.parcels[0];
    const parcelName = `${activeFarm.name} — ${activeParcelObj.code} (${activeParcelObj.name})`;
    const isApricot = activeFarm.id === '1793109250136' || activeFarm.id === 'malatya-battalgazi' || activeFarm.crop.toLowerCase().includes('kayısı');
    const isBeetOrGrain = activeFarm.id === '1793109326110' || activeFarm.id === 'kayseri-develi' || activeFarm.crop.toLowerCase().includes('buğday') || activeFarm.crop.toLowerCase().includes('pancar');
    const isGrapeVine = activeFarm.id === '1793109118563' || activeFarm.id === 'manisa-alasehir' || activeFarm.crop.toLowerCase().includes('üzüm');

    // A) Hidrolojik & Altyapı Tehditleri
    if (pumpFailure && dripBlockage) {
      threatLevel = 'CRITICAL';
      issues.push(`Kritik sulama altyapısı çöküşü (Ana pompa kapalı & damlama hatları tıkalı)`);
      actions.push('Hidrolik basınç hattını acilen manuel tahliyeye alın ve bypass vanalarını devreye sokun.');
      actions.push('Filtre istasyonundaki disk/kum filtrelerini derhal ters yıkama (backwash) işlemine tabi tutun.');
      recommendations.push(`Sulama altyapısı arızası ${activeFarm.crop} köklerinde 24 saat içinde telafisi güç turgor kaybına ve yanıklığa yol açacaktır.`);
    } else if (pumpFailure) {
      threatLevel = 'WARNING';
      issues.push(`Sulama pompası arızası nedeniyle su akışı kesildi`);
      actions.push('Elektrik panosu termik rölesini ve pompa motor sargısını test edin.');
      recommendations.push('Yedek jeneratör veya ikincil kuyu hattına geçiş yapılması gerekmektedir.');
    } else if (dripBlockage) {
      threatLevel = 'WARNING';
      issues.push(`Damlama hattında kireç/tortu birikmesi sonucu kısmi tıkanıklık`);
      actions.push('Damlama borularına seyreltik nitrik veya fosforik asit çözeltisi enjekte ederek hatları yıkayın.');
      recommendations.push(`${activeFarm.soilType} yapısındaki yüksek kireç boru damlatıcılarını tıkamaktadır; asitleme rutini sıklaştırılmalıdır.`);
    }

    // Toprak Nemi
    if (soilMoisture < 18) {
      threatLevel = 'CRITICAL';
      issues.push(`Şiddetli kök bölgesi kuraklığı (Nem: %${soilMoisture})`);
      actions.push('Acilen gece saatlerinde derin kök doyurma sulaması (min 4 saat) başlatın.');
      recommendations.push(`${activeFarm.crop} gelişiminde kalıcı solma noktasına (PWP) yaklaşılmıştır.`);
    } else if (soilMoisture > 82) {
      threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      issues.push(`Toprakta aşırı su doygunluğu ve kök asfiksi (boğulma) riski (Nem: %${soilMoisture})`);
      actions.push('Planlanan tüm sulamaları derhal iptal edin ve parsel tahliye hendeklerini açın.');
      recommendations.push('Kök bölgesinde anaerobik çürüme ve havalanma yetersizliği oluşmaktadır.');
    }

    // B) Mikro-İklim & Hava Olayları (Bölgesel Hassasiyet)
    if (extremeWeather === 'frost' || temperature < 0) {
      threatLevel = 'CRITICAL';
      if (isApricot) {
        issues.push(`Erken ilkbahar radyasyon donu (-3°C ile -5°C) — Kayısı taç yaprak ve çanak donması`);
        actions.push('Gece saat 03:00 - 06:30 arasında bahçede rüzgar pervanelerini ve sisleme/dumanlama fıçılarını devreye alın.');
        actions.push('Ağaç gövdelerine antifriz etkili aminoasit ve çinko-bor takviyeli yaprak gübresi püskürtün.');
        recommendations.push('Battalgazi havzasındaki taban parselde don çukuru oluşmuştur; çiçeklenme evresindeki kayısılarda %70 e varan verim kaybı an meselesidir.');
      } else {
        issues.push(`Ani don ve gece ayazı şoku (Sıcaklık: ${temperature}°C)`);
        actions.push('Sıcaklığı 1-2°C artırmak için mikro-yağmurlama ile gizli ısı salınımı yapın.');
        recommendations.push('Dondan sonra bitki dokularını korumak için bakırlı preparat uygulamasını erteleyin.');
      }
    } else if (extremeWeather === 'heatwave' || temperature >= 40) {
      threatLevel = 'CRITICAL';
      if (isGrapeVine) {
        issues.push(`Ege aşırı sıcak hava dalgası (${temperature}°C) ve Sultaniye salkım yanıklığı`);
        actions.push('Asma tepe yapraklarını gölgeleme amacıyla hafif yatırın ve telli terbiye altı yer altı damlamasını serinletici modda açın.');
        actions.push('Güneş yanıklığına karşı salkımlara kaolin kili uygulaması yapın.');
        recommendations.push('Alaşehir ovasında 40°C üzeri sıcaklık üzüm tanelerinde su çekilmesine ve asit dengesinin bozulmasına yol açacaktır.');
      } else {
        issues.push(`Aşırı sıcak hava dalgası (${temperature}°C) ve buharlaşma stresi`);
        actions.push('Buharlaşma kaybını azaltmak için sulamayı sadece 21:00 - 05:00 saatleri arasına kaydırın.');
        recommendations.push('Gündüz stomatalar kapanacağı için yapraktan gübreleme yapılmamalıdır.');
      }
    } else if (extremeWeather === 'hail') {
      threatLevel = 'CRITICAL';
      issues.push(`Dolu fırtınası riski — Mekanik yaprak ve meyve yaralanması`);
      actions.push('Varsa dolu tüllerini çekin; dolu sonrası yara dokularını mantarlara karşı korumak için 24 saat içinde sistemik bakır uygulayın.');
      recommendations.push('Dolu darbeleri sekonder patojen girişine davetiye çıkaracaktır.');
    } else if (extremeWeather === 'storm') {
      threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      issues.push(`Şiddetli fırtına ve gök gürültülü sağanak yağış (Rüzgar: ${windSpeed} km/s)`);
      actions.push('Sulama sistemini kapatın ve drenaj kanallarını açık tutun.');
      recommendations.push('Doğal yağış kök derinliğini doyuracaktır; gübre yıkama riskine dikkat edilmelidir.');
    }

    // C) Toprak & Besin (NPK, pH, EC)
    if (isApricot && ph > 8.3) {
      threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      issues.push(`Yüksek kireç kaynaklı alkalin kloroz riski (Toprak pH: ${ph})`);
      actions.push('Damla sulama tankına kükürt ve şelatlı demir (Fe-EDDHA) enjekte edin.');
      recommendations.push('pH 8.0 üzerine çıktığında kayısı ağaçlarında demir ve çinko alımı kilitlenir; yaprak damar araları sararır.');
    } else if (ph < 5.5) {
      threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      issues.push(`Aşırı asidik toprak (pH: ${ph}) — Fosfor kilitlenmesi`);
      actions.push('Tarım kireci (CaCO3) uygulaması ile toprak pH seviyesini kademeli yükseltin.');
      recommendations.push('Düşük pH kök uçlarında alüminyum toksisitesine zemin hazırlar.');
    }

    if (ec > 3.0) {
      threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      issues.push(`Toprak tuzluluk stresi (EC: ${ec} dS/m)`);
      actions.push('Tuzları kök bölgesinden aşağı yıkamak (leaching) için fazladan %20 saf su uygulayın.');
      recommendations.push('Yüksek iletkenlik ozmotik basıncı artırarak köklerin su çekmesini engeller.');
    }

    if (nitrogen > 150) {
      if (soilMoisture > 60) {
        threatLevel = 'CRITICAL';
        issues.push(`Aşırı azot (${nitrogen} ppm) ve yüksek nem kombinasyonu`);
        actions.push('Planlanan tüm azotlu üst gübrelemeleri derhal durdurun.');
        actions.push('Gövde ve yaprak dokusunu sertleştirmek için potasyum sülfat takviyesi yapın.');
        recommendations.push('Gereğinden fazla azot yaprak dokusunu aşırı etli ve sulu hale getirerek mantar sporlarına karşı savunmasız bırakır.');
      } else {
        threatLevel = threatLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
        issues.push(`Yüksek azot seviyesi (${nitrogen} ppm)`);
        actions.push('Üre ve amonyum sülfat kullanımını askıya alın.');
      }
    }

    // D) Biyolojik Tehditler (Hastalık & Zararlılar)
    if (diseaseType !== 'none') {
      const isSevere = severity >= 45;
      threatLevel = severity >= 45 ? 'CRITICAL' : 'WARNING';

      if (diseaseType === 'powdery_mildew') {
        issues.push(`Külleme Mantarı (Oidium / Erysiphe) ${isSevere ? 'Salgını' : 'Başlangıcı'} (Şiddet: %${severity})`);
        actions.push('Gediz vadisi nemi küllemeyi hızlandırdığı için mikronize kükürt veya penconazole etken maddeli fungisit uygulayın.');
        actions.push('Güneşlenmeyi ve hava sirkülasyonunu artırmak için iç asma sürgünlerinde hafif yaprak alma yapın.');
        recommendations.push(`${parcelName} bölgesinde külleme mantarı salkım ve yaprak yüzeyinde gri-beyaz unsu örtü oluşturarak fotosentezi durduracaktır.`);
      } else if (diseaseType === 'rust') {
        issues.push(`Sarı Pas (Puccinia striiformis) ${isSevere ? 'Epidemisi' : 'Tehdidi'} (Şiddet: %${severity})`);
        actions.push('Develi ovası rüzgarıyla spor yayılımını kesmek için tebuconazole veya azoxystrobin uygulayın.');
        actions.push('Aşırı sulamadan kaçının; yaprak ıslaklık süresini minimuma indirin.');
        recommendations.push(isBeetOrGrain 
          ? 'Kayseri Develi buğday ve tahıl parsellerinde sarı pas yaprak ayasını sarı püstüllerle kaplayarak dane tutumunu %40 düşürür.' 
          : 'Sarı pas yapraklarda çizgi şeklinde sarı püstüller açarak dane dolumunu %40 düşürür.');
      } else if (diseaseType === 'root_rot') {
        issues.push(`Kök Çürüklüğü (Phytophthora / Fusarium) Salgını (Şiddet: %${severity})`);
        actions.push('Fosetyl-Al veya metalaxyl etken maddeli sistemik fungisiti damlama hattından kök bölgesine enjekte edin.');
        actions.push('Aşırı su biriken alt vadi tabanındaki drenaj hatlarını derhal açın.');
        recommendations.push('Kök boğulması sonucu yaprak sararması ve dal kurumaları başlayacaktır; acilen toprak havalandırması şarttır.');
      } else if (diseaseType === 'monilya') {
        issues.push(`Kayısı Çiçek Monilyası (Monilinia laxa) Şiddeti: %${severity}`);
        actions.push('Çiçeklenme evresinde boscalid + pyraclostrobin veya captan ile koruyucu ilaçlama yapın.');
        actions.push('Hastalıklı kurumuş dal ve mumyalaşmış meyveleri budayarak bahçeden uzaklaştırın ve yakın.');
        recommendations.push('Malatya kayısılarında çiçek monilyası genç sürgünlerin ve çiçeklerin aniden yanmış gibi kurumasına yol açar.');
      } else if (diseaseType === 'spider_mite') {
        issues.push(`Kırmızı Örümcek Zararlısı (Şiddet: %${severity})`);
        actions.push('Sıcak ve kuru hava populasyonu patlattığı için abamectin veya spirodiclofen akarisit uygulayın.');
        actions.push('Yol kenarındaki toz kalkmasını engellemek için tarla sınırlarını hafif nemlendirin.');
        recommendations.push('Yaprak altı klorofil emilimi nedeniyle yapraklar bronzlaşır ve erken dökülür.');
      } else if (diseaseType === 'aphid') {
        issues.push(`Yaprak Biti Kolonisi (Şiddet: %${severity})`);
        actions.push('Acetamiprid veya organik neem yağı preparatı uygulayın.');
        recommendations.push('Yaprak bitlerinin salgıladığı tatlımsı madde fumajin (karaballık) mantarına yol açacaktır.');
      }
    }

    // Varsayılan normal durum
    if (issues.length === 0) {
      return {
        threatLevel: 'NORMAL',
        identifiedIssue: `${parcelName} genelinde tüm biyotik ve abiyotik parametreler referans aralıktadır.`,
        locationScope: parcelName,
        immediateActions: [
          `Mevcut ${activeFarm.irrigationInfrastructure.split('&')[0]} programını kesintisiz sürdürün.`,
          `${activeFarm.crop} için fenolojik gelişim takvimini koruyun ve haftalık sensör kontrolünü tamamlayın.`
        ],
        aiRecommendation: `${activeFarm.name} için toprak pH (${ph}) ve nem (%${soilMoisture}) dengesi idealdir. Vejetatif büyüme skoru (NDVI: ${activeFarm.ndvi}) mükemmel düzeydedir.`
      };
    }

    return {
      threatLevel,
      identifiedIssue: issues.join(' + '),
      locationScope: parcelName,
      immediateActions: actions.length > 0 ? actions : ['Parseldeki sensör okumalarını yerinde kontrol edin.'],
      aiRecommendation: recommendations.join(' ') || `${parcelName} için acil koruyucu ziraat protokolü devreye alınmalıdır.`
    };
  }, [
    farmId, targetParcel, nitrogen, phosphorus, potassium, ph, ec, 
    soilMoisture, pumpFailure, dripBlockage, temperature, 
    humidity, windSpeed, extremeWeather, diseaseType, severity, activeFarm
  ]);

  // =========================================================================
  // 4. LEAFLET HARİTA ENTEGRASYONU & ETKİLENEN PARSELİ İNTERAKTİF RENKLENDİRME
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: activeFarm.center,
        zoom: activeFarm.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Uydu Görüntüsü Katmanı (ESRI World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Önceki poligon katmanlarını temizle
    Object.values(polygonLayersRef.current).forEach(layer => layer.remove());
    polygonLayersRef.current = {};

    // Seçilen tarlanın parsellerini haritaya çiz ve renklendir
    activeFarm.parcels.forEach((parcel) => {
      const isTarget = targetParcel === 'all' || targetParcel === parcel.id;

      // Tehdit seviyesine göre interaktif renk ve stil matrisi
      let fillColor = '#10b981'; // Normal: Zümrüt Yeşili
      let borderColor = '#059669';
      let fillOpacity = 0.35;
      let weight = 2;

      if (isTarget) {
        if (aiFeedback.threatLevel === 'CRITICAL') {
          fillColor = '#ef4444'; // Kritik: Parlak Kırmızı
          borderColor = '#b91c1c';
          fillOpacity = 0.75;
          weight = 4;
        } else if (aiFeedback.threatLevel === 'WARNING') {
          fillColor = '#f59e0b'; // Uyarı: Kehribar / Turuncu
          borderColor = '#d97706';
          fillOpacity = 0.55;
          weight = 3;
        } else {
          fillColor = '#10b981';
          borderColor = '#34d399';
          fillOpacity = 0.45;
          weight = 3;
        }
      } else {
        // Hedefte olmayan diğer parseller
        fillColor = '#475569';
        borderColor = '#64748b';
        fillOpacity = 0.2;
        weight = 1.5;
      }

      const polygon = L.polygon(parcel.coordinates, {
        color: borderColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        weight: weight,
        dashArray: isTarget && aiFeedback.threatLevel === 'CRITICAL' ? '6, 6' : undefined
      }).addTo(map);

      // Popup Bilgisi
      polygon.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
          <h4 style="font-weight: 800; font-size: 13px; margin: 0 0 4px 0; color: #0f172a;">${parcel.code}: ${parcel.name}</h4>
          <p style="font-size: 11px; margin: 0 0 6px 0; color: #64748b;">${parcel.description}</p>
          <div style="font-size: 11px; font-weight: 700; color: ${aiFeedback.threatLevel === 'CRITICAL' ? '#ef4444' : aiFeedback.threatLevel === 'WARNING' ? '#f59e0b' : '#10b981'};">
            Durum: ${isTarget ? aiFeedback.threatLevel : 'STABİL'}
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px;">
            Nem: %${soilMoisture} • Sıcaklık: ${temperature}°C • pH: ${ph}
          </div>
          <div style="font-size: 10px; color: #059669; font-weight: 600; margin-top: 2px;">
            Çeşit: ${parcel.cropVariety}
          </div>
        </div>
      `);

      // Tıklanınca parseli seç
      polygon.on('click', () => {
        setTargetParcel(parcel.id);
      });

      polygonLayersRef.current[parcel.id] = polygon;
    });

    // Seçilen parsel merkezine odaklan
    if (targetParcel !== 'all') {
      const selectedParcel = activeFarm.parcels.find(p => p.id === targetParcel);
      if (selectedParcel) {
        map.panTo(selectedParcel.center, { animate: true, duration: 0.6 });
      }
    } else {
      map.setView(activeFarm.center, activeFarm.zoom);
    }

  }, [targetParcel, aiFeedback, soilMoisture, temperature, ph, activeFarm]);

  // Tarla değiştiğinde harita görünümünü merkeze al
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(activeFarm.center, activeFarm.zoom, { duration: 1.2 });
    }
  }, [activeFarm]);

  // =========================================================================
  // 5. BÖLGEYE ÖZEL VE ÖN TANIMLI HAZIR SENARYOLAR (CRISIS PRESETS)
  // =========================================================================
  const applyRecommendedScenario = () => {
    if (activeFarm.id === '1793109250136' || activeFarm.id === 'malatya-battalgazi' || activeFarm.crop.toLowerCase().includes('kayısı')) {
      // Malatya: Erken İlkbahar Donu & Monilya Mantarı
      setTemperature(-3);
      setSoilMoisture(48);
      setHumidity(84);
      setWindSpeed(8);
      setExtremeWeather('frost');
      setDiseaseType('monilya');
      setSeverity(85);
      setPumpFailure(false);
      setDripBlockage(false);
      setTargetParcel('M-2'); // Don çukuru parseli
    } else if (activeFarm.id === '1793109326110' || activeFarm.id === 'kayseri-develi' || activeFarm.crop.toLowerCase().includes('buğday')) {
      // Kayseri: Kuraklık & Yüksek Azot & Sarı Pas
      setSoilMoisture(14);
      setTemperature(38);
      setHumidity(22);
      setWindSpeed(32);
      setNitrogen(190);
      setPotassium(260);
      setExtremeWeather('heatwave');
      setDiseaseType('rust');
      setSeverity(85);
      setPumpFailure(true);
      setTargetParcel('K-2'); // Rüzgarlı buğday sırtı
    } else if (activeFarm.id === '1793109118563' || activeFarm.id === 'manisa-alasehir' || activeFarm.crop.toLowerCase().includes('üzüm')) {
      // Manisa: Ege Sıcak Dalgası (43°C) & Külleme Salgını
      setTemperature(43);
      setSoilMoisture(52);
      setHumidity(76);
      setWindSpeed(12);
      setExtremeWeather('heatwave');
      setDiseaseType('powdery_mildew');
      setSeverity(85);
      setPumpFailure(false);
      setDripBlockage(true);
      setTargetParcel('G-2'); // Nemli Gediz tabanı külleme odağı
    }
  };

  const applyPreset = (preset: string) => {
    if (preset === 'drought') {
      setSoilMoisture(12);
      setTemperature(41);
      setHumidity(15);
      setPumpFailure(true);
      setDripBlockage(true);
      setExtremeWeather('heatwave');
      setDiseaseType('none');
    } else if (preset === 'flood_rot') {
      setSoilMoisture(96);
      setTemperature(22);
      setHumidity(92);
      setNitrogen(190);
      setExtremeWeather('storm');
      setDiseaseType('root_rot');
      setSeverity(85);
      setPumpFailure(false);
    } else if (preset === 'frost') {
      setTemperature(-4);
      setSoilMoisture(45);
      setHumidity(80);
      setExtremeWeather('frost');
      setDiseaseType((activeFarm.id === '1793109250136' || activeFarm.id === 'malatya-battalgazi' || activeFarm.crop.toLowerCase().includes('kayısı')) ? 'monilya' : 'none');
    } else if (preset === 'fertilizer_burn') {
      setNitrogen(240);
      setEc(4.8);
      setPh(5.1);
      setSoilMoisture(28);
      setDiseaseType('none');
    } else if (preset === 'reset') {
      // Aktif tarlanın orijinal referans değerlerine dön
      setNitrogen(activeFarm.baseParams.nitrogen);
      setPhosphorus(activeFarm.baseParams.phosphorus);
      setPotassium(activeFarm.baseParams.potassium);
      setPh(activeFarm.baseParams.ph);
      setEc(activeFarm.baseParams.ec);
      setSoilMoisture(activeFarm.baseParams.soilMoisture);
      setPumpFailure(activeFarm.baseParams.pumpFailure);
      setDripBlockage(activeFarm.baseParams.dripBlockage);
      setTemperature(activeFarm.baseParams.temperature);
      setHumidity(activeFarm.baseParams.humidity);
      setWindSpeed(activeFarm.baseParams.windSpeed);
      setExtremeWeather('none');
      setDiseaseType('none');
      setSeverity(10);
      setTargetParcel(activeFarm.parcels[0].id);
    }
  };

  // =========================================================================
  // 6. SAHAYA VE BACKEND SİSTEMİNE CANLI ENJEKSİYON (REST API)
  // =========================================================================
  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    try {
      await fetch('http://localhost:3001/api/admin/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `CrisisLab [${activeFarm.name}]: ${aiFeedback.identifiedIssue.slice(0, 35)}`,
          overrides: {
            soilMoisture,
            temperature,
            nitrogen,
            phosphorus,
            potassium,
            pH: ph,
            ec,
            humidity,
            windSpeed
          }
        })
      });
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (e) {
      console.error("Broadcast failed", e);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(aiFeedback, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* ========================================================================= */}
      {/* ÜST BİLGİ & 3 BÖLGELİ TARLA SEÇİCİ */}
      {/* ========================================================================= */}
      <div className="bg-[#101A17] border border-[#1B2926] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#1B2926]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-black text-[11px] uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <AlertTriangle size={13} /> Sadece Yetkili Yönetici (role: admin)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                Leaflet Vektörel Harita Entegre
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Saha Kriz Simülasyon Merkezi <span className="text-emerald-400 text-lg font-mono">(Crisis Lab)</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Türkiye'nin 3 stratejik tarım bölgesinde çok parametreli stres testleri çalıştırın; toprak, su ve iklim dinamiklerini gerçek zamanlı simüle edin.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
            <button
              onClick={() => applyPreset('reset')}
              className="px-4 py-2.5 bg-[#15201D] hover:bg-[#1E2E2A] text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-[#213530] flex items-center gap-2"
            >
              <RotateCcw size={15} /> Değerleri Sıfırla
            </button>
            <button
              onClick={handleBroadcast}
              disabled={isBroadcasting}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                broadcastSuccess 
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
            >
              {isBroadcasting ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : broadcastSuccess ? (
                <Check size={15} />
              ) : (
                <Radio size={15} className="animate-pulse" />
              )}
              <span>{broadcastSuccess ? 'Sahaya İletildi' : 'Canlı Sisteme Aktar'}</span>
            </button>
          </div>
        </div>

        {/* 3 BÖLGELİ HIZLI TARLA SEÇİCİ SEKMELERİ */}
        <div className="pt-5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Aktif Simülasyon Tarlası Seçimi (Malatya • Kayseri • Manisa)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {REALISTIC_FARMS.map((farm) => {
              const isSelected = farm.id === farmId;
              return (
                <button
                  key={farm.id}
                  type="button"
                  onClick={() => handleFarmSwitch(farm.id)}
                  className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-950/60 to-[#0C1613] border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-[#15201D]/70 hover:bg-[#15201D] border-[#1E2E2A] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {farm.code} • {farm.province.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{farm.area}</span>
                    </div>
                    <h4 className={`text-sm font-bold leading-tight mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {farm.name}
                    </h4>
                    <p className="text-xs text-emerald-300/80 font-medium line-clamp-1 mb-2">
                      {farm.crop}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1E2E2A] text-[11px] text-slate-400 flex items-center justify-between">
                    <span>pH {farm.baseParams.ph} • %{farm.baseParams.soilMoisture} Nem</span>
                    <span className="font-semibold text-emerald-400">{farm.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEÇİLİ TARLANIN KARAKTERİSTİK ÖZETİ VE ÖZEL SENARYO BUTONU */}
        <div className="mt-5 p-4 rounded-2xl bg-[#09100E] border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Bölge Profili:
              </span>
              <span className="text-xs text-white font-medium">{activeFarm.region}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300">{activeFarm.cropCategory}</span>
            </div>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Toprak & Sulama:</strong> {activeFarm.soilType} — <span className="text-emerald-300">{activeFarm.irrigationInfrastructure}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={applyRecommendedScenario}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
            title={activeFarm.testScenarioProfile.threatDescription}
          >
            <Zap size={14} className="animate-bounce" />
            <span>{activeFarm.testScenarioProfile.recommendedScenario}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2 SÜTUNLU ANA ÇALIŞMA ALANI */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* --------------------------------------------------------------------- */}
        {/* SOL PANEL: DEĞİŞKEN MATRİSİ & MANİPÜLASYON KUMANDALARI (7 Sütun) */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* HEDEF PARSEL SEÇİCİ */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1B2926]">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <MapPin size={16} /> Test Edilecek Alt Parsel / Bölge ({activeFarm.name})
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                {activeFarm.province.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeFarm.parcels.map((p) => {
                const isSelected = targetParcel === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTargetParcel(p.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                      isSelected 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm' 
                        : 'bg-[#15201D] text-slate-400 border-[#213530] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] opacity-75">{p.code}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </div>
                    <p className="truncate mt-0.5 font-medium">{p.name}</p>
                    <span className="text-[10px] text-slate-500 block truncate">{p.area}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. TOPRAK & BESİN MATRİSİ (NPK, pH, EC) */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2926]">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <FlaskConical size={16} /> 1. Toprak & Besin Matrisi (NPK, pH, EC)
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded">
                KİMYASAL SENSÖRLER
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Azot (N) */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    Azot (N) <span className="text-[11px] text-slate-500 font-normal">0 - 250 ppm</span>
                  </span>
                  <span className="text-purple-400 font-mono text-sm">{nitrogen} ppm</span>
                </div>
                <input 
                  type="range" min="0" max="250" value={nitrogen} 
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Fosfor (P) */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    Fosfor (P) <span className="text-[11px] text-slate-500 font-normal">0 - 100 ppm</span>
                  </span>
                  <span className="text-purple-400 font-mono text-sm">{phosphorus} ppm</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={phosphorus} 
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Potasyum (K) */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    Potasyum (K) <span className="text-[11px] text-slate-500 font-normal">0 - 350 ppm</span>
                  </span>
                  <span className="text-purple-400 font-mono text-sm">{potassium} ppm</span>
                </div>
                <input 
                  type="range" min="0" max="350" value={potassium} 
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* pH & EC İkili Kolon */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1B2926]">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-slate-300">Toprak pH (4.0 - 9.0)</span>
                    <span className="text-amber-400 font-mono text-sm">{ph.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="4.0" max="9.0" step="0.1" value={ph} 
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-slate-300">EC / Tuzluluk (dS/m)</span>
                    <span className="text-sky-400 font-mono text-sm">{ec.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="0.2" max="6.0" step="0.1" value={ec} 
                    onChange={(e) => setEc(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. HİDROLOJİK DURUM & ALTYAPI ARIZALARI */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2926]">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Droplets size={16} /> 2. Hidrolojik Durum & Sulama Altyapısı
              </span>
              <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded">
                SULAMA & DEBİ
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-300">Toprak Nem Seviyesi (%0 - %100)</span>
                  <span className={`font-mono text-sm font-black ${
                    soilMoisture < 20 ? 'text-rose-400' : soilMoisture > 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    %{soilMoisture}
                  </span>
                </div>
                <input 
                  type="range" min="0" max="100" value={soilMoisture} 
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-sky-500 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Altyapı Arıza Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPumpFailure(!pumpFailure)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    pumpFailure
                      ? 'bg-rose-950/50 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50'
                      : 'bg-[#15201D] border-[#213530] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Pompa Arızası</span>
                    <span className="text-[10px] opacity-75">{pumpFailure ? 'AKINTI KESİLDİ' : 'Normal Çalışıyor'}</span>
                  </div>
                  <Power size={18} className={pumpFailure ? 'text-rose-400 animate-pulse' : 'text-slate-600'} />
                </button>

                <button
                  type="button"
                  onClick={() => setDripBlockage(!dripBlockage)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    dripBlockage
                      ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                      : 'bg-[#15201D] border-[#213530] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Damlama Tıkanıklığı</span>
                    <span className="text-[10px] opacity-75">{dripBlockage ? 'HATLAR TIKALI' : 'Debi Düzgün'}</span>
                  </div>
                  <Droplets size={18} className={dripBlockage ? 'text-amber-400 animate-pulse' : 'text-slate-600'} />
                </button>
              </div>
            </div>
          </div>

          {/* 3. MİKRO-İKLİM & HAVA OLAYLARI */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2926]">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <ThermometerSun size={16} /> 3. Mikro-İklim & Aşırı Hava Olayları
              </span>
              <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded">
                METEOROLOJİ
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Sıcaklık */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300">Sıcaklık (-10°C ile +48°C)</span>
                  <span className={`font-mono text-sm ${
                    temperature < 0 ? 'text-cyan-400' : temperature > 38 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {temperature}°C
                  </span>
                </div>
                <input 
                  type="range" min="-10" max="48" value={temperature} 
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Nem & Rüzgar */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-slate-300">Bağıl Nem (%10 - %95)</span>
                    <span className="text-sky-400 font-mono text-sm">%{humidity}</span>
                  </div>
                  <input 
                    type="range" min="10" max="95" value={humidity} 
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-slate-300">Rüzgar (0 - 80 km/s)</span>
                    <span className="text-slate-300 font-mono text-sm">{windSpeed} km/s</span>
                  </div>
                  <input 
                    type="range" min="0" max="80" value={windSpeed} 
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="w-full accent-slate-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Aşırı Hava Olayı Seçimi */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Beklenen Aşırı Hava Olayı
                </label>
                <select
                  value={extremeWeather}
                  onChange={(e) => setExtremeWeather(e.target.value)}
                  className="w-full bg-[#15201D] border border-[#213530] text-sm text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-rose-500 font-semibold"
                >
                  <option value="none">Normal / Olağan Hava</option>
                  <option value="frost">❄️ Ani Gece Donu / Ayaz (-3°C ile -6°C)</option>
                  <option value="heatwave">🔥 Şiddetli Sıcak Hava Dalgası (40°C+)</option>
                  <option value="hail">🧊 Şiddetli Dolu Fırtınası</option>
                  <option value="storm">⛈️ Şiddetli Sağanak Yağış & Fırtına</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. BİYOLOJİK TEHDİTLER & HASTALIKLAR */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2926]">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Bug size={16} /> 4. Biyolojik Tehditler & Zararlı Yayılımı
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                PATOLOJİ
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hastalık / Zararlı Türü (Bölgeye Özel)
                </label>
                <select
                  value={diseaseType}
                  onChange={(e) => setDiseaseType(e.target.value)}
                  className="w-full bg-[#15201D] border border-[#213530] text-sm text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="none">Tehdit Yok (Temiz Parsel)</option>
                  <option value="monilya">🌸 Malatya: Monilya / Çiçek Yanıklığı (Monilinia laxa)</option>
                  <option value="rust">🌾 Kayseri: Sarı Pas Mantarı (Puccinia striiformis)</option>
                  <option value="powdery_mildew">🍇 Manisa: Bağ Külleme Mantarı (Uncinula necator)</option>
                  <option value="root_rot">🍄 Kök & Taç Çürüklüğü (Phytophthora / Fusarium)</option>
                  <option value="spider_mite">🕷️ Kırmızı Örümcek Akarı (Tetranychidae)</option>
                  <option value="aphid">🐛 Yaprak Biti & Tatlımsı Madde Salgısı</option>
                </select>
              </div>

              {/* Şiddet Seviyesi */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Salgın Şiddet Seviyesi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 10, label: 'Başlangıç (%10)', color: 'text-emerald-400' },
                    { val: 45, label: 'Orta Yayılım (%45)', color: 'text-amber-400' },
                    { val: 85, label: 'Kritik Salgın (%85)', color: 'text-rose-400' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setSeverity(s.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        severity === s.val
                          ? 'bg-white/10 text-white border-emerald-500 shadow-sm'
                          : 'bg-[#15201D] text-slate-400 border-[#213530] hover:text-white'
                      }`}
                    >
                      <span className={s.color}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --------------------------------------------------------------------- */}
        {/* SAĞ PANEL: LEAFLET HARİTASI & ANLIK AI GERİ BİLDİRİM ÇIKTISI (5 Sütun) */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* LEAFLET UYDU HARİTASI & İNTERAKTİF PARSEL RENKLENDİRMESİ */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1B2926]">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Leaflet Dinamik Parsel Haritası
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Uyarı
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Kritik
                </span>
              </div>
            </div>

            {/* Harita Konteyneri */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-72 rounded-2xl overflow-hidden border border-[#1B2926] shadow-inner relative z-0"
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">
                Seçili: <strong className="text-white">{targetParcel}</strong> • {activeFarm.name}
              </span>
              <span className="font-mono text-emerald-400 shrink-0">
                {activeFarm.lat.toFixed(4)}° N, {activeFarm.lng.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* CANLI AI GERİ BİLDİRİM MOTORU (JSON / GÖRSEL KART) */}
          <div className="bg-[#0E1614] rounded-3xl p-5 border border-[#1B2926] shadow-2xl space-y-4">
            
            {/* Kart Üst Bilgisi & Format Seçici */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2926]">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Live AI Feedback Engine
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-[#15201D] p-1 rounded-xl border border-[#213530]">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'visual' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Görsel Rapor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'json' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JSON Formatı
                </button>
              </div>
            </div>

            {/* TEHDİT SEVİYESİ ROZETİ */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              aiFeedback.threatLevel === 'CRITICAL'
                ? 'bg-rose-950/40 border-rose-500/80 text-rose-300'
                : aiFeedback.threatLevel === 'WARNING'
                  ? 'bg-amber-950/40 border-amber-500/80 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                  aiFeedback.threatLevel === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                    : aiFeedback.threatLevel === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {aiFeedback.threatLevel === 'CRITICAL' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">Tehdit Derecesi</span>
                  <span className="text-base font-black tracking-tight">{aiFeedback.threatLevel}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Kapsam</span>
                <span className="text-xs font-mono font-bold text-white">{activeFarm.code} - {targetParcel}</span>
              </div>
            </div>

            {/* FORMAT 1: GÖRSEL RAPOR */}
            {activeTab === 'visual' ? (
              <div className="space-y-3.5 text-xs">
                
                {/* Teşhis */}
                <div className="bg-[#15201D] p-3.5 rounded-2xl border border-[#213530]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    🔍 Tespit Edilen Kriz & Risk
                  </span>
                  <p className="text-white font-semibold leading-relaxed">
                    {aiFeedback.identifiedIssue}
                  </p>
                </div>

                {/* Lokasyon Kapsamı */}
                <div className="bg-[#15201D] p-3.5 rounded-2xl border border-[#213530]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    📍 Konum ve Parsel Kapsamı (locationScope)
                  </span>
                  <p className="text-emerald-300 font-mono font-medium">
                    {aiFeedback.locationScope}
                  </p>
                </div>

                {/* Acil Aksiyonlar */}
                <div className="bg-[#15201D] p-3.5 rounded-2xl border border-[#213530]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    ⚡ Derhal Alınacak Aksiyonlar (immediateActions)
                  </span>
                  <ul className="space-y-1.5">
                    {aiFeedback.immediateActions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-200">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ziraat Mühendisi Tavsiyesi */}
                <div className="bg-[#15201D] p-3.5 rounded-2xl border border-[#213530]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    🌾 Ziraat Mühendisi Öngörü & Reçetesi (aiRecommendation)
                  </span>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {aiFeedback.aiRecommendation}
                  </p>
                </div>

              </div>
            ) : (
              /* FORMAT 2: TAM VE KOPYALANABİLİR JSON */
              <div className="relative">
                <button
                  type="button"
                  onClick={copyJson}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 z-10"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Kopyalandı' : 'JSON Kopyala'}</span>
                </button>
                <pre className="bg-[#080D0C] p-4 rounded-2xl border border-[#213530] text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-96 scrollbar-thin">
                  {JSON.stringify(aiFeedback, null, 2)}
                </pre>
              </div>
            )}

            {/* Hazır Senaryo Butonları */}
            <div className="pt-2 border-t border-[#1B2926]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Hızlı Stres Testi Senaryoları
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => applyPreset('drought')}
                  className="p-2.5 rounded-xl bg-[#15201D] hover:bg-[#1E2E2A] text-amber-300 border border-[#213530] font-bold flex items-center gap-1.5"
                >
                  <Sun size={14} className="text-amber-400" /> Şiddetli Kuraklık
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('flood_rot')}
                  className="p-2.5 rounded-xl bg-[#15201D] hover:bg-[#1E2E2A] text-sky-300 border border-[#213530] font-bold flex items-center gap-1.5"
                >
                  <CloudRain size={14} className="text-sky-400" /> Sel & Kök Çürüklüğü
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('frost')}
                  className="p-2.5 rounded-xl bg-[#15201D] hover:bg-[#1E2E2A] text-cyan-300 border border-[#213530] font-bold flex items-center gap-1.5"
                >
                  <Snowflake size={14} className="text-cyan-400" /> Gece Donu / Ayaz
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('fertilizer_burn')}
                  className="p-2.5 rounded-xl bg-[#15201D] hover:bg-[#1E2E2A] text-rose-300 border border-[#213530] font-bold flex items-center gap-1.5"
                >
                  <Flame size={14} className="text-rose-400" /> Gübre / Tuz Yanığı
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
