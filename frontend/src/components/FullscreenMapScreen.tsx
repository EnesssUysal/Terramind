import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Satellite, Activity, AlertTriangle, RefreshCw, Layers, MapPin, CheckCircle2 } from 'lucide-react';
import { mockFields } from '../mockData';

interface FullscreenMapScreenProps {
  onBack: () => void;
  selectedFieldId: string;
}

// Haritayı seçili tarlaya odaklayan görünmez bileşen
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { duration: 2 });
  }, [center, map]);
  return null;
}

export default function FullscreenMapScreen({ onBack, selectedFieldId }: FullscreenMapScreenProps) {
  const [activeField, setActiveField] = useState(mockFields.find(f => f.id === selectedFieldId) || mockFields[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('10 dk önce');

  // NDVI değerine göre renk hesaplama algoritması
  const getNdviColor = (ndvi: number) => {
    if (ndvi >= 0.7) return { color: '#22c55e', fill: '#4ade80', status: 'Sağlıklı', icon: <CheckCircle2 className="text-emerald-500" /> };
    if (ndvi >= 0.4) return { color: '#eab308', fill: '#fde047', status: 'Orta Stres', icon: <Activity className="text-yellow-500" /> };
    return { color: '#ef4444', fill: '#f87171', status: 'Kuraklık / Kritik', icon: <AlertTriangle className="text-red-500" /> };
  };

  // Malatya, Kayseri ve Manisa için gerçekçi parsel poligonları
  const fieldPolygons: Record<string, [number, number][]> = {
    '1': [
      [38.4210, 38.3695],
      [38.4230, 38.3725],
      [38.4215, 38.3745],
      [38.4195, 38.3710]
    ], // Malatya (Battalgazi)
    '2': [
      [38.3930, 35.4850],
      [38.3955, 35.4930],
      [38.3885, 35.4950],
      [38.3860, 35.4870]
    ], // Kayseri (Develi)
    '3': [
      [38.3525, 28.5065],
      [38.3550, 28.5140],
      [38.3490, 28.5160],
      [38.3465, 28.5085]
    ], // Manisa (Alaşehir)
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastUpdate('Şimdi güncellendi');
    }, 2500);
  };

  const activeColorProfile = getNdviColor(activeField.ndvi);
  const centerPosition: [number, number] = activeField.lat && activeField.lng
    ? [activeField.lat, activeField.lng]
    : (fieldPolygons[activeField.id] ? fieldPolygons[activeField.id][0] : [38.4200, 38.3700]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans flex flex-col">

      {/* ÜST BAR (Z-Index ile haritanın üstünde) */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex justify-between items-start pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/20 hover:bg-white transition-all"
        >
          <ArrowLeft size={24} className="text-slate-800" />
        </button>

        <div className="pointer-events-auto flex gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-lg flex items-center">
            <Layers size={18} className="text-emerald-400 mr-2" />
            <span className="text-white text-xs font-bold tracking-wider uppercase">Katman: NDVI İndeksi</span>
          </div>
          <button
            onClick={handleScan}
            className="bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/50 shadow-lg flex items-center transition-all"
          >
            <RefreshCw size={18} className={`text-white mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="text-white text-xs font-bold">Uydu Senkronizasyonu</span>
          </button>
        </div>
      </div>

      {/* YAPAY ZEKA VE UYDU KONTROL PANELİ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-11/12 max-w-4xl pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 flex flex-col md:flex-row gap-6 items-center">

          <div className="flex-1 w-full border-r border-slate-200 pr-6">
            <div className="flex items-center gap-2 mb-2">
              <Satellite size={20} className="text-blue-600" />
              <h3 className="font-black text-slate-800 text-lg">Agromonitoring API Sentinel-2</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-4">
              Kızılötesi ve görünür ışık bantları kullanılarak klorofil yoğunluğu hesaplanmıştır. Son veri çekimi: <strong className="text-slate-700">{lastUpdate}</strong>.
            </p>

            {/* Hızlı Tarla Seçici */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {mockFields.map(field => (
                <button
                  key={field.id}
                  onClick={() => setActiveField(field)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${activeField.id === field.id
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                >
                  {field.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center md:items-start min-w-[200px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{activeField.name} Analizi</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl font-black tabular-nums tracking-tighter" style={{ color: activeColorProfile.color }}>
                {activeField.ndvi.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-500 mb-1.5">NDVI</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {activeColorProfile.icon}
              <span className="text-xs font-bold text-slate-700">{activeColorProfile.status}</span>
            </div>
          </div>

        </div>
      </div>

      {/* LEAFLET HARİTA KATMAMNI */}
      <div className="flex-1 w-full relative z-0">
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-emerald-900/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-full h-1 bg-emerald-500/50 absolute top-1/2 shadow-[0_0_20px_#10b981] animate-scan"></div>
          </div>
        )}

        <MapContainer
          center={centerPosition}
          zoom={15}
          zoomControl={false}
          className="w-full h-full"
        >
          <MapController center={centerPosition} />

          {/* Gerçek Uydu Görüntüsü (Esri World Imagery) */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri, Maxar, Earthstar Geographics"
            maxZoom={19}
          />

          {/* Tarlaların NDVI Çokgenleri (Polygons) */}
          {mockFields.map(field => {
            const isSelected = field.id === activeField.id;
            const profile = getNdviColor(field.ndvi);
            const coordinates = fieldPolygons[field.id] || fieldPolygons['1'];

            return (
              <Polygon
                key={field.id}
                positions={coordinates}
                pathOptions={{
                  color: profile.color,
                  fillColor: profile.fill,
                  fillOpacity: isSelected ? 0.6 : 0.3,
                  weight: isSelected ? 3 : 1,
                  dashArray: isSelected ? '' : '5, 5'
                }}
                eventHandlers={{
                  click: () => setActiveField(field),
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50vh); }
          100% { transform: translateY(50vh); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}