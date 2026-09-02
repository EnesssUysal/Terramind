import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Map, Leaf, AlertTriangle, CloudRain } from 'lucide-react';

// Kayseri / Talas Bölgesi Örnek Tarla Koordinatları
const FIELD_CENTER = [38.6805, 35.5471];

// Tarlayı 3 parsele bölen koordinatlar (Yeşil: Sağlıklı, Sarı: Stres, Kırmızı: Kurak)
const healthyZone = [[38.681, 35.546], [38.681, 35.548], [38.680, 35.548], [38.680, 35.546]];
const stressZone = [[38.680, 35.546], [38.680, 35.548], [38.679, 35.548], [38.679, 35.546]];
const droughtZone = [[38.679, 35.546], [38.679, 35.548], [38.678, 35.548], [38.678, 35.546]];

// Recharts için 7 günlük NDVI Trend Verisi
const ndviTrendData = [
  { day: 'Pzt', ndvi: 0.72 }, { day: 'Sal', ndvi: 0.70 }, { day: 'Çar', ndvi: 0.68 },
  { day: 'Per', ndvi: 0.65 }, { day: 'Cum', ndvi: 0.62 }, { day: 'Cmt', ndvi: 0.58 },
  { day: 'Paz', ndvi: 0.55 } // Düşüş trendi (Kuraklık başlıyor)
];

export default function NdviMapModule() {
  return (
    <div className="bg-slate-50 p-4 md:p-8 min-h-screen font-sans">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center">
            <Map className="mr-3 text-emerald-600" size={28} />
            Uydu Destekli NDVI İzleme
          </h1>
          <p className="text-slate-500 font-medium mt-1">Kayseri / Talas — Sentinel-2 Uydu Verisi</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold animate-pulse">
          Canlı Bağlantı
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOL: LEAFLET UYDU HARİTASI */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-slate-700">Spektral Bitki Sağlığı Haritası</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Çözünürlük: 10m/Piksel</span>
          </div>
          
          <div className="h-[400px] w-full rounded-2xl overflow-hidden z-0 border border-slate-100">
            <MapContainer center={FIELD_CENTER} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              
              <Polygon positions={healthyZone} pathOptions={{ fillColor: '#22c55e', color: '#16a34a', weight: 2, fillOpacity: 0.5 }}>
                <LeafletTooltip>Kuzey Parsel: Sağlıklı (NDVI: 0.75)</LeafletTooltip>
              </Polygon>

              <Polygon positions={stressZone} pathOptions={{ fillColor: '#eab308', color: '#ca8a04', weight: 2, fillOpacity: 0.5 }}>
                <LeafletTooltip>Orta Parsel: Su Stresi (NDVI: 0.45)</LeafletTooltip>
              </Polygon>

              <Polygon positions={droughtZone} pathOptions={{ fillColor: '#ef4444', color: '#dc2626', weight: 2, fillOpacity: 0.6 }}>
                <LeafletTooltip>Güney Parsel: Kritik Kuraklık (NDVI: 0.20)</LeafletTooltip>
              </Polygon>
            </MapContainer>
          </div>

          {/* Harita Lejantı */}
          <div className="flex space-x-4 mt-4 px-2">
            <div className="flex items-center text-sm font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Sağlıklı</div>
            <div className="flex items-center text-sm font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>Stres</div>
            <div className="flex items-center text-sm font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>Kuraklık</div>
          </div>
        </div>

        {/* SAĞ: RECHARTS GRAFİĞİ VE AI ANALİZİ */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4">7 Günlük NDVI Trendi</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ndviTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis domain={[0, 1]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: "#22c55e", strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-100 flex-1 flex flex-col justify-center">
            <div className="flex items-center text-red-600 mb-2">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="font-black text-lg">AI Erken Uyarı</h3>
            </div>
            <p className="text-red-800 font-medium text-sm leading-relaxed mb-4">
              Güney parselde spektral analiz son 3 günde keskin bir düşüş saptadı. Kök çürümesi veya su stresi başlangıcı.
            </p>
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center">
              <CloudRain size={18} className="mr-2" /> Otonom Sulamayı Başlat
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}