import React, { useState } from 'react';
import { Brain, ChevronDown } from 'lucide-react';
import { Field } from '../types';

interface AiExplainabilityProps {
  selectedField: Field;
}

// Karar faktörlerini alanın gerçek sensör durumuna göre türetir.
// Nem kritikse "Toprak Nemi Sensörü" ağırlığı artar — böylece kriz simülasyonu
// sırasında bu panel de tutarlı şekilde tepki verir.
function getFactors(field: Field) {
  const moistureUrgent = field.sensors.moisture.status === 'down';
  return moistureUrgent
    ? [
        { label: 'Toprak Nemi Sensörü', value: 45, color: '#F44336' },
        { label: 'Meteorolojik Tahmin', value: 30, color: '#2196F3' },
        { label: 'NDVI Bitki Sağlığı', value: 15, color: '#4CAF50' },
        { label: 'Geçmiş Sulama Paterni', value: 10, color: '#8EA694' },
      ]
    : [
        { label: 'Meteorolojik Tahmin', value: 40, color: '#2196F3' },
        { label: 'Toprak Nemi Sensörü', value: 25, color: '#4CAF50' },
        { label: 'NDVI Bitki Sağlığı', value: 20, color: '#8BC34A' },
        { label: 'Geçmiş Sulama Paterni', value: 15, color: '#8EA694' },
      ];
}

export default function AiExplainability({ selectedField }: AiExplainabilityProps) {
  const [expanded, setExpanded] = useState(false);
  const factors = getFactors(selectedField);
  const topFactor = factors[0];

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E8FD]">
            <Brain className="h-4 w-4 text-[#9C27B0]" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B331B]">AI Neden Bu Kararı Verdi?</h3>
            <p className="text-xs text-[#8EA694]">Açıklanabilir Yapay Zeka Raporu</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#E8F1EA] px-3 py-1.5 text-sm font-bold text-[#4CAF50]">
            %{selectedField.aiConfidence} Güven
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#8EA694] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {!expanded && (
        <p className="text-xs text-[#597360] mt-3">
          En etkili faktör: <span className="font-semibold text-[#1B331B]">{topFactor.label}</span> (%{topFactor.value})
        </p>
      )}

      {expanded && (
        <div className="mt-4 space-y-3">
          {factors.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#597360] font-medium">{f.label}</span>
                <span className="font-bold text-[#1B331B]">%{f.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F4FAF5] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${f.value}%`, backgroundColor: f.color }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-[#8EA694] pt-1 leading-relaxed">
            Bu ağırlıklar, {selectedField.name} için son sensör verileri ve hava tahmini modeline göre gerçek zamanlı hesaplanır.
          </p>
        </div>
      )}
    </div>
  );
}