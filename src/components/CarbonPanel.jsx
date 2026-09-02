import React, { useState } from 'react';
import { Leaf, Tractor, Wind, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Grafik için sahte (mock) karşılaştırma verisi
const emissionData = [
  { ay: 'Nisan', Sen: 120, Bolge: 150 },
  { ay: 'Mayıs', Sen: 140, Bolge: 170 },
  { ay: 'Haziran', Sen: 110, Bolge: 160 },
  { ay: 'Temmuz', Sen: 90, Bolge: 180 },
];

export default function CarbonPanel() {
  const [tractorHours, setTractorHours] = useState(10);
  
  // Arka plan matematiği: 1 saat traktör ortalama 5 litre yakar, 1 litre = 2.6 kg CO2
  const userEmission = Math.round(tractorHours * 5 * 2.6);
  const regionAverage = 240; 
  const savingPercent = Math.round(((regionAverage - userEmission) / regionAverage) * 100);

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-slate-50 min-h-screen">
      
      {/* Üst Başlık Vizyonu */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
            <Leaf className="text-emerald-500 mr-3" size={32} />
            COP31 Sürdürülebilirlik Paneli
          </h1>
          <p className="text-slate-500 mt-2">Kayseri / Talas Bölgesi Karbon Ayak İzi Analizi</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold border border-emerald-200">
          Karbon Nötr Hedefi: 2030
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Metrik 1: Jüri Etkileme Kartı */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <TrendingDown size={100} className="text-emerald-500" />
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Bölgesel Karşılaştırma</h3>
          <div className="text-4xl font-black text-emerald-600 mb-2">% {savingPercent}</div>
          <p className="text-slate-700 font-semibold text-lg">Bölge ortalamasından daha çevrecisin!</p>
          <p className="text-sm text-slate-400 mt-2">Yapay zeka su ve enerji optimizasyonu sayesinde.</p>
        </div>

        {/* Metrik 2: Emisyon Girdisi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Haftalık Traktör/Motor Kullanımı</h3>
            <Tractor className="text-slate-400" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <input 
              type="range" 
              min="0" max="40" 
              value={tractorHours} 
              onChange={(e) => setTractorHours(e.target.value)}
              className="w-full accent-emerald-500"
            />
            <span className="text-xl font-bold text-slate-700 w-16">{tractorHours} Saat</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
            <span className="text-sm font-medium text-slate-600">Hesaplanan Emisyon:</span>
            <span className="text-lg font-bold text-red-500">{userEmission} kg CO2</span>
          </div>
        </div>

        {/* Metrik 3: Doğa Etkisi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Önlenen Karbon Salınımı</h3>
            <Wind className="text-blue-400" />
          </div>
          <div className="text-4xl font-black text-slate-800 mb-2">{regionAverage - userEmission} <span className="text-xl text-slate-500">kg</span></div>
          <p className="text-sm text-slate-500">
            Bu tasarruf, <strong className="text-emerald-600">{(regionAverage - userEmission) / 10} yetişkin ağacın</strong> 1 yılda temizlediği havaya eşdeğerdir.
          </p>
        </div>
      </div>

      {/* Recharts ile Karşılaştırmalı Grafik */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Aylık Karbon Emisyon Trendi (kg CO2)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={emissionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="ay" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
            <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
            <Bar dataKey="Sen" name="Senin Tarlan" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
            <Bar dataKey="Bolge" name="Bölge Ortalaması" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}