import React from 'react';
import { ArrowLeft, Droplets, Calendar, Play, Settings, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { mockFields } from '../mockData';

interface IrrigationScreenProps {
  onBack: () => void;
  selectedFieldId: string;
}

export default function IrrigationScreen({ onBack, selectedFieldId }: IrrigationScreenProps) {
  const field = mockFields.find(f => f.id === selectedFieldId) || mockFields[0];
  const irrigation = field.irrigation;

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
            <h1 className="text-lg font-bold text-[#1B331B]">Sulama Kontrolü</h1>
            <p className="text-xs text-[#597360]">{field.name}</p>
          </div>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-12 space-y-6">
        {/* Status Card */}
        <div className={`rounded-[24px] p-6 shadow-md border ${irrigation.current === 'Açık' ? 'bg-[#E3F2FD] border-[#BBDEFB]' : 'bg-white border-[#E8F1EA]'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${irrigation.current === 'Açık' ? 'bg-[#2196F3] text-white' : 'bg-[#F4FAF5] text-[#1976D2]'}`}>
              <Droplets className="h-7 w-7" />
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${irrigation.current === 'Açık' ? 'bg-[#2196F3] text-white' : 'bg-[#E8F1EA] text-[#597360]'}`}>
              {irrigation.current === 'Açık' ? <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span> : null}
              {irrigation.current === 'Açık' ? 'Aktif' : 'Beklemede'}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1B331B] mb-2">{irrigation.current === 'Açık' ? 'Sistem Çalışıyor' : 'Sistem Kapalı'}</h2>
          <p className="text-[#597360] text-sm">
            {irrigation.current === 'Açık' ? 'Sonraki kapanış: 2 saat 15 dk sonra' : `Sıradaki program: ${irrigation.next}`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className={`flex-1 rounded-full py-4 font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 ${irrigation.current === 'Açık' ? 'bg-[#FFEBEE] text-[#F44336]' : 'bg-[#4CAF50] text-white'}`}>
            <Play className={`h-5 w-5 ${irrigation.current === 'Açık' ? 'hidden' : 'block'}`} />
            {irrigation.current === 'Açık' ? 'Durdur' : 'Manuel Başlat'}
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E8F1EA]">
            <div className="flex items-center gap-2 mb-2 text-[#597360]">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Son Sulama</span>
            </div>
            <p className="font-bold text-[#1B331B]">Dün, 06:00</p>
            <p className="text-xs text-[#8EA694] mt-1">Süre: 4 saat</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E8F1EA]">
            <div className="flex items-center gap-2 mb-2 text-[#597360]">
              <Droplets className="h-4 w-4" />
              <span className="text-xs font-medium">Su Tüketimi</span>
            </div>
            <p className="font-bold text-[#1B331B]">12.5 ton</p>
            <p className="text-xs text-[#8EA694] mt-1">Bu ay toplam: 145t</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E8F1EA]">
            <div className="flex items-center gap-2 mb-2 text-[#597360]">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Tahmini İhtiyaç</span>
            </div>
            <p className="font-bold text-[#1B331B]">Yüksek</p>
            <p className="text-xs text-[#8EA694] mt-1">Nem %{field.sensors.moisture.value}</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E8F1EA]">
            <div className="flex items-center gap-2 mb-2 text-[#597360]">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Kapsam</span>
            </div>
            <p className="font-bold text-[#1B331B]">% {irrigation.coverage}</p>
            <p className="text-xs text-[#8EA694] mt-1">Tüm bölgeler aktif</p>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-[#1B331B] text-white rounded-[24px] p-6 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-bold text-lg">AI Sulama Önerisi</h3>
            <div className="bg-[#4CAF50] text-xs font-bold px-2 py-1 rounded">Aktif</div>
          </div>
          <p className="text-sm text-[#D2E6D7] leading-relaxed mb-6 relative z-10">
            Hava tahminlerine göre önümüzdeki 3 gün yağış beklenmiyor. Toprak nemini optimum seviyede tutmak için mevcut programı %15 uzatmanız önerilir.
          </p>
          <button className="w-full bg-white text-[#1B331B] py-3 rounded-full text-sm font-bold shadow-sm hover:bg-[#E8F1EA] transition-colors relative z-10">
            Programı Güncelle
          </button>
        </div>
      </main>
    </motion.div>
  );
}
