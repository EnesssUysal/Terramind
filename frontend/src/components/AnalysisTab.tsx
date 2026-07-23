import React from 'react';
import { Field } from '../types';
import { BarChart2, TrendingUp, Calendar, Filter } from 'lucide-react';

interface AnalysisTabProps {
  selectedField: Field;
}

export default function AnalysisTab({ selectedField }: AnalysisTabProps) {
  return (
    <div className="flex-1 px-6 pt-6">
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
        {/* Placeholder Chart 1 */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1B331B]">Toprak Nemi Geçmişi</h3>
            <div className="flex items-center space-x-1 text-sm text-[#8EA694]">
              <Calendar className="h-4 w-4" />
              <span>Son 7 Gün</span>
            </div>
          </div>
          <div className="h-48 w-full rounded-[12px] bg-[#F4FAF5] flex items-center justify-center border border-dashed border-[#D2E6D7]">
            <div className="text-center text-[#8EA694]">
              <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>

        {/* Placeholder Chart 2 */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1B331B]">Azot & pH İlişkisi</h3>
            <div className="flex items-center space-x-1 text-sm text-[#8EA694]">
              <TrendingUp className="h-4 w-4" />
              <span>Aylık</span>
            </div>
          </div>
          <div className="h-48 w-full rounded-[12px] bg-[#F4FAF5] flex items-center justify-center border border-dashed border-[#D2E6D7]">
            <div className="text-center text-[#8EA694]">
              <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>
        
        {/* AI Insight Placeholder */}
        <div className="rounded-[24px] bg-[#E8F1EA] p-5">
          <h3 className="font-bold text-[#1B331B] mb-2">Yapay Zekâ Özeti</h3>
          <p className="text-sm text-[#597360] leading-relaxed">
            Son 30 günlük verilere göre, sulama stratejiniz %15 su tasarrufu sağladı. Ancak azot seviyelerinde beklenen düşüş başladı. Önümüzdeki hafta gübreleme planlamanızı öneririm.
          </p>
        </div>
      </div>
    </div>
  );
}
