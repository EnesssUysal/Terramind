import React from 'react';
import { Field } from '../types';
import { BarChart2, TrendingUp, Calendar, Filter, Droplets, CloudRain, TrendingDown, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { mockWaterSavingEvents } from '../mockData';

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

export default function AnalysisTab({ selectedField }: AnalysisTabProps) {
  const fieldEvents = mockWaterSavingEvents.filter(e => e.field === selectedField.name);
  const totalSaved = fieldEvents.reduce((sum, e) => sum + e.savedLiters, 0);

  return (
    <div className="flex-1 px-6 pt-6 pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm font-medium text-[#597360]">{selectedField.name}</p>
          <h2 className="text-2xl font-bold text-[#1B331B]">Detaylı Analiz</h2>
        </div>
        <button className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1B331B] shadow-sm">
          <Filter className="h-4 w-4" />
          <span>Filtrele</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* AI Su Tasarruf Motoru */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
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

        {/* Toprak Nemi Geçmişi — gerçek grafik */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1B331B]">Toprak Nemi Geçmişi</h3>
            <div className="flex items-center space-x-1 text-sm text-[#8EA694]">
              <Calendar className="h-4 w-4" />
              <span>Son 7 Gün</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selectedField.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1EA" />
              <XAxis dataKey="day" stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8EA694" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8F1EA', borderRadius: 12 }} />
              <Line type="monotone" dataKey="moisture" stroke="#2196F3" strokeWidth={2.5} dot={false} name="Nem %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NDVI Trend — gerçek grafik */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
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
