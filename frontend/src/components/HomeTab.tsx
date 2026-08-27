import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

export const HomeTab: React.FC = () => {
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');

  // Form State'leri (Varsayılan Ankara Koordinatları)
  const [inputLat, setInputLat] = useState<string>('39.9208');
  const [inputLng, setInputLng] = useState<string>('32.8541');
  const [fieldName, setFieldName] = useState<string>('');
  const [cropType, setCropType] = useState<string>('Buğday');

  // Harita & Durum State'leri
  const [activeTab, setActiveTab] = useState<'RGB' | 'NDVI' | 'NEM'>('NDVI');
  const [center, setCenter] = useState<[number, number]>([39.9208, 32.8541]);
  const [locationName, setLocationName] = useState<string>('Konum sorgulanıyor...');
  const [weatherData, setWeatherData] = useState({ temp: 22, wind: 10, humidity: 40, isLoading: false });

  // Sayfa Açıldığında Kayıtlı Tarlayı Getir
  useEffect(() => {
    const saved = localStorage.getItem('terramind_user_fields');
    if (saved) {
      const parsed: FieldItem[] = JSON.parse(saved);
      if (parsed.length > 0) {
        setFields(parsed);
        setSelectedFieldId(parsed[0].id);
        setCenter([parsed[0].lat, parsed[0].lng]);
        setInputLat(parsed[0].lat.toString());
        setInputLng(parsed[0].lng.toString());
        updateLocationAndWeather(parsed[0].lat, parsed[0].lng);
        return;
      }
    }
    updateLocationAndWeather(39.9208, 32.8541);
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
    const target = fields.find((f) => f.id === id);
    if (target) {
      setCenter([target.lat, target.lng]);
      setInputLat(target.lat.toString());
      setInputLng(target.lng.toString());
      await updateLocationAndWeather(target.lat, target.lng);
    }
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
        setInputLat(lat.toFixed(4));
        setInputLng(lng.toFixed(4));
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

  // Yeni Tarla Kaydetme
  const handleSearchAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Lütfen geçerli enlem ve boylam girin.');
      return;
    }

    setCenter([lat, lng]);
    // Çekilen gerçek konumu doğrudan değişkene alıyoruz
    const fetchedLocation = await updateLocationAndWeather(lat, lng);

    const newField: FieldItem = {
      id: Date.now().toString(),
      name: fieldName || `${cropType} Tarlası`,
      location: fetchedLocation, // Gerçek il/ilçe buraya yazılıyor
      area: `${(Math.random() * 30 + 15).toFixed(1)} Dönüm`,
      status: 'Sağlıklı',
      lat,
      lng,
      crop: cropType || 'Buğday',
      ndviScore: Number((0.65 + Math.random() * 0.25).toFixed(2)),
      moisture: Math.floor(30 + Math.random() * 20),
    };

    const updated = [newField, ...fields];
    setFields(updated);
    setSelectedFieldId(newField.id);
    localStorage.setItem('terramind_user_fields', JSON.stringify(updated));
    setFieldName('');
  };

  const currentField = fields.find((f) => f.id === selectedFieldId);

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
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 text-lg">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">TerraMind</h1>
            <p className="text-xs text-emerald-700 font-semibold">Akıllı Tarım ve Canlı Uydu Portalı</p>
          </div>
        </div>

        <button
          onClick={handleGetCurrentLocation}
          type="button"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-emerald-200/80 shadow-sm"
        >
          🎯 Mevcut Konumumu Bul
        </button>
      </header>

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* KOORDİNAT VE TARLA EKLEME FORMU */}
        <section className="bg-white p-5 md:p-6 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            📍 Yeni Tarla Ekle & Konum Sorgula
          </h2>
          <form onSubmit={handleSearchAndSave} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Enlem (Latitude)</label>
              <input
                type="text"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                placeholder="Örn: 38.4237"
                className="w-full bg-slate-50 text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Boylam (Longitude)</label>
              <input
                type="text"
                value={inputLng}
                onChange={(e) => setInputLng(e.target.value)}
                placeholder="Örn: 27.1428"
                className="w-full bg-slate-50 text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tarla Adı</label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="Örn: Yonca Tarlası"
                className="w-full bg-slate-50 text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ekili Ürün</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="Örn: Buğday, Mısır"
                className="w-full bg-slate-50 text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                + Tarlayı Kaydet
              </button>
            </div>
          </form>
        </section>

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
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
                ☀️
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Sıcaklık</p>
                <p className="text-lg font-bold text-slate-800">
                  {weatherData.isLoading ? 'Yükleniyor...' : `${weatherData.temp} °C`}
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/60 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                💧
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Toprak Nemi</p>
                <p className="text-lg font-bold text-slate-800">%{weatherData.humidity}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-teal-200/60 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                💨
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Rüzgar Hızı</p>
                <p className="text-lg font-bold text-slate-800">
                  {weatherData.isLoading ? 'Yükleniyor...' : `${weatherData.wind} km/h`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CANLI UYDU HARİTASI */}
        <section className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between p-4 md:p-5 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentField?.name || 'Seçili Tarla'}</h2>
              <p className="text-xs text-slate-500 font-medium">
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
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab
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
                <Polygon positions={generatePolygon(center[0], center[1])} pathOptions={getPolygonStyle()}>
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