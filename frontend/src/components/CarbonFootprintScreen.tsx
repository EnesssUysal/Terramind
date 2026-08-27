import React, { useState } from 'react';
import { ArrowLeft, Leaf, Tractor, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { mockCarbonFootprint } from '../mockData';

interface CarbonFootprintScreenProps {
  onBack: () => void;
}

export default function CarbonFootprintScreen({ onBack }: CarbonFootprintScreenProps) {
  const [tractorHours, setTractorHours] = useState(12);
  const data = mockCarbonFootprint;

  const estimatedEmission = (tractorHours * data.tractorEmissionFactor).toFixed(2);
  const savingPercent = Math.round(
    ((data.regionAveragePerHa - data.farmAverageTonPerHa) / data.regionAveragePerHa) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="flex min-h-screen flex-col bg-[#F4FAF5]"
    >
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F4FAF5]/80 px-4 py-4 backdrop-blur-md">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="ml-4">
            <h1 className="text-lg font-bold text-[#1B331B]">Karbon Ayak İzi</h1>
            <p className="text-xs text-[#597360]">COP31 Sürdürülebilirlik Vizyonu</p>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B331B] text-[#A5D6A7]">
          <Globe2 className="h-5 w-5" />
        </div>
      </header>

      <main className="flex-1 px-6 pb-12 space-y-6">
        {/* Hero özet kart */}
        <div className="rounded-[24px] bg-[#1B331B] p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4CAF50]/20 mb-4">
              <Leaf className="h-6 w-6 text-[#A5D6A7]" />
            </div>
            <p className="text-sm font-medium text-[#A5D6A7] mb-1">Bölge Ortalamasına Göre</p>
            <h2 className="text-4xl font-bold text-white mb-2">%{savingPercent} Daha Az</h2>
            <p className="text-sm text-[#D2E6D7] leading-relaxed">
              Hektar başına {data.farmAverageTonPerHa} ton CO₂ salınımı — bölge ortalaması {data.regionAveragePerHa} ton.
            </p>
          </div>
        </div>

        {/* Traktör saati simülatörü */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <label className="flex items-center gap-2 text-sm font-bold text-[#1B331B] mb-4">
            <Tractor className="h-4 w-4 text-[#2196F3]" />
            Bu Haftaki Traktör Kullanım Süresi
          </label>
          <input
            type="range"
            min="0"
            max="40"
            value={tractorHours}
            onChange={(e) => setTractorHours(Number(e.target.value))}
            className="w-full accent-[#4CAF50]"
          />
          <div className="flex justify-between text-xs text-[#8EA694] mt-1 mb-4">
            <span>0 saat</span>
            <span className="text-[#1B331B] font-bold">{tractorHours} saat</span>
            <span>40 saat</span>
          </div>
          <div className="rounded-[16px] bg-[#F4FAF5] p-4 flex items-center justify-between">
            <span className="text-sm text-[#597360]">Tahmini emisyon</span>
            <span className="text-lg font-bold text-[#E65100]">{estimatedEmission} ton CO₂</span>
          </div>
        </div>

        {/* Trend grafiği */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="font-bold text-[#1B331B] mb-4">Çiftlik vs Bölge Ortalaması</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1EA" />
              <XAxis dataKey="month" stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} unit="t" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8F1EA', borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="farm" stroke="#4CAF50" strokeWidth={2.5} dot={false} name="Çiftliğiniz" />
              <Line type="monotone" dataKey="region" stroke="#F44336" strokeWidth={2.5} dot={false} name="Bölge Ort." />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight */}
        <div className="rounded-[24px] bg-[#E8F1EA] p-5">
          <h3 className="font-bold text-[#1B331B] mb-2">Yapay Zekâ Sürdürülebilirlik Özeti</h3>
          <p className="text-sm text-[#597360] leading-relaxed">
            Akıllı sulama ve traktör kullanım optimizasyonu sayesinde bölge ortalamasının %{savingPercent} altında
            emisyon üretiyorsunuz. Bu tempoda devam ederseniz COP31 sürdürülebilir tarım hedeflerine katkınız
            yıllık bazda ölçülebilir hale gelecek.
          </p>
        </div>
      </main>
    </motion.div>
  );
}
