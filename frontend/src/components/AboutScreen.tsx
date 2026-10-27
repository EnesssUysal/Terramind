import React from 'react';
import { ArrowLeft, ChevronRight, FileText, Code, Target, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import TerraMindLogo from './TerraMindLogo';

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
            <TerraMindLogo size={72} badge={true} />
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
              <Sprout className="h-5 w-5 text-emerald-600" />
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
