import React from 'react';
import { ArrowLeft, Cpu, Battery, Wifi, CheckCircle2, AlertTriangle, XCircle, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { mockSensors } from '../mockData';

interface SensorsListScreenProps {
  onBack: () => void;
  onOpenDetail: (title: string) => void;
}

export default function SensorsListScreen({ onBack, onOpenDetail }: SensorsListScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="flex min-h-screen flex-col bg-[#F4FAF5]"
    >
      <header className="sticky top-0 z-50 flex flex-col bg-[#F4FAF5]/90 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Aktif Sensörler</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm">
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8EA694]" />
          <input 
            type="text" 
            placeholder="Sensör ara..." 
            className="w-full bg-white border-none rounded-full py-3 pl-11 pr-4 text-sm text-[#1B331B] shadow-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        {mockSensors.map(sensor => (
          <div 
            key={sensor.id}
            onClick={() => onOpenDetail('sensor-detail-placeholder')}
            className="bg-white rounded-[20px] p-5 shadow-sm border border-[#E8F1EA] cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                  sensor.status === 'Active' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                  sensor.status === 'Warning' ? 'bg-[#FFF3E0] text-[#FF9800]' : 'bg-[#FFEBEE] text-[#F44336]'
                }`}>
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1B331B] leading-tight">{sensor.name}</h3>
                  <p className="text-xs text-[#597360] mt-0.5">{sensor.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {sensor.status === 'Active' && <CheckCircle2 className="h-4 w-4 text-[#4CAF50]" />}
                {sensor.status === 'Warning' && <AlertTriangle className="h-4 w-4 text-[#FF9800]" />}
                {sensor.status === 'Offline' && <XCircle className="h-4 w-4 text-[#F44336]" />}
                <span className={`text-xs font-bold ${
                  sensor.status === 'Active' ? 'text-[#4CAF50]' :
                  sensor.status === 'Warning' ? 'text-[#FF9800]' : 'text-[#F44336]'
                }`}>{sensor.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
              <div>
                <span className="text-[#8EA694] block text-xs mb-0.5">Konum</span>
                <span className="font-medium text-[#1B331B] line-clamp-1">{sensor.field}</span>
              </div>
              <div>
                <span className="text-[#8EA694] block text-xs mb-0.5">Bölge</span>
                <span className="font-medium text-[#1B331B] line-clamp-1">{sensor.location}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#8EA694] block text-xs mb-0.5">Son Okuma</span>
                <span className="font-bold text-[#1B331B]">{sensor.latestReading}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-[#E8F1EA]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Battery className={`h-4 w-4 ${sensor.battery > 20 ? 'text-[#4CAF50]' : 'text-[#F44336]'}`} />
                  <span className={`text-xs font-bold ${sensor.battery > 20 ? 'text-[#597360]' : 'text-[#F44336]'}`}>%{sensor.battery}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className={`h-4 w-4 ${sensor.signal === 'Excellent' || sensor.signal === 'Good' ? 'text-[#2196F3]' : 'text-[#9E9E9E]'}`} />
                  <span className="text-xs font-medium text-[#597360]">{sensor.signal}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#8EA694] font-medium">{sensor.lastSync}</span>
            </div>
          </div>
        ))}
      </main>
    </motion.div>
  );
}
