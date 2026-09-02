import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, ShieldAlert, Clock, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { mockAlerts } from '../mockData';

interface AlertsScreenProps {
  onBack: () => void;
}

export default function AlertsScreen({ onBack }: AlertsScreenProps) {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Resolved'>('All');

  const filteredAlerts = mockAlerts.filter(a => filter === 'All' || a.type === filter);

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
          <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Uyarı Merkezi</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm">
          <Filter className="h-4 w-4" />
        </button>
      </header>

      <main className="flex-1 px-4 pb-12">
        <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Critical', 'Warning', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#1B331B] text-white' 
                  : 'bg-white text-[#597360] shadow-sm hover:bg-[#E8F1EA]'
              }`}
            >
              {f === 'All' ? 'Tümü' : f === 'Critical' ? 'Kritik' : f === 'Warning' ? 'Uyarılar' : 'Çözülenler'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className={`bg-white rounded-[20px] p-5 shadow-sm border ${
              alert.type === 'Critical' ? 'border-[#F44336]/30' :
              alert.type === 'Warning' ? 'border-[#FF9800]/30' :
              'border-[#E8F1EA]'
            }`}>
              <div className="flex gap-3 mb-3">
                <div className={`mt-0.5 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  alert.type === 'Critical' ? 'bg-[#FFEBEE] text-[#F44336]' :
                  alert.type === 'Warning' ? 'bg-[#FFF3E0] text-[#FF9800]' :
                  alert.type === 'Resolved' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                  'bg-[#E3F2FD] text-[#2196F3]'
                }`}>
                  {alert.type === 'Critical' && <ShieldAlert className="h-5 w-5" />}
                  {alert.type === 'Warning' && <AlertTriangle className="h-5 w-5" />}
                  {alert.type === 'Resolved' && <CheckCircle2 className="h-5 w-5" />}
                  {alert.type === 'Info' && <AlertTriangle className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-[#1B331B] leading-tight">{alert.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-[#1B331B] px-2 py-0.5 rounded bg-[#F4FAF5]">{alert.field}</span>
                    <span className="text-[11px] font-medium text-[#8EA694] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-[#597360] leading-relaxed mb-4 pl-[52px]">
                {alert.description}
              </p>
              
              {alert.type !== 'Resolved' && (
                <div className="flex gap-3 pl-[52px]">
                  <button className="flex-1 bg-[#F4FAF5] text-[#1B331B] text-sm font-bold py-2.5 rounded-full hover:bg-[#E8F1EA] transition-colors">
                    Detay
                  </button>
                  <button className="flex-1 bg-[#1B331B] text-white text-sm font-bold py-2.5 rounded-full hover:bg-[#2D5A27] transition-colors">
                    Çözüldü İşaretle
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-[#8EA694] mx-auto mb-3 opacity-50" />
              <p className="text-[#597360] font-medium">Bu kategoride aktif uyarı bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
