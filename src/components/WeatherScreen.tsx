import React from 'react';
import { ArrowLeft, CloudSun, Wind, Droplets, Sun, Sunrise, Sunset, Info, CloudRain } from 'lucide-react';
import { motion } from 'motion/react';
import { mockWeather, mockFields } from '../mockData';

interface WeatherScreenProps {
  onBack: () => void;
  selectedFieldId: string;
}

export default function WeatherScreen({ onBack, selectedFieldId }: WeatherScreenProps) {
  const field = mockFields.find(f => f.id === selectedFieldId) || mockFields[0];
  const w = mockWeather;

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
          <h1 className="text-lg font-bold text-[#1B331B]">Hava Durumu</h1>
          <p className="text-xs text-[#597360]">{field.name}</p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12 space-y-6">
        {/* Current Weather Hero */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#4CAF50] to-[#2D5A27] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-2xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm text-white/80 font-medium mb-1">{w.condition || 'Parçalı Bulutlu'}</p>
              <div className="flex items-baseline space-x-2">
                <h2 className="text-6xl font-bold">{w.currentTemp || 24}°</h2>
              </div>
            </div>
            <CloudSun className="h-16 w-16 text-white/90" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8 relative z-10 border-t border-white/20 pt-4">
            <div className="flex flex-col">
              <span className="text-white/70 text-xs mb-1 flex items-center gap-1"><Wind className="h-3 w-3"/> Rüzgar</span>
              <span className="font-bold">{w.windSpeed || 12} km/s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/70 text-xs mb-1 flex items-center gap-1"><Droplets className="h-3 w-3"/> Nem</span>
              <span className="font-bold">%{w.humidity || 45}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/70 text-xs mb-1 flex items-center gap-1"><Sun className="h-3 w-3"/> UV İndeksi</span>
              <span className="font-bold">{w.uvIndex || '4 Orta'}</span>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="rounded-[20px] bg-[#E8F1EA] p-4 flex gap-3 shadow-sm border border-[#D2E6D7]">
          <Info className="h-6 w-6 text-[#2D5A27] shrink-0" />
          <p className="text-sm text-[#1B331B] leading-relaxed font-medium">
            <span className="font-bold">Tarımsal Öneri: </span>
            {w.recommendation || 'Çarşamba günü beklenen yağış nedeniyle otonom sulama sistemleri optimize edilmiştir.'}
          </p>
        </div>

        {/* Hourly Forecast */}
        <div>
          <h3 className="font-bold text-[#1B331B] mb-3">Saatlik Tahmin</h3>
          <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar">
            {(w.hourly || [
              { time: '09:00', temp: 20, icon: 'sun' },
              { time: '12:00', temp: 24, icon: 'sun' },
              { time: '15:00', temp: 25, icon: 'cloud' },
              { time: '18:00', temp: 21, icon: 'cloud' },
              { time: '21:00', temp: 17, icon: 'cloud' },
            ]).map((h: any, i: number) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-[16px] p-3 w-[72px] flex flex-col items-center shadow-sm">
                <span className="text-xs text-[#597360] font-medium mb-2">{h.time}</span>
                {h.icon === 'sun' ? <Sun className="h-6 w-6 text-[#FF9800] mb-2" /> : 
                 h.icon === 'cloud' ? <CloudSun className="h-6 w-6 text-[#9E9E9E] mb-2" /> : 
                 <CloudSun className="h-6 w-6 text-[#8EA694] mb-2" />}
                <span className="font-bold text-[#1B331B]">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sun & Extra Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[20px] p-4 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#FFF3E0] flex items-center justify-center shrink-0">
              <Sunrise className="h-5 w-5 text-[#FF9800]" />
            </div>
            <div>
              <p className="text-xs text-[#597360]">Gündoğumu</p>
              <p className="font-bold text-[#1B331B]">{w.sunrise || '06:15'}</p>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
              <Sunset className="h-5 w-5 text-[#1976D2]" />
            </div>
            <div>
              <p className="text-xs text-[#597360]">Günbatımı</p>
              <p className="font-bold text-[#1B331B]">{w.sunset || '19:30'}</p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <h3 className="font-bold text-[#1B331B] mb-4">7 Günlük Tahmin</h3>
          <div className="space-y-4">
            {(w.daily || [
              { day: 'Bugün', min: 14, max: 24, icon: 'sun', rainProb: 10 },
              { day: 'Çar', min: 11, max: 18, icon: 'cloud', rainProb: 85 },
              { day: 'Per', min: 12, max: 22, icon: 'sun', rainProb: 5 },
              { day: 'Cum', min: 15, max: 26, icon: 'sun', rainProb: 0 },
              { day: 'Cmt', min: 13, max: 21, icon: 'cloud', rainProb: 20 },
            ]).map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="w-8 font-medium text-[#597360]">{d.day}</span>
                <div className="flex items-center gap-2 w-16">
                  {d.icon === 'sun' ? <Sun className="h-5 w-5 text-[#FF9800]" /> : 
                   <CloudRain className="h-5 w-5 text-[#1976D2]" />}
                  {d.rainProb > 0 && <span className="text-[10px] font-bold text-[#1976D2]">%{d.rainProb}</span>}
                </div>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="text-[#8EA694] font-medium">{d.min}°</span>
                  <div className="w-16 h-1.5 bg-[#E8F1EA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8EA694] to-[#4CAF50] rounded-full" 
                      style={{ width: `${((d.max - d.min) / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#1B331B] font-bold">{d.max}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}