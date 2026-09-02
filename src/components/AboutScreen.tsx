import React from 'react';
import { ArrowLeft, ChevronRight, FileText, Code, Target, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutScreenProps {
  onBack: () => void;
}

export default function AboutScreen({ onBack }: AboutScreenProps) {
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
        <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Hakkında</h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="#1B331B"/>
              <path d="M16 8C13.2 8 11.5 9.5 11 12H13.2C13.6 10.6 14.6 10 16 10C17.7 10 18.8 11.2 18.8 13C18.8 15 16 15 16 18V19H18V18.2C18 16.5 21 16 21 13C21 10.2 18.8 8 16 8Z" fill="#A5D6A7"/>
              <circle cx="17" cy="22" r="1.5" fill="#A5D6A7"/>
              <path d="M8 24C10.5 24 13 22.5 14 20H11.5C10.8 21.5 9.5 22 8 22V24Z" fill="#4CAF50"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1B331B]">TerraMind</h2>
          <p className="text-sm font-medium text-[#8EA694] mt-1">Sürüm 2.4.1</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm">
          <h3 className="font-bold text-[#1B331B] mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#4CAF50]" /> Misyonumuz
          </h3>
          <p className="text-sm text-[#597360] leading-relaxed">
            TerraMind, sürdürülebilir tarım pratiklerini modern yapay zeka teknolojileriyle birleştirerek, çiftçilerin verimliliğini artırmayı ve doğal kaynakların korunmasına katkı sağlamayı amaçlar.
          </p>
        </div>

        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-[#F4FAF5] cursor-pointer border-b border-[#E8F1EA]">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#8EA694]" />
              <span className="font-semibold text-[#1B331B]">Kullanım Şartları</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-[#F4FAF5] cursor-pointer border-b border-[#E8F1EA]">
            <div className="flex items-center gap-3">
              <Code className="h-5 w-5 text-[#8EA694]" />
              <span className="font-semibold text-[#1B331B]">Açık Kaynak Lisansları</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-[#F4FAF5] cursor-pointer">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-[#F44336]" />
              <span className="font-semibold text-[#1B331B]">Geliştirici Ekip</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </div>
        </div>

        <div className="text-center pb-6">
          <p className="text-xs text-[#8EA694]">© 2026 TerraMind Tarım Teknolojileri</p>
          <p className="text-[10px] text-[#8EA694] mt-1">Tüm Hakları Saklıdır.</p>
        </div>
      </main>
    </motion.div>
  );
}
