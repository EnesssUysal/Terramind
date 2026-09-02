import React from 'react';
import { Sparkles, CloudRain, Droplets, Eye } from 'lucide-react';
import { mockWeather } from '../mockData';

// Basit, şeffaf kural motoru: hava tahminine göre AI'nın planladığı aksiyonu türetir.
// Gerçek sistemde bu, backend'deki karar modelinden gelir; burada aynı mantığı
// mockWeather.daily üzerinde çalıştırıyoruz.
function getPlannedAction(rainProb: number, max: number) {
  if (rainProb >= 40) {
    return { label: 'Sulama Ertelendi', icon: CloudRain, bg: 'bg-[#E3F2FD]', text: 'text-[#2196F3]' };
  }
  if (max >= 27 && rainProb < 15) {
    return { label: 'Sulama Planlandı', icon: Droplets, bg: 'bg-[#FFF3E0]', text: 'text-[#F57C00]' };
  }
  return { label: 'İzleniyor', icon: Eye, bg: 'bg-[#F4FAF5]', text: 'text-[#8EA694]' };
}

export default function AiForecastTimeline() {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F1EA]">
            <Sparkles className="h-4 w-4 text-[#4CAF50]" />
          </div>
          <h3 className="font-bold text-[#1B331B]">AI'nın Sıradaki 7 Günü</h3>
        </div>
        <span className="rounded-full bg-[#E8F1EA] px-3 py-1 text-xs font-bold text-[#4CAF50]">
          Otonom Planlama
        </span>
      </div>
      <p className="text-xs text-[#8EA694] mb-4">
        AI sadece krize tepki vermiyor — hava tahminine göre önden planlıyor.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {mockWeather.daily.map((d) => {
          const action = getPlannedAction(d.rainProb, d.max);
          const Icon = action.icon;
          return (
            <div
              key={d.day}
              className="flex-shrink-0 w-24 rounded-[16px] border border-[#E8F1EA] p-3 flex flex-col items-center text-center"
            >
              <span className="text-xs font-bold text-[#1B331B] mb-2">{d.day}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full mb-2 ${action.bg}`}>
                <Icon className={`h-4 w-4 ${action.text}`} />
              </div>
              <span className={`text-[10px] font-semibold leading-tight ${action.text}`}>{action.label}</span>
              <span className="text-[10px] text-[#8EA694] mt-1">%{d.rainProb} yağış</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}