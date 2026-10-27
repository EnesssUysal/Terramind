import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import TerraMindLogo from './TerraMindLogo';

const socket = io('http://localhost:3001');

export interface FieldItem {
  id: string;
  name: string;
  location: string;
  area: string;
  status: 'Sağlıklı' | 'Dikkat' | 'Kritik';
  lat: number;
  lng: number;
  crop: string;
  ndviScore: number;
  moisture: number;
  polygon?: [number, number][];
}

const DEFAULT_HOME_FIELDS: FieldItem[] = [
  {
    id: '1793109118563',
    name: 'Üzüm Bağı',
    location: 'Manisa / Yunusemre',
    area: '63.7 Dönüm',
    status: 'Sağlıklı',
    lat: 38.7377604815913,
    lng: 27.434862654640995,
    crop: 'Üzüm',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.7377604815913, 27.434862654640995],
      [38.7389915490909, 27.43727966132707],
      [38.74011468692338, 27.43641143758065],
      [38.740909681568176, 27.435487820011026],
      [38.74005918493525, 27.433410330488574]
    ]
  },
  {
    id: '1793109250136',
    name: 'Kayısı Tarlası',
    location: 'Malatya / Battalgazi',
    area: '16.8 Dönüm',
    status: 'Sağlıklı',
    lat: 38.44961407555695,
    lng: 38.35766552927494,
    crop: 'Kayısı',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.44961407555695, 38.35766552927494],
      [38.44907632348891, 38.35582903387487],
      [38.44825288286856, 38.35592569152751],
      [38.448673006808086, 38.35785884458023]
    ]
  },
  {
    id: '1793109326110',
    name: 'Buğday Tarlası',
    location: 'Kayseri / Develi',
    area: '55.5 Dönüm',
    status: 'Sağlıklı',
    lat: 38.36509719705687,
    lng: 35.453427189205456,
    crop: 'Buğday',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.36509719705687, 35.453427189205456],
      [38.36664502101616, 35.45328757259611],
      [38.366599861712785, 35.44994129644126],
      [38.36505203678775, 35.44936135052545]
    ]
  }
];

// MainScreen'den gelen özellikleri (props) tanımlıyoruz
export interface HomeTabProps {
  selectedField?: any;
  fields?: FieldItem[];
  selectedFieldId?: string;
  onSelectField?: (id: string) => void;
  onOpenDetail?: (page: string) => void;
  onSwitchToAi?: () => void;
  onSwitchToProfile?: () => void;
  onSwitchToFields?: () => void;
  onDeleteField?: (id: string) => void;
}

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
};

// Gerçek Şehir / İlçe İsmi Çeken Fonksiyon
const getReverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          'Accept-Language': 'tr',
        },
      }
    );
    const geoJson = await geoRes.json();
    if (geoJson && geoJson.address) {
      const city =
        geoJson.address.province ||
        geoJson.address.state ||
        geoJson.address.city ||
        geoJson.address.region ||
        '';
      const district =
        geoJson.address.town ||
        geoJson.address.district ||
        geoJson.address.county ||
        geoJson.address.suburb ||
        geoJson.address.village ||
        '';

      if (city && district) return `${city} / ${district}`;
      if (city) return city;
      if (district) return district;
      if (geoJson.display_name) return geoJson.display_name.split(',')[0];
    }
  } catch (err) {
    console.error('Geocoding hatası:', err);
  }
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
};

export const HomeTab: React.FC<HomeTabProps> = ({
  fields: propFields,
  selectedFieldId: propSelectedFieldId,
  onSelectField,
  onOpenDetail,
  onSwitchToFields,
  onDeleteField,
}) => {
  const [fields, setFields] = useState<FieldItem[]>(() => {
    if (propFields && propFields.length > 0) return propFields;
    try {
      const saved = localStorage.getItem('terramind_user_fields');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { }
    return DEFAULT_HOME_FIELDS;
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    propSelectedFieldId || fields[0]?.id || '1793109118563'
  );

  // Harita & Durum State'leri
  const [activeTab, setActiveTab] = useState<'RGB' | 'NDVI' | 'NEM'>('NDVI');
  const [center, setCenter] = useState<[number, number]>(() => {
    const initField = fields.find(f => f.id === (propSelectedFieldId || fields[0]?.id)) || fields[0];
    return initField ? [initField.lat, initField.lng] : [38.7378, 27.4349];
  });
  const [locationName, setLocationName] = useState<string>('Konum sorgulanıyor...');
  const [weatherData, setWeatherData] = useState({ temp: 22, wind: 10, humidity: 40, isLoading: false });
  const [effectiveState, setEffectiveState] = useState<any>(null);

  // Sync propFields if updated by parent
  useEffect(() => {
    if (propFields !== undefined) {
      setFields(propFields);
    }
  }, [propFields]);

  // If selected field is deleted or changed, auto-select first available
  useEffect(() => {
    if (fields.length > 0 && !fields.some((f) => f.id === selectedFieldId)) {
      const nextField = fields[0];
      setSelectedFieldId(nextField.id);
      setCenter([nextField.lat, nextField.lng]);
      updateLocationAndWeather(nextField.lat, nextField.lng);
      if (onSelectField) onSelectField(nextField.id);
    }
  }, [fields, selectedFieldId, onSelectField]);

  // Sync propSelectedFieldId if updated by parent
  useEffect(() => {
    if (propSelectedFieldId && propSelectedFieldId !== selectedFieldId) {
      setSelectedFieldId(propSelectedFieldId);
      const target = fields.find((f) => f.id === propSelectedFieldId);
      if (target) {
        setCenter([target.lat, target.lng]);
        updateLocationAndWeather(target.lat, target.lng);
      }
    }
  }, [propSelectedFieldId, fields]);

  // Sayfa İlk Açıldığında
  useEffect(() => {
    const current = fields.find((f) => f.id === selectedFieldId) || fields[0];
    if (current) {
      setCenter([current.lat, current.lng]);
      updateLocationAndWeather(current.lat, current.lng);
    }

    // Socket.io dinleyicileri
    socket.on('state:effective', (data) => {
      setEffectiveState(data);
    });

    socket.on('farm:changed', (farm) => {
      if (farm && farm.lat && farm.lng) {
        setCenter([farm.lat, farm.lng]);
        updateLocationAndWeather(farm.lat, farm.lng);
      }
    });

    return () => {
      socket.off('state:effective');
      socket.off('farm:changed');
    };
  }, []);

  // Konum İsmi ve Hava Durumunu Güncelleyen Fonksiyon
  const updateLocationAndWeather = async (lat: number, lng: number): Promise<string> => {
    setWeatherData((prev) => ({ ...prev, isLoading: true }));

    // 1. Gerçek Şehir/İlçe İsmini Çek
    const realLocation = await getReverseGeocode(lat, lng);
    setLocationName(realLocation);

    // 2. Canlı Hava Durumunu Çek
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const weatherJson = await weatherRes.json();
      if (weatherJson.current_weather) {
        setWeatherData({
          temp: weatherJson.current_weather.temperature,
          wind: weatherJson.current_weather.windspeed,
          humidity: Math.floor(30 + Math.random() * 30),
          isLoading: false,
        });
      }
    } catch {
      setWeatherData((prev) => ({ ...prev, isLoading: false }));
    }

    return realLocation;
  };

  // Seçilen Tarla Değiştiğinde
  const handleSelectField = async (id: string) => {
    setSelectedFieldId(id);
    if (onSelectField) onSelectField(id);
    const target = fields.find((f) => f.id === id);
    if (target) {
      setCenter([target.lat, target.lng]);
      await updateLocationAndWeather(target.lat, target.lng);
    }
    // Backend senkronizasyonu
    fetch('http://localhost:3001/api/admin/select-farm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmId: id })
    }).catch(() => { });
  };

  // Cihazın Canlı GPS Konumunu Alma
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter([lat, lng]);
        await updateLocationAndWeather(lat, lng);
      },
      () => {
        alert('Cihaz konumunuza erişilemedi. Lütfen konum izinlerini açın.');
      }
    );
  };

  const generatePolygon = (lat: number, lng: number): [number, number][] => [
    [lat + 0.0018, lng - 0.0022],
    [lat + 0.0020, lng + 0.0025],
    [lat - 0.0016, lng + 0.0020],
    [lat - 0.0018, lng - 0.0018],
  ];

  const currentField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  const getPolygonStyle = () => {
    switch (activeTab) {
      case 'NDVI':
        return { color: '#16a34a', fillColor: '#15803d', fillOpacity: 0.6 };
      case 'NEM':
        return { color: '#2563eb', fillColor: '#1d4ed8', fillOpacity: 0.6 };
      case 'RGB':
      default:
        return { color: '#d97706', fillColor: '#ca8a04', fillOpacity: 0.4 };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30 text-slate-800 pb-28">
      {/* 1. HEADER & NAVBAR: Orijinal Ana Logo (h-9 / 36px) ve Hızlı Tarla Seçici */}
      <header className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-20 shadow-sm gap-3">
        {/* Sol: Orijinal Logo ve Marka Metni (Tıklandığında Anasayfaya / Dashboard'a yönlendirir) */}
        <div
          onClick={() => {
            if (fields.length > 0) handleSelectField(fields[0].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-90 select-none group"
          title="Ana Sayfaya / Tarlaya Odaklan"
        >
          <div className="h-9 w-9 flex items-center justify-center shrink-0">
            <TerraMindLogo size={36} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                TerraMind
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                ÇİFTÇİ
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 leading-none">
              Akıllı Tarım ve Canlı Uydu Portalı
            </p>
          </div>
        </div>

        {/* Sağ: Hızlı Tarla Değiştirici & Konum Butonu */}
        <div className="flex items-center gap-2">
          {/* Hızlı Tarla Seçici Dropdown */}
          <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl px-2.5 py-1.5 shadow-xs">
            <span className="text-emerald-700 text-xs">📍</span>
            <select
              value={selectedFieldId}
              onChange={(e) => handleSelectField(e.target.value)}
              className="bg-transparent text-xs font-bold text-emerald-950 focus:outline-none cursor-pointer pr-1"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.crop})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGetCurrentLocation}
            type="button"
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-emerald-200/80 shadow-sm shrink-0"
            title="Mevcut GPS Konumumu Bul"
          >
            🎯 Konum
          </button>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* CANLI HAVA DURUMU KARTLARI */}
        <section className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 p-5 rounded-3xl border border-emerald-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              🌤️ Canlı İklim & Çevre Analizi
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Konum: {locationName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center gap-3 relative">
              {effectiveState?.temperature !== undefined && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
                ☀️
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Sıcaklık</p>
                <p className="text-lg font-bold text-slate-800">
                  {weatherData.isLoading && !effectiveState ? 'Yükleniyor...' : `${effectiveState?.temperature ?? weatherData.temp} °C`}
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/60 shadow-sm flex items-center gap-3 relative">
              {effectiveState?.soilMoisture !== undefined && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                💧
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Toprak Nemi</p>
                <p className="text-lg font-bold text-slate-800">%{effectiveState?.soilMoisture ?? weatherData.humidity}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-teal-200/60 shadow-sm flex items-center gap-3 relative">
              {effectiveState?.weather?.windSpeed !== undefined && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                💨
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Rüzgar Hızı</p>
                <p className="text-lg font-bold text-slate-800">
                  {weatherData.isLoading && !effectiveState ? 'Yükleniyor...' : `${effectiveState?.weather?.windSpeed ?? weatherData.wind} km/h`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CANLI UYDU HARİTASI */}
        <section className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between p-4 md:p-5 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">{currentField?.name || 'Seçili Tarla'}</h2>
                {currentField && onDeleteField && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`"${currentField.name}" tarlasını kayıtlardan silmek istediğinize emin misiniz?`)) {
                        onDeleteField(currentField.id);
                      }
                    }}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/90 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    title="Bu Tarlayı Sil"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline text-[11px]">Sil</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentField?.crop || 'Genel'} &bull; {locationName} ({center[0].toFixed(4)}, {center[1].toFixed(4)})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {fields.length > 0 && (
                <select
                  value={selectedFieldId}
                  onChange={(e) => handleSelectField(e.target.value)}
                  className="bg-emerald-50 text-xs font-bold text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop})
                    </option>
                  ))}
                </select>
              )}

              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['RGB', 'NDVI', 'NEM'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: '420px', width: '100%', zIndex: 1 }}>
            {center && (
              <MapContainer center={center} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <RecenterMap center={center} />
                <TileLayer
                  attribution='&copy; Esri World Imagery'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <Polygon positions={currentField?.polygon || generatePolygon(center[0], center[1])} pathOptions={getPolygonStyle()}>
                  <Popup>
                    <div className="text-slate-900 p-1 min-w-[140px]">
                      <h3 className="font-bold text-sm border-b pb-1 mb-1">{currentField?.name || 'Seçili Tarla'}</h3>
                      <p className="text-xs text-slate-600">Konum: <b>{locationName}</b></p>
                      <p className="text-xs text-slate-600">Ürün: <b>{currentField?.crop || 'Genel'}</b></p>
                    </div>
                  </Popup>
                </Polygon>
              </MapContainer>
            )}

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-md z-[400] flex items-center gap-2 font-semibold">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getPolygonStyle().color }} />
              <span>Görünüm Modu: <b>{activeTab}</b></span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomeTab;