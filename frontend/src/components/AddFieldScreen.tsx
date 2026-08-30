import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker, useMap } from 'react-leaflet';
import { ArrowLeft, Save, MapPin, Undo, X, Info, CheckCircle2 } from 'lucide-react';
import { area } from '@turf/area';
import { polygon as turfPolygon } from '@turf/helpers';
import { FieldItem } from './FieldsTab';

interface AddFieldScreenProps {
  onBack: () => void;
  onSave: (field: FieldItem) => void;
}

// Component to handle map clicks and interactions
function MapInteractions({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
}

export default function AddFieldScreen({ onBack, onSave }: AddFieldScreenProps) {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Türkiye merkezi varsayılan konum (Kayseri/Develi civarı)
  const [mapCenter, setMapCenter] = useState<[number, number]>([38.6520, 35.6230]);
  const [inputLat, setInputLat] = useState('38.6520');
  const [inputLng, setInputLng] = useState('35.6230');

  const handleCenterMap = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMapCenter([lat, lng]);
    } else {
      alert("Lütfen geçerli enlem ve boylam girin.");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPoints((prev) => [...prev, [lat, lng]]);
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (points.length > 0 && window.confirm('Tüm çizimi temizlemek istediğinize emin misiniz?')) {
      setPoints([]);
    }
  };

  // Alan hesaplama (Turf.js)
  const calculatedArea = useMemo(() => {
    if (points.length < 3) return { sqMeters: 0, decares: 0 };
    
    // Turf polygon'u kapatmak için ilk noktayı sona ekler. GeoJSON formatı [lng, lat] şeklindedir.
    const turfPoints = [...points.map(p => [p[1], p[0]]), [points[0][1], points[0][0]]];
    
    try {
      const poly = turfPolygon([turfPoints]);
      const sqMeters = area(poly);
      const decares = sqMeters / 1000; // 1 dönüm = 1000m2 (yaklaşık dekar)
      return { sqMeters, decares };
    } catch (e) {
      console.error('Alan hesaplama hatası:', e);
      return { sqMeters: 0, decares: 0 };
    }
  }, [points]);

  const handleSave = () => {
    if (!name.trim()) return alert('Lütfen tarla adını giriniz.');
    if (!crop.trim()) return alert('Lütfen yetiştirilen ürünü giriniz.');
    if (points.length < 3) return alert('Lütfen haritaya tıklayarak en az 3 nokta işaretleyip tarlanın sınırlarını çizin.');

    const newField: FieldItem = {
      id: Date.now().toString(),
      name: name.trim(),
      crop: crop.trim(),
      location: location.trim() || 'Otomatik Konum',
      area: `${calculatedArea.decares.toFixed(1)} Dönüm`,
      status: 'Sağlıklı',
      lat: points[0][0], // Referans olarak ilk noktanın koordinatı
      lng: points[0][1],
      ndviScore: 0.85, 
      moisture: 45,
      polygon: points,
    };

    setIsSaved(true);
    setTimeout(() => {
      onSave(newField);
    }, 1500); // Başarı mesajını 1.5 sn gösterip kaydet
  };

  if (isSaved) {
    return (
      <div className="min-h-screen bg-[#F4FAF5] flex flex-col items-center justify-center p-6 text-center z-50 fixed inset-0">
        <CheckCircle2 size={80} className="text-[#4CAF50] mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-[#1B331B] mb-2">Tarla Başarıyla Eklendi</h2>
        <p className="text-[#597360] font-medium">Tarlalarım sayfasına yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="text-slate-700" size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Yeni Tarla Ekle</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 gap-6">
        
        {/* Form Alanı (Sol panel - masaüstü) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5 order-2 lg:order-1">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info className="text-emerald-500" size={20} />
              Tarla Bilgileri
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tarla Adı</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Kuzey Tarlası"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Ekilen Ürün</label>
                <input 
                  type="text" 
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="Örn: Buğday, Mısır"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bölge/İlçe (Opsiyonel)</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Örn: Kayseri / Develi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Enlem</label>
                  <input 
                    type="text" 
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    placeholder="38.6520"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Boylam</label>
                  <input 
                    type="text" 
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    placeholder="35.6230"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleCenterMap}
                className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition-colors text-sm"
              >
                Haritada Odaklan
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
            <h3 className="font-bold text-emerald-50 mb-1 opacity-90">Hassas Alanlama Sonucu</h3>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-black">{calculatedArea.decares.toFixed(2)}</span>
              <span className="text-lg font-medium opacity-90 mb-1">Dönüm</span>
            </div>
            <div className="text-emerald-100 text-sm mt-1 font-medium">
              ≈ {calculatedArea.sqMeters.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} metrekare
            </div>
            
            {points.length < 3 && (
              <div className="mt-4 bg-black/10 rounded-xl p-3 text-sm text-emerald-50 font-medium">
                👉 Alan hesaplamak için haritada tarlanızın köşelerine tıklayın.
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="w-full mt-auto mb-6 lg:mb-0 bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Tarlayı Kaydet
          </button>
        </div>

        {/* Harita Alanı (Sağ panel - masaüstü) */}
        <div className="w-full lg:w-2/3 h-[50vh] lg:h-auto min-h-[400px] flex flex-col order-1 lg:order-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          
          {/* Map Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg pointer-events-auto border border-slate-200/50 max-w-[200px]">
              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-500" />
                Sınır Çizimi
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                Tarlanın köşelerini belirlemek için haritaya dokunun.
              </p>
            </div>

            <div className="flex flex-col gap-2 pointer-events-auto">
              <button 
                onClick={handleUndo}
                disabled={points.length === 0}
                className="bg-white text-slate-700 p-2.5 rounded-xl shadow-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Geri Al"
              >
                <Undo size={18} />
              </button>
              <button 
                onClick={handleClear}
                disabled={points.length === 0}
                className="bg-white text-rose-500 p-2.5 rounded-xl shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Tümünü Temizle"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <MapContainer 
            center={mapCenter} 
            zoom={12} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <RecenterMap center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <MapInteractions onClick={handleMapClick} />
            
            {points.length > 0 && (
              <Polygon 
                positions={points} 
                pathOptions={{ 
                  color: '#10b981', // emerald-500
                  fillColor: '#34d399', // emerald-400
                  fillOpacity: 0.4,
                  weight: 3
                }} 
              />
            )}
            
            {/* Sadece son noktaya veya tek noktaya işaretçi koy */}
            {points.length > 0 && points.length < 3 && (
              points.map((p, i) => (
                <Marker key={i} position={p} />
              ))
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
