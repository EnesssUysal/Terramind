import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Save, MapPin, Undo, X, CheckCircle2, AlertCircle, Layers, FileText, PlusCircle, Crosshair } from 'lucide-react';
import { area } from '@turf/area';
import { polygon as turfPolygon } from '@turf/helpers';
import { FieldItem } from './FieldsTab';

interface AddFieldScreenProps {
  onBack: () => void;
  onSave: (field: FieldItem) => void;
}

// Harita Hata Yakalayıcı (BEYAZ EKRAN ÇÖKMESİNİ KESİNLİKLE ENGELLER)
class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error('Harita yükleme hatası:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white min-h-[300px]">
          <AlertCircle size={36} className="text-amber-400 mb-2" />
          <p className="text-sm font-bold text-white mb-1">Harita Bileşeni Yüklenemedi</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">
            Form alanlarını doldurarak tarlanızı doğrudan kaydedebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white cursor-pointer transition-colors"
          >
            Haritayı Yeniden Dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Harita tıklamalarını yakalayan yardımcı bileşen
function MapInteractions({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (e && e.latlng) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Harita boyutunu yeniden hesaplayan ve odaklayan bileşen
function MapResizer({ mobileTab, center }: { mobileTab: string; center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    try {
      map.invalidateSize();
    } catch {}

    const t1 = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {}
    }, 150);

    const t2 = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {}
    }, 450);

    const handleWindowResize = () => {
      try {
        map.invalidateSize();
      } catch {}
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [map, mobileTab]);

  useEffect(() => {
    if (!map) return;
    try {
      map.setView(center, 16);
    } catch {}
  }, [center, map]);

  return null;
}

export default function AddFieldScreen({ onBack, onSave }: AddFieldScreenProps) {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [areaInput, setAreaInput] = useState('25');
  const [location, setLocation] = useState('Malatya / Battalgazi');
  const [isSaved, setIsSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Mobilde görünüm sekmesi: 'form' veya 'map'
  const [mobileTab, setMobileTab] = useState<'form' | 'map'>('form');

  // Harita Uydu Katmanı Seçimi
  const [tileLayerType, setTileLayerType] = useState<'esri' | 'google' | 'osm'>('esri');

  // Harita merkez koordinatı (Varsayılan: Malatya Battalgazi Orduzu)
  const [mapCenter, setMapCenter] = useState<[number, number]>([38.4050, 38.3850]);

  // Alan hesaplama (Turf.js)
  const calculatedArea = useMemo(() => {
    if (!points || points.length < 3) return { sqMeters: 0, decares: 0 };
    
    try {
      const turfPoints = [...points.map(p => [p[1], p[0]]), [points[0][1], points[0][0]]];
      const poly = turfPolygon([turfPoints]);
      const sqMeters = area(poly);
      const decares = sqMeters / 1000;
      return { sqMeters, decares };
    } catch (e) {
      console.warn('Alan hesaplama hatası:', e);
      return { sqMeters: 0, decares: 0 };
    }
  }, [points]);

  // Haritada çizim yapıldığında dönüm alanını otomatik güncelle
  useEffect(() => {
    if (calculatedArea.decares > 0) {
      setAreaInput(calculatedArea.decares.toFixed(1));
    }
  }, [calculatedArea.decares]);

  // Cihazın canlı GPS konumunu alma
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Cihazınızda konum servisi bulunamadı.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter([lat, lng]);
        setMobileTab('map');
      },
      () => {
        alert('Konum alınamadı. Lütfen tarayıcınızın konum izinlerini kontrol ediniz.');
      }
    );
  };

  // Hızlı Bölge Seçici
  const handleSelectPresetRegion = (regionName: string, lat: number, lng: number) => {
    setLocation(regionName);
    setMapCenter([lat, lng]);
    setMobileTab('map');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPoints((prev) => [...prev, [lat, lng]]);
    if (formError) setFormError(null);
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (points.length > 0 && window.confirm('Tüm sınır çizimini temizlemek istediğinize emin misiniz?')) {
      setPoints([]);
    }
  };

  // Form doğrulama: Tarla adı ve ürün girildiğinde buton aktiftir
  const isFormValid = name.trim().length > 0 && crop.trim().length > 0;

  const handleSave = () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Lütfen tarla adını giriniz.');
      setMobileTab('form');
      return;
    }
    if (!crop.trim()) {
      setFormError('Lütfen ekilen ürün bilgisini giriniz.');
      setMobileTab('form');
      return;
    }

    const parsedArea = parseFloat(areaInput) || (calculatedArea.decares > 0 ? calculatedArea.decares : 25);
    const lat = mapCenter[0] || 38.4050;
    const lng = mapCenter[1] || 38.3850;

    // Eğer kullanıcı haritadan 3 nokta çizmemişse, merkeze göre otomatik temsilî 4 nokta oluştur
    const finalPolygon: [number, number][] = points.length >= 3 ? points : [
      [lat - 0.002, lng - 0.002],
      [lat - 0.002, lng + 0.002],
      [lat + 0.002, lng + 0.002],
      [lat + 0.002, lng - 0.002],
    ];

    const newField: FieldItem = {
      id: Date.now().toString(),
      name: name.trim(),
      crop: crop.trim(),
      location: location.trim() || 'Malatya / Battalgazi',
      area: `${parsedArea.toFixed(1)} Dönüm`,
      status: 'Sağlıklı',
      lat: finalPolygon[0][0],
      lng: finalPolygon[0][1],
      ndviScore: 0.84,
      moisture: 42,
      polygon: finalPolygon,
    };

    setIsSaved(true);
    setTimeout(() => {
      onSave(newField);
    }, 1000);
  };

  if (isSaved) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F4FAF5] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 size={52} className="text-emerald-600 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-[#1B331B] mb-2">Tarla Başarıyla Eklendi!</h2>
        <p className="text-slate-600 font-medium max-w-sm">
          <strong>{name}</strong> kaydedildi. Sensörler ve yapay zeka tarlayı izlemeye başladı.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 h-screen h-[100dvh] max-h-[100dvh] overflow-hidden">
      
      {/* 1. SABİT ÜST BAR (HEADER) */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
            aria-label="Geri Dön"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Yeni Tarla Ekle</h1>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {points.length >= 3 
                ? `Harita Sınırı: ${calculatedArea.decares.toFixed(1)} Dönüm` 
                : 'Bilgileri doldurup kaydedebilirsiniz'}
            </p>
          </div>
        </div>

        {/* Mobilde Form / Harita Geçiş Sekmeleri */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'form' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={14} /> Form
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'map' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} /> Harita {points.length > 0 && `(${points.length})`}
          </button>
        </div>
      </header>

      {/* Hata Bildirimi (Varsa) */}
      {formError && (
        <div className="bg-red-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between shrink-0 animate-in slide-in-from-top-2 duration-200 z-30">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{formError}</span>
          </div>
          <button onClick={() => setFormError(null)} className="p-1 hover:bg-red-600 rounded cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. ANA ALAN: SCROLL EDİLEBİLİR FORM VE HARİTA BÖLGESİ */}
      <main className="flex-1 overflow-hidden relative flex flex-col lg:flex-row min-h-0">
        
        {/* FORM BÖLGESİ */}
        <div 
          className={`overflow-y-auto overscroll-contain bg-slate-50 transition-all duration-300 ${
            mobileTab === 'form' 
              ? 'flex-1 p-4 pb-44' 
              : 'hidden lg:block lg:w-5/12 lg:h-full lg:overflow-y-auto p-5 pb-44 border-r border-slate-200'
          }`}
        >
          <div className="max-w-md mx-auto space-y-5">
            
            {/* Alan Özeti & Hızlı Bilgilendirme */}
            <div className="bg-gradient-to-br from-[#1B331B] to-[#2D5A27] rounded-3xl p-5 text-white shadow-lg shadow-emerald-950/10 border border-emerald-600/30">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Tarla Parsel Büyüklüğü
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">{areaInput || '0'}</span>
                    <span className="text-lg font-semibold text-emerald-200">Dönüm (Dekar)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('map')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-200 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <MapPin size={14} />
                  <span>{points.length >= 3 ? 'Sınırı Düzenle' : 'Haritada Çiz'}</span>
                </button>
              </div>

              <p className="text-xs text-emerald-100/80 font-medium mt-2">
                {points.length >= 3 
                  ? `Uydu haritasından ${points.length} köşe noktasıyla hassas hesaplandı.`
                  : 'İster dönüm miktarını doğrudan yazın, isterseniz haritaya dokunarak sınırları belirleyin.'}
              </p>
            </div>

            {/* Hızlı Konum ve Bölge Seçici */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={15} className="text-emerald-600" />
                  Hızlı Bölge Odaklan
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="GPS Konumumu Bul"
                >
                  <Crosshair size={13} />
                  <span>GPS Konumum</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Malatya / Battalgazi', lat: 38.4050, lng: 38.3850 },
                  { name: 'Kayseri / Develi', lat: 38.3900, lng: 35.4900 },
                  { name: 'Manisa / Alaşehir', lat: 38.3500, lng: 28.5100 },
                  { name: 'Şanlıurfa / Harran', lat: 36.8600, lng: 39.0200 },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetRegion(preset.name, preset.lat, preset.lng)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      location.includes(preset.name.split(' / ')[0])
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM GİRİŞ ALANLARI */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="text-emerald-600" size={18} />
                Tarla Kayıt Formu
              </h2>

              {/* 1. Tarla Adı */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tarla Adı <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (formError) setFormError(null); }}
                  placeholder="Örn: Kuzey Buğday Tarlası"
                  className="w-full min-h-[50px] px-4 py-3 text-base rounded-2xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-900 font-medium"
                />
              </div>

              {/* 2. Ekilen Ürün */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ekilen Ürün Türü <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={crop}
                  onChange={(e) => { setCrop(e.target.value); if (formError) setFormError(null); }}
                  placeholder="Örn: Kayısı, Buğday, Ayçiçeği, Mısır"
                  className="w-full min-h-[50px] px-4 py-3 text-base rounded-2xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-900 font-medium"
                />
              </div>

              {/* 3. Alan / Dönüm Girişi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Tarla Alanı (Dönüm) <span className="text-red-500">*</span></span>
                  {calculatedArea.decares > 0 && (
                    <span className="text-emerald-600 font-semibold lowercase">
                      (haritadan: {calculatedArea.decares.toFixed(1)} dönüm)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="Örn: 42.5"
                    className="w-full min-h-[50px] px-4 py-3 text-base rounded-2xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-900 pr-20 font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Dönüm
                  </span>
                </div>
              </div>

              {/* 4. Bölge / İlçe */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bölge / İlçe (Opsiyonel)
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Örn: Malatya / Battalgazi"
                  className="w-full min-h-[50px] px-4 py-3 text-base rounded-2xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-900 font-medium"
                />
              </div>

              {/* FORM İÇİ BİRİNCİL KAYDET BUTONU */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className={`w-full min-h-[54px] py-3.5 px-6 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isFormValid 
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-emerald-600/30 cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <PlusCircle size={20} />
                  <span>Tarlayı Sisteme Ekle</span>
                </button>
                {!isFormValid && (
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
                    Kaydetmek için tarla adı ve ürün türünü doldurunuz.
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* HARİTA BÖLGESİ */}
        <div 
          className={`flex-1 relative bg-slate-950 transition-all duration-300 min-h-0 ${
            mobileTab === 'map' ? 'flex flex-col h-full w-full' : 'hidden lg:flex lg:flex-col lg:w-7/12 lg:h-full'
          }`}
        >
          {/* Harita Üstü Hızlı Bilgi ve Araç Çubuğu */}
          <div className="absolute top-3 left-3 right-3 z-[1000] flex justify-between items-start pointer-events-none gap-2">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg pointer-events-auto border border-slate-200/80 max-w-[280px]">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <MapPin size={16} className="text-emerald-600 shrink-0" />
                <span>Haritaya Dokunarak Köşe Belirleyin</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                {points.length === 0 && 'Tarlanızın ilk köşesine tıklayın.'}
                {points.length === 1 && 'İkinci köşeye tıklayın.'}
                {points.length === 2 && 'Üçüncü köşeyi seçerek alanı kapatın.'}
                {points.length >= 3 && `${points.length} köşe seçildi. Dönüm otomatik güncellendi.`}
              </p>
            </div>

            {/* Sağ Üst: Katman Değiştirici ve Çizim Araçları */}
            <div className="flex flex-col items-end gap-2 pointer-events-auto">
              <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-md flex items-center text-[11px] font-bold text-white">
                <button
                  type="button"
                  onClick={() => setTileLayerType('esri')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    tileLayerType === 'esri' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Esri Yüksek Çözünürlüklü Uydu"
                >
                  🛰️ Esri
                </button>
                <button
                  type="button"
                  onClick={() => setTileLayerType('google')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    tileLayerType === 'google' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Google Hibrit Uydu"
                >
                  🌍 Hibrit
                </button>
                <button
                  type="button"
                  onClick={() => setTileLayerType('osm')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    tileLayerType === 'osm' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Yol ve Harita Görünümü"
                >
                  🗺️ Harita
                </button>
              </div>

              {/* Geri Al & Temizle Butonları */}
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleUndo}
                  disabled={points.length === 0}
                  className="w-10 h-10 bg-white text-slate-700 rounded-xl shadow-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                  title="Son Noktayı Geri Al"
                >
                  <Undo size={18} />
                </button>
                <button 
                  type="button"
                  onClick={handleClear}
                  disabled={points.length === 0}
                  className="w-10 h-10 bg-white text-rose-600 rounded-xl shadow-lg hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                  title="Çizimi Temizle"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Harita Üzerinde Canlı Alan Rozeti */}
          <div className="absolute bottom-24 lg:bottom-24 left-3 z-[1000] pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Harita Alanı</p>
                <p className="text-base font-black text-white">
                  {calculatedArea.decares > 0 ? `${calculatedArea.decares.toFixed(2)} Dönüm` : 'Çizim bekleniyor'}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-full relative flex-1 min-h-[300px]">
            <MapErrorBoundary>
              <MapContainer 
                center={mapCenter} 
                zoom={16} 
                className="w-full h-full"
                style={{ height: '100%', width: '100%', minHeight: '300px', zIndex: 0 }}
                zoomControl={true}
                scrollWheelZoom={true}
              >
                <MapResizer mobileTab={mobileTab} center={mapCenter} />
                
                {/* Dinamik Uydu ve Altlık Katmanı */}
                {tileLayerType === 'esri' && (
                  <TileLayer
                    attribution='&copy; ESRI World Imagery, Maxar, Earthstar Geographics'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                )}
                {tileLayerType === 'google' && (
                  <TileLayer
                    attribution='&copy; Google Satellite & Hybrid'
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={20}
                  />
                )}
                {tileLayerType === 'osm' && (
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                )}

                <MapInteractions onClick={handleMapClick} />
                
                {points.length > 0 && (
                  <Polygon 
                    positions={points} 
                    pathOptions={{ 
                      color: '#10b981',
                      fillColor: '#34d399',
                      fillOpacity: 0.45,
                      weight: 3.5,
                      dashArray: points.length < 3 ? '6, 6' : undefined
                    }} 
                  />
                )}
                
                {points.map((p, i) => (
                  <CircleMarker 
                    key={`point-${i}-${p[0]}-${p[1]}`} 
                    center={p} 
                    radius={8}
                    pathOptions={{
                      color: '#ffffff',
                      fillColor: '#059669',
                      fillOpacity: 1,
                      weight: 2.5
                    }}
                  />
                ))}
              </MapContainer>
            </MapErrorBoundary>
          </div>
        </div>

      </main>

      {/* 3. SABİT ALT AKSİYON PANELİ (STICKY BOTTOM BAR) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-safe">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Vazgeç Butonu */}
          <button
            type="button"
            onClick={onBack}
            className="min-h-[50px] px-5 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-98 font-bold text-slate-700 text-sm sm:text-base transition-all shrink-0 cursor-pointer"
          >
            Vazgeç
          </button>

          {/* Özet Bilgi (Dönüm / Tarla Adı) */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{name ? name : 'Yeni Tarla'}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-extrabold">{areaInput || 0} Dönüm</span>
          </div>

          {/* BİRİNCİL "TARLAYI KAYDET / EKLE" BUTONU */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isFormValid}
            className={`min-h-[50px] flex-1 sm:flex-initial sm:min-w-[220px] px-6 py-3 rounded-2xl font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 ${
              isFormValid 
                ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-emerald-600/30 cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Save size={19} />
            <span>Tarlayı Ekle / Kaydet</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
