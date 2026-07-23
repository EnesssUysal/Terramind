import React, { useState } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Info, Activity, AlertCircle, Droplets, ThermometerSun, Sprout, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { mockFields } from '../mockData';

interface SensorDetailScreenProps {
  onBack: () => void;
  selectedFieldId: string;
  sensorType: 'moisture' | 'temperature' | 'nitrogen' | 'ph';
}

export default function SensorDetailScreen({ onBack, selectedFieldId, sensorType }: SensorDetailScreenProps) {
  const [timeRange, setTimeRange] = useState<'Günlük' | 'Haftalık' | 'Aylık'>('Günlük');
  const field = mockFields.find(f => f.id === selectedFieldId) || mockFields[0];
  const sensorData = field.sensors[sensorType];

  const details = {
    moisture: { title: 'Toprak Nemi', icon: Droplets, color: '#1976D2', bg: '#E3F2FD', unit: '%', min: 20, max: 60, avg: 40 },
    temperature: { title: 'Sıcaklık', icon: ThermometerSun, color: '#F57C00', bg: '#FFF3E0', unit: '°C', min: 10, max: 40, avg: 25 },
    nitrogen: { title: 'Azot (N)', icon: Sprout, color: '#388E3C', bg: '#E8F5E9', unit: 'ppm', min: 50, max: 200, avg: 120 },
    ph: { title: 'Toprak pH', icon: Zap, color: '#7B1FA2', bg: '#F3E5F5', unit: '', min: 5.5, max: 8.5, avg: 6.5 },
  }[sensorType];

  const Icon = details.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="flex min-h-screen flex-col bg-[#F4FAF5]"
    >
      <header className="sticky top-0 z-50 flex items-center bg-[#F4FAF5]/80 px-4 py-4 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="ml-4">
          <h1 className="text-lg font-bold text-[#1B331B]">{details.title} Detayı</h1>
          <p className="text-xs text-[#597360]">{field.name}</p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12 space-y-6">
        {/* Main Metric Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E8F1EA] flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: details.bg, color: details.color }}>
            <Icon className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium text-[#597360] mb-1">Mevcut Değer</p>
          <div className="flex items-baseline justify-center gap-1">
            <h2 className="text-5xl font-bold text-[#1B331B]">{sensorData.value}</h2>
            <span className="text-xl font-bold text-[#8EA694]">{details.unit}</span>
          </div>
          <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
            sensorData.status === 'up' ? 'bg-[#E8F5E9] text-[#4CAF50]' : 
            sensorData.status === 'down' ? 'bg-[#FFEBEE] text-[#F44336]' : 'bg-[#F4FAF5] text-[#8EA694]'
          }`}>
            <TrendingUp className={`h-4 w-4 ${sensorData.status === 'down' ? 'rotate-180' : ''}`} />
            <span>{Math.abs(sensorData.change)}{details.unit}</span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2 bg-[#E8F1EA] p-1 rounded-full">
          {['Günlük', 'Haftalık', 'Aylık'].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t as any)}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${
                timeRange === t ? 'bg-white text-[#1B331B] shadow-sm' : 'text-[#597360] hover:text-[#1B331B]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm border border-[#E8F1EA]">
            <p className="text-[11px] font-medium text-[#8EA694] mb-1">Minimum</p>
            <p className="font-bold text-[#1B331B]">{details.min}{details.unit}</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm border border-[#E8F1EA]">
            <p className="text-[11px] font-medium text-[#8EA694] mb-1">Ortalama</p>
            <p className="font-bold text-[#1B331B]">{details.avg}{details.unit}</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm border border-[#E8F1EA]">
            <p className="text-[11px] font-medium text-[#8EA694] mb-1">Maksimum</p>
            <p className="font-bold text-[#1B331B]">{details.max}{details.unit}</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E8F1EA]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1B331B]">Trend Grafiği</h3>
            <Activity className="h-5 w-5 text-[#8EA694]" />
          </div>
          <div className="h-48 w-full rounded-[12px] bg-[#F4FAF5] flex items-center justify-center border border-dashed border-[#D2E6D7]">
            <div className="text-center text-[#8EA694]">
              <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Grafik Verisi Yükleniyor...</p>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-[#1B331B] text-white rounded-[24px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[#4CAF50] opacity-20 blur-2xl"></div>
          <div className="flex gap-4 relative z-10">
            <div className="bg-[#2D5A27] h-12 w-12 rounded-full flex items-center justify-center shrink-0">
              <Info className="h-6 w-6 text-[#A5D6A7]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Yapay Zeka Analizi</h3>
              <p className="text-sm text-[#D2E6D7] leading-relaxed mb-4">
                {sensorType === 'moisture' && "Nem oranında son 3 günde %5'lik bir düşüş eğilimi var. Kök gelişimini desteklemek için sulama süresini uzatmanızı öneririm."}
                {sensorType === 'temperature' && "Sıcaklıklar bitki gelişimi için ideal aralıkta seyrediyor. Gece saatlerinde oluşabilecek ani düşüşlere karşı sera perdelerini aktif edebilirsiniz."}
                {sensorType === 'nitrogen' && "Azot seviyesi hedef aralığın %10 altında. Yaklaşan yağmurlardan önce granül gübre uygulaması verimi artıracaktır."}
                {sensorType === 'ph' && "pH seviyesi oldukça stabil. Toprağın besin alım kapasitesi şu anda maksimum seviyede."}
              </p>
              <button className="bg-white text-[#1B331B] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#E8F1EA] transition-colors">
                Öneriyi Uygula
              </button>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
