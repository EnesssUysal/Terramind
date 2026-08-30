import React, { useMemo, useState } from 'react';
import { Field } from '../types';
import { TrendingUp, Calendar, Filter, Droplets, CloudRain, TrendingDown, AlertTriangle, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { mockWaterSavingEvents } from '../mockData';
import SmartAiControl from './SmartAiControl';
import AiExplainability from './AiExplainability';
import AiForecastTimeline from './AiForecastTimeline';
import ImpactTranslator from './ImpactTranslator';

interface AnalysisTabProps {
  selectedField: Field;
}

const eventIcon = {
  saving: CloudRain,
  irrigation: Droplets,
  alert: AlertTriangle,
};

const eventIconStyle = {
  saving: 'bg-[#4CAF50]/10 text-[#4CAF50]',
  irrigation: 'bg-[#2196F3]/10 text-[#2196F3]',
  alert: 'bg-[#F44336]/10 text-[#F44336]',
};

// Kriz simülasyonu adımları
type SimStage = 'idle' | 'crisis' | 'solved';

const CRITICAL_MOISTURE = 15;
const CRITICAL_THRESHOLD = 20;

export default function AnalysisTab({ selectedField }: AnalysisTabProps) {
  const [simStage, setSimStage] = useState<SimStage>('idle');
  const isCrisis = simStage === 'crisis' || simStage === 'solved';
  const isSolved = simStage === 'solved';

  const fieldEvents = mockWaterSavingEvents.filter(e => e.field === selectedField.name);
  const totalSaved = fieldEvents.reduce((sum, e) => sum + e.savedLiters, 0);

  // Kriz tetiklendiğinde grafiğin son noktasını kritik seviyeye çeker
  const chartHistory = useMemo(() => {
    if (!isCrisis) return selectedField.history;
    return selectedField.history.map((h, i) =>
      i === selectedField.history.length - 1 ? { ...h, moisture: CRITICAL_MOISTURE } : h
    );
  }, [isCrisis, selectedField.history]);

  const currentMoisture = isCrisis
    ? CRITICAL_MOISTURE
    : selectedField.history[selectedField.history.length - 1]?.moisture ?? selectedField.sensors.moisture.value;

  const runSimulation = () => {
    if (simStage !== 'idle') return; 
    setSimStage('crisis');
    setTimeout(() => setSimStage('solved'), 1600);
  };

  const resetSimulation = () => setSimStage('idle');

  return (
    <div className="flex-1 px-6 pt-6 pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm font-medium text-[#597360]">{selectedField.name}</p>
          <h2 className="text-2xl font-bold text-[#1B331B]">Detaylı Analiz</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Jüri sunumu için gizli kriz tetikleyici */}
          <button
            onClick={simStage === 'idle' ? runSimulation : resetSimulation}
            title={simStage === 'idle' ? 'Simüle Et' : 'Sıfırla'}
            className="flex items-center space-x-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-medium text-[#8EA694] shadow-sm opacity-70 hover:opacity-100 hover:text-[#1B331B] transition-opacity"
          >
            {simStage === 'idle' ? <Zap className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
          </button>
          <button className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1B331B] shadow-sm">
            <Filter className="h-4 w-4" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* TerraMind DSS — Karar Destek ve Sulama Motoru */}
        <SmartAiControl />

        {/* AI Neden Bu Kararı Verdi? */}
        <AiExplainability selectedField={selectedField} />

        {/* AI Su Tasarruf Motoru */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E3F2FD]">
                <Droplets className="h-4 w-4 text-[#2196F3]" />
              </div>
              <h3 className="font-bold text-[#1B331B]">AI Su Tasarruf Motoru</h3>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[#E8F1EA] px-3 py-1.5 text-sm font-bold text-[#4CAF50]">
              <TrendingDown className="h-4 w-4" />
              {totalSaved} L
            </div>
          </div>
          <p className="text-xs text-[#8EA694] mb-4">Bu tarlada son 48 saatte tasarruf edilen su</p>

          <div className="space-y-3">
            {fieldEvents.length === 0 && (
              <p className="text-sm text-[#8EA694] py-4 text-center">Bu tarla için henüz kayıtlı olay yok.</p>
            )}
            {fieldEvents.map((event) => {
              const Icon = eventIcon[event.type];
              return (
                <div key={event.id} className="flex items-start gap-3 rounded-[16px] bg-[#F4FAF5] p-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${eventIconStyle[event.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B331B]">{event.title}</p>
                    <p className="text-xs text-[#597360] leading-relaxed">{event.detail}</p>
                    <p className="text-[10px] text-[#8EA694] mt-1">{event.time}</p>
                  </div>
                  {event.savedLiters > 0 && (
                    <span className="shrink-0 text-sm font-bold text-[#4CAF50]">{event.savedLiters} L</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Toprak Nemi Geçmişi (Simülasyonlu) */}
        <div className={`rounded-[24px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-2 transition-colors duration-500 ${isCrisis ? 'bg-red-50 border-red-400' : 'bg-white border-transparent'}`}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-[#1B331B]">Toprak Nemi Geçmişi</h3>
            <div className="flex items-center space-x-1 text-sm text-[#8EA694]">
              <Calendar className="h-4 w-4" />
              <span>Son 7 Gün</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-3xl font-black tabular-nums ${isCrisis ? 'text-red-600' : 'text-[#2196F3]'}`}>
              %{currentMoisture}
            </span>
            <span className="text-xs text-[#8EA694]">güncel nem</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1EA" />
              <XAxis dataKey="day" stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8F1EA', borderRadius: 12 }} />
              <ReferenceLine y={CRITICAL_THRESHOLD} stroke="#F44336" strokeDasharray="4 4" label={{ value: 'Kritik Eşik', fontSize: 10, fill: '#F44336', position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="moisture" stroke={isCrisis ? '#F44336' : '#2196F3'} strokeWidth={2.5} dot={false} name="Nem %" isAnimationActive animationDuration={700} />
            </LineChart>
          </ResponsiveContainer>

          {/* Kırmızı Alarm Durumu */}
          {isCrisis && (
            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-red-400 bg-red-100/70 p-3 animate-pulse">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Kritik Kuraklık Tespit Edildi</p>
                <p className="text-xs text-red-600">Toprak nemi güvenli aralığın altına düştü (%{CRITICAL_THRESHOLD} eşik).</p>
              </div>
            </div>
          )}

          {/* AI Müdahalesi (Wow Efekti) */}
          {isSolved && (
            <div className="mt-3 relative overflow-hidden rounded-[16px] border border-emerald-400 bg-[#0F2A1B] px-4 py-3 shadow-lg shadow-emerald-500/40">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-[#0F2A1B] to-[#0F2A1B]" />
              <div className="relative flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-emerald-500/20 shrink-0">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-400">AI Su Tasarruf Motoru Devrede</p>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    18 saat sonra yağmur bekleniyor, AI sulamayı otomatik iptal etti. <span className="text-emerald-300 font-bold">420L su tasarrufu</span> sağlandı.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI 7 Günlük Plan */}
        <AiForecastTimeline />

        {/* NDVI Trend (Uydu Verisi) */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1B331B]">NDVI (Bitki Sağlığı) Trendi</h3>
            <div className="flex items-center space-x-1 text-sm text-[#8EA694]">
              <TrendingUp className="h-4 w-4" />
              <span>Uydu Verisi</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selectedField.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1EA" />
              <XAxis dataKey="day" stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8F1EA', borderRadius: 12 }} />
              <Line type="monotone" dataKey="ndvi" stroke="#4CAF50" strokeWidth={2.5} dot={false} name="NDVI" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Karbon ve Etki Çevirici */}
        <ImpactTranslator totalSavedLiters={totalSaved} />

        {/* AI Insight */}
        <div className="rounded-[24px] bg-[#E8F1EA] p-5">
          <h3 className="font-bold text-[#1B331B] mb-2">Yapay Zekâ Özeti</h3>
          <p className="text-sm text-[#597360] leading-relaxed">
            {selectedField.aiSummary} Güncel NDVI değeri {selectedField.ndvi.toFixed(2)} —
            {selectedField.ndvi >= 0.7 ? ' bitki örtüsü sağlıklı seviyede.' : selectedField.ndvi >= 0.4 ? ' orta düzey stres belirtisi gösteriyor, takip önerilir.' : ' kritik seviyede, acil müdahale gerekebilir.'}
          </p>
        </div>
      </div>
    </div>
  );
}