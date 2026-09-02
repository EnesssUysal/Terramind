import React from 'react';
import { Users, TreePine } from 'lucide-react';
import { mockCarbonFootprint } from '../mockData';

interface ImpactTranslatorProps {
  totalSavedLiters: number;
}

// Ortalama kişi başı günlük musluk suyu tüketimi (TR ortalaması, tahmini referans değer).
const AVG_DAILY_WATER_USE_L = 130;
// 1 olgun ağacın yıllık ortalama CO2 tutumu (yaygın kabul gören tahmini referans, ~21kg/yıl).
const CO2_KG_PER_TREE_YEAR = 21;

export default function ImpactTranslator({ totalSavedLiters }: ImpactTranslatorProps) {
  const peopleDaysCovered = totalSavedLiters / AVG_DAILY_WATER_USE_L;

  const carbonDiffTonPerHa = mockCarbonFootprint.regionAveragePerHa - mockCarbonFootprint.farmAverageTonPerHa;
  const treesEquivalentPerHa = Math.max(0, Math.round((carbonDiffTonPerHa * 1000) / CO2_KG_PER_TREE_YEAR));

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <h3 className="font-bold text-[#1B331B] mb-1">Etkiniz Ne Anlama Geliyor?</h3>
      <p className="text-xs text-[#8EA694] mb-4">Tasarruf rakamlarının günlük hayattaki karşılığı (tahmini referans değerlerle)</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[16px] bg-[#E3F2FD] p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white mb-3">
            <Users className="h-4 w-4 text-[#2196F3]" />
          </div>
          <p className="text-2xl font-black text-[#1B331B] tabular-nums">
            {peopleDaysCovered.toFixed(1)}
          </p>
          <p className="text-xs text-[#597360] leading-snug mt-1">
            kişinin 1 günlük su ihtiyacına eşdeğer tasarruf ({totalSavedLiters} L)
          </p>
        </div>

        <div className="rounded-[16px] bg-[#E8F1EA] p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white mb-3">
            <TreePine className="h-4 w-4 text-[#4CAF50]" />
          </div>
          <p className="text-2xl font-black text-[#1B331B] tabular-nums">
            ~{treesEquivalentPerHa}
          </p>
          <p className="text-xs text-[#597360] leading-snug mt-1">
            ağacın yıllık karbon tutumuna eşdeğer, hektar başına bölge ortalamasına göre tasarruf
          </p>
        </div>
      </div>
    </div>
  );
}