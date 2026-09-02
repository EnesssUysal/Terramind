import React from 'react';
import { ArrowLeft, Shield, FileText, Database, MapPin, Activity, Trash2, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyScreenProps {
  onBack: () => void;
}

export default function PrivacyScreen({ onBack }: PrivacyScreenProps) {
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
        <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Gizlilik</h1>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center mb-2">
          <div className="h-16 w-16 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1B331B] mb-2">Verileriniz Güvende</h2>
          <p className="text-sm text-[#597360]">
            TerraMind olarak verilerinizin gizliliğine önem veriyoruz. Sadece size daha iyi hizmet sunmak için gerekli bilgileri topluyoruz.
          </p>
        </div>

        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-4 hover:bg-[#F4FAF5] cursor-pointer">
            <FileText className="h-6 w-6 text-[#1B331B]" />
            <div className="flex-1 border-b border-[#E8F1EA] pb-4">
              <h4 className="font-bold text-[#1B331B]">Gizlilik Politikası</h4>
              <p className="text-xs text-[#597360] mt-0.5">Sözleşme şartlarımızı okuyun</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#F4FAF5] cursor-pointer">
            <Database className="h-6 w-6 text-[#1B331B]" />
            <div className="flex-1 border-b border-[#E8F1EA] pb-4">
              <h4 className="font-bold text-[#1B331B]">Veri Toplama ve Kullanımı</h4>
              <p className="text-xs text-[#597360] mt-0.5">Hangi verileri neden topluyoruz?</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#F4FAF5] cursor-pointer">
            <MapPin className="h-6 w-6 text-[#1B331B]" />
            <div className="flex-1 border-b border-[#E8F1EA] pb-4">
              <h4 className="font-bold text-[#1B331B]">Konum İzni</h4>
              <p className="text-xs text-[#597360] mt-0.5">Tarlalarınızın takibi için gerekli izinler</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#F4FAF5] cursor-pointer">
            <Activity className="h-6 w-6 text-[#1B331B]" />
            <div className="flex-1">
              <h4 className="font-bold text-[#1B331B]">Sensör Veri Kullanımı</h4>
              <p className="text-xs text-[#597360] mt-0.5">Cihazlarınızdan alınan verilerin analizi</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-6">
          <div className="p-4 flex items-center gap-4 hover:bg-[#F4FAF5] cursor-pointer">
            <Download className="h-6 w-6 text-[#1976D2]" />
            <div className="flex-1 border-b border-[#E8F1EA] pb-4">
              <h4 className="font-bold text-[#1B331B]">Verilerimi İndir</h4>
              <p className="text-xs text-[#597360] mt-0.5">Tüm bilgilerinizi dışa aktarın</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#FFEBEE] cursor-pointer">
            <Trash2 className="h-6 w-6 text-[#F44336]" />
            <div className="flex-1">
              <h4 className="font-bold text-[#F44336]">Hesabımı Sil</h4>
              <p className="text-xs text-[#F44336] opacity-80 mt-0.5">Tüm verilerinizi kalıcı olarak silin</p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
