import React from 'react';
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, Bug, ChevronRight, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SupportScreenProps {
  onBack: () => void;
}

export default function SupportScreen({ onBack }: SupportScreenProps) {
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
        <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Destek</h1>
      </header>

      <main className="flex-1 px-4 py-4 space-y-6">
        <div className="bg-[#1B331B] text-white rounded-[24px] p-6 relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 h-32 w-32 bg-white opacity-5 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-2">Nasıl Yardımcı Olabiliriz?</h2>
          <p className="text-[#D2E6D7] text-sm mb-6">
            TerraMind destek ekibi sorularınızı yanıtlamak ve sorunlarınızı çözmek için hazır.
          </p>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Sorununuzu buraya yazın..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-4 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#597360] ml-4 mb-3">İletişim Seçenekleri</h3>
          <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#E8F5E9] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <div className="flex-1 border-b border-[#E8F1EA] pb-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#1B331B]">Canlı Destek</h4>
                  <p className="text-xs text-[#597360] mt-0.5">Uzmanlarımızla görüşün</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#E3F2FD] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-[#2196F3]" />
              </div>
              <div className="flex-1 border-b border-[#E8F1EA] pb-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#1B331B]">E-posta Gönder</h4>
                  <p className="text-xs text-[#597360] mt-0.5">destek@terramind.app</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#FFF3E0] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-[#FF9800]" />
              </div>
              <div className="flex-1 border-b border-[#E8F1EA] pb-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#1B331B]">Bizi Arayın</h4>
                  <p className="text-xs text-[#597360] mt-0.5">+90 (850) 123 45 67</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#F3E5F5] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <HelpCircle className="h-5 w-5 text-[#9C27B0]" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#1B331B]">Sıkça Sorulan Sorular</h4>
                  <p className="text-xs text-[#597360] mt-0.5">Çözüm merkezimizi ziyaret edin</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#597360] ml-4 mb-3">Geri Bildirim</h3>
          <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#F4FAF5] h-10 w-10 rounded-full flex items-center justify-center shrink-0 border border-[#E8F1EA]">
                <MessageCircle className="h-5 w-5 text-[#1B331B]" />
              </div>
              <div className="flex-1 border-b border-[#E8F1EA] pb-4 flex justify-between items-center">
                <h4 className="font-bold text-[#1B331B]">Görüş Bildir</h4>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-[#F4FAF5] cursor-pointer">
              <div className="bg-[#FFEBEE] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <Bug className="h-5 w-5 text-[#F44336]" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <h4 className="font-bold text-[#1B331B]">Hata Bildir</h4>
                <ChevronRight className="h-5 w-5 text-[#8EA694]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
