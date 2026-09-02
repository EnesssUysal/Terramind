import React, { useState } from 'react';
import { ArrowLeft, Leaf, Tractor, Globe2, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { mockCarbonFootprint } from '../mockData';
import CarbonMrvLedger from './CarbonMrvLedger';
import GrantMatcher from './GrantMatcher';

interface CarbonFootprintScreenProps {
  onBack: () => void;
}

export default function CarbonFootprintScreen({ onBack }: CarbonFootprintScreenProps) {
  const [tractorHours, setTractorHours] = useState(12);
  const data = mockCarbonFootprint;

  // Haftalık traktör kullanım hedefi (çiftlik için makul bir referans değer).
  const WEEKLY_TRACTOR_TARGET_HOURS = 15;
  // Dizel yanma emisyon faktörü — yaygın kabul gören referans (~2.68 kg CO2 / litre).
  const DIESEL_CO2_KG_PER_LITER = 2.68;
  // Motorin fiyatı — Ağustos 2026 Türkiye ortalaması referans alınmıştır, güncel fiyata göre değişir.
  const DIESEL_PRICE_TRY_PER_LITER = 78;

  const estimatedEmission = (tractorHours * data.tractorEmissionFactor).toFixed(2);
  const estimatedDieselLiters = Math.round((Number(estimatedEmission) * 1000) / DIESEL_CO2_KG_PER_LITER);
  const estimatedFuelCostTRY = Math.round(estimatedDieselLiters * DIESEL_PRICE_TRY_PER_LITER);
  const withinTarget = tractorHours <= WEEKLY_TRACTOR_TARGET_HOURS;
  const formatTRY = (n: number) => n.toLocaleString('tr-TR');

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
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4CAF50]/20">
                <Leaf className="h-6 w-6 text-[#A5D6A7]" />
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#4CAF50]/20 px-3 py-1.5 text-xs font-bold text-[#A5D6A7]">
                <BadgeCheck className="h-3.5 w-3.5" /> COP31 Hedefine Uygun
              </span>
            </div>
            <p className="text-sm font-medium text-[#A5D6A7] mb-1">Bölge Ortalamasına Göre</p>
            <h2 className="text-4xl font-bold text-white mb-2">%{savingPercent} Daha Az</h2>
            <p className="text-sm text-[#D2E6D7] leading-relaxed mb-5">
              Hektar başına {data.farmAverageTonPerHa} ton CO₂ salınımı — bölge ortalaması {data.regionAveragePerHa} ton.
            </p>

            {/* Görsel karşılaştırma çubukları */}
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-[#D2E6D7] mb-1">
                  <span>Çiftliğiniz</span>
                  <span className="font-bold text-white">{data.farmAverageTonPerHa}t</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4CAF50]"
                    style={{ width: `${(data.farmAverageTonPerHa / data.regionAveragePerHa) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#D2E6D7] mb-1">
                  <span>Bölge Ortalaması</span>
                  <span className="font-bold text-white">{data.regionAveragePerHa}t</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-white/40" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traktör saati & yakıt bütçesi */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E3F2FD]">
                <Tractor className="h-4 w-4 text-[#2196F3]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1B331B]">Bu Haftaki Traktör Kullanımı</h3>
                <p className="text-xs text-[#8EA694]">Haftalık hedef: {WEEKLY_TRACTOR_TARGET_HOURS} saat</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                withinTarget ? 'bg-[#E8F1EA] text-[#4CAF50]' : 'bg-[#FFF3E0] text-[#F57C00]'
              }`}
            >
              {withinTarget ? 'Hedefin Altında ✓' : 'Hedef Aşıldı'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="40"
            value={tractorHours}
            onChange={(e) => setTractorHours(Number(e.target.value))}
            className="w-full accent-[#4CAF50]"
          />
          <div className="relative text-xs text-[#8EA694] mt-1 mb-4">
            <span className="absolute left-0">0 saat</span>
            <span
              className="absolute -translate-x-1/2 text-[#1B331B] font-semibold"
              style={{ left: `${(WEEKLY_TRACTOR_TARGET_HOURS / 40) * 100}%` }}
            >
              Hedef: {WEEKLY_TRACTOR_TARGET_HOURS}s
            </span>
            <span className="absolute right-0">40 saat</span>
            <div className="h-4" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-[#F4FAF5] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8EA694] mb-1">Tahmini Emisyon</p>
              <p className="text-xl font-black text-[#E65100] tabular-nums">{estimatedEmission} ton CO₂</p>
            </div>
            <div className="rounded-[16px] bg-[#F4FAF5] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8EA694] mb-1">Tahmini Yakıt Maliyeti</p>
              <p className="text-xl font-black text-[#1B331B] tabular-nums">{formatTRY(estimatedFuelCostTRY)} TL</p>
              <p className="text-[10px] text-[#8EA694] mt-0.5">~{estimatedDieselLiters} L motorin</p>
            </div>
          </div>
          <p className="text-[10px] text-[#8EA694] mt-2">
            Motorin fiyatı ~{DIESEL_PRICE_TRY_PER_LITER} TL/L (Ağustos 2026 ortalaması) referans alınmıştır, güncel fiyatlar değişebilir.
          </p>
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

        {/* YENİ: Doğrulanabilir Karbon Kaydı (MRV Defteri) */}
        <CarbonMrvLedger />

        {/* YENİ: Sürdürülebilir Tarım Hibe/Teşvik Eşleştirici */}
        <GrantMatcher />

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