import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown, Minus, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface FactorCardProps {
  title: string;
  currentValue: string;
  unit: string;
  status: 'İyi' | 'Dikkat' | 'Kritik' | 'Veri Yok';
  referenceRange: string;
  changeValue?: string;
  changeType?: 'up' | 'down' | 'neutral';
  impactDescription: string;
  suggestion: string;
  dataSource: string;
  lastUpdated: string;
  detailedAnalysis?: React.ReactNode;
  calculationMethod?: string;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

export default function FactorCard(props: FactorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'İyi': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dikkat': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Kritik': return 'bg-red-100 text-red-800 border-red-200';
      case 'Veri Yok': default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeIcon = () => {
    if (props.changeType === 'up') return <TrendingUp size={16} className="text-red-500 mr-1" />;
    if (props.changeType === 'down') return <TrendingDown size={16} className="text-emerald-500 mr-1" />;
    return <Minus size={16} className="text-gray-500 mr-1" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {props.icon && <div className="p-2 bg-slate-50 rounded-xl">{props.icon}</div>}
          <div>
            <h3 className="font-black text-lg text-slate-800">{props.title}</h3>
            <p className="text-sm text-slate-500 font-medium">Referans Aralığı: {props.referenceRange}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{props.currentValue}</span>
            <span className="text-lg font-bold text-slate-500 pb-1">{props.unit}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColors(props.status)}`}>
            {props.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-[300px]">
          {props.chart ? (
             <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                {props.chart}
             </div>
          ) : (
            <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400">
              [Grafik Alanı: Yeterli Veri Yok]
            </div>
          )}
          {props.changeValue && (
             <div className="mt-3 flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-max">
               {getChangeIcon()} 
               <span>Son ölçüme göre {props.changeValue} değişim</span>
             </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
             <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Ne oluyor?</h4>
             <p className="text-sm font-medium text-slate-700 leading-relaxed">{props.impactDescription}</p>
          </div>
          
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
             <h4 className="text-xs font-bold text-orange-800 uppercase mb-1">Bitkimi nasıl etkiler?</h4>
             <p className="text-sm font-medium text-slate-700 leading-relaxed">Bu durum bitkinin verimini ve sağlığını doğrudan etkiler. Uygun koşulların sağlanamaması stres yaratır.</p>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
             <h4 className="text-xs font-bold text-emerald-800 uppercase mb-1">Ne yapmalıyım?</h4>
             <p className="text-sm font-medium text-emerald-900 leading-relaxed">{props.suggestion}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
           <Activity size={14}/>
           <span>Kaynak: {props.dataSource} • Son güncellenme: {props.lastUpdated}</span>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors bg-blue-100/50 px-3 py-1.5 rounded-lg"
        >
          {showDetails ? (
            <><ChevronUp size={16} className="mr-1"/> Detayları Gizle</>
          ) : (
            <><ChevronDown size={16} className="mr-1"/> Detaylı Analiz & Hesaplama</>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="p-5 border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
           {props.detailedAnalysis && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Detaylı Analiz</h4>
                <div className="text-sm text-slate-600">{props.detailedAnalysis}</div>
              </div>
           )}
           {props.calculationMethod && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Nasıl Hesaplandı?</h4>
                <p className="text-sm font-mono text-slate-700">{props.calculationMethod}</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
}
