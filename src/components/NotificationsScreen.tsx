import React, { useState } from 'react';
import { ArrowLeft, Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { mockNotifications } from '../mockData';

interface NotificationsScreenProps {
  onBack: () => void;
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning'>('All');

  const filteredNotifications = mockNotifications.filter(n => filter === 'All' || n.priority === filter);

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
          <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Bildirimler</h1>
        </div>
        <button className="text-sm font-semibold text-[#4CAF50] px-3 py-1.5 rounded-full hover:bg-[#E8F1EA]">
          Tümünü Oku
        </button>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Critical', 'Warning'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#1B331B] text-white' 
                  : 'bg-white text-[#597360] shadow-sm hover:bg-[#E8F1EA]'
              }`}
            >
              {f === 'All' ? 'Tümü' : f === 'Critical' ? 'Kritik' : 'Uyarılar'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div key={n.id} className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                n.priority === 'Critical' ? 'bg-[#F44336]' :
                n.priority === 'Warning' ? 'bg-[#FF9800]' :
                n.priority === 'Success' ? 'bg-[#4CAF50]' : 'bg-[#2196F3]'
              }`} />
              
              <div className="flex items-start justify-between mb-2 pl-2">
                <div className="flex items-center gap-2">
                  {n.priority === 'Critical' && <ShieldAlert className="h-5 w-5 text-[#F44336]" />}
                  {n.priority === 'Warning' && <AlertTriangle className="h-5 w-5 text-[#FF9800]" />}
                  {n.priority === 'Success' && <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" />}
                  {n.priority === 'Info' && <Info className="h-5 w-5 text-[#2196F3]" />}
                  <h3 className="font-bold text-[#1B331B] leading-tight">{n.title}</h3>
                </div>
                <span className="text-[11px] font-medium text-[#8EA694] shrink-0 ml-2">{n.time}</span>
              </div>
              
              <p className="text-sm text-[#597360] pl-2 mb-3 leading-relaxed">{n.description}</p>
              
              {n.relatedField && (
                <div className="ml-2 inline-flex items-center px-2.5 py-1 rounded-md bg-[#F4FAF5] text-xs font-semibold text-[#2D5A27] border border-[#E8F1EA]">
                  İlgili Alan: {n.relatedField}
                </div>
              )}
            </div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-[#E8F1EA] rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-[#8EA694]" />
              </div>
              <h3 className="font-bold text-[#1B331B] mb-1">Harika!</h3>
              <p className="text-sm text-[#597360]">Bu kategoride yeni bildirim yok.</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
