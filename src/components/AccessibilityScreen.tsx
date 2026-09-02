import React, { useState } from 'react';
import { ArrowLeft, Volume2, MessageSquare, Phone, CheckCircle2, AlertTriangle, Smartphone } from 'lucide-react';

interface AccessibilityScreenProps {
  onBack: () => void;
}

export default function AccessibilityScreen({ onBack }: AccessibilityScreenProps) {
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0555 123 45 67');

  // Tarayıcı üzerinden gerçek Sesli Asistan (Web Speech API)
  const handleVoiceAssistant = () => {
    if (!('speechSynthesis' in window)) {
      alert("Tarayıcınız sesli okumayı desteklemiyor.");
      return;
    }

    // Mevcut konuşmayı durdur ve yeniden başlat
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const textToSpeak = "Terra mind Akıllı Tarım Asistanına hoş geldiniz. Tarlanızdaki toprak nemi yüzde yirmi seviyesine düştü. Ancak on sekiz saat sonra şiddetli yağış beklendiği için otomatik sulama durduruldu. Şu an her şey yolunda.";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9; // Yaşlı çiftçiler için biraz daha yavaş ve anlaşılır
    
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSms = () => {
    setSmsEnabled(!smsEnabled);
  };

  // Sayfadan çıkıldığında sesi durdur
  const handleBack = () => {
    window.speechSynthesis.cancel();
    onBack();
  };

  return (
    <div className="flex-1 bg-white min-h-screen font-sans animate-in fade-in duration-300 pb-12">
      
      {/* ÜST BAR (Büyük Fontlar ve Yüksek Kontrast) */}
      <div className="bg-[#1B331B] px-4 py-6 flex items-center shadow-lg sticky top-0 z-20">
        <button onClick={handleBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors mr-4">
          <ArrowLeft size={32} className="text-white" />
        </button>
        <h1 className="text-2xl font-black text-white tracking-wide">Kolay Kullanım Modu</h1>
      </div>

      <div className="px-6 mt-8 space-y-6">
        
        {/* DEV SESLİ ASİSTAN BUTONU */}
        <button 
          onClick={handleVoiceAssistant}
          className={`w-full p-8 rounded-3xl border-4 flex flex-col items-center justify-center transition-all ${
            isSpeaking 
            ? 'bg-emerald-100 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
            : 'bg-slate-50 border-slate-200 hover:border-emerald-300 shadow-md'
          }`}
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isSpeaking ? 'bg-emerald-500 animate-pulse' : 'bg-[#1B331B]'}`}>
            <Volume2 size={48} className="text-white" />
          </div>
          <h2 className={`text-3xl font-black text-center mb-3 ${isSpeaking ? 'text-emerald-700' : 'text-slate-800'}`}>
            {isSpeaking ? 'Sizi Bilgilendiriyorum...' : 'Bana Durumu Oku'}
          </h2>
          <p className="text-slate-500 text-lg font-medium text-center px-4">
            Ekrana bakmanıza gerek yok. Tarlanızın son durumunu sesli dinlemek için buraya dokunun.
          </p>
        </button>

        <div className="w-full h-px bg-slate-200 my-8"></div>

        {/* SMS BİLDİRİM PANELİ (Eski Tuşlu Telefonlar İçin) */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Smartphone size={28} className="text-slate-700" />
            <h2 className="text-2xl font-black text-slate-800">SMS ile Haber Ver</h2>
          </div>
          <p className="text-slate-500 text-base font-medium mb-6">
            Akıllı telefonunuz çekmediğinde veya internetiniz bittiğinde, acil kuraklık ve don uyarılarını eski tip tuşlu telefonlara normal mesaj (SMS) olarak göndeririz.
          </p>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6">
            <div className="mb-6">
              <label className="block text-slate-500 font-bold text-sm uppercase tracking-widest mb-2">
                Kayıtlı Telefon Numarası
              </label>
              <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl p-4">
                <Phone size={24} className="text-slate-400 mr-3" />
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-transparent text-xl font-black text-slate-800 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={toggleSms}
              className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all ${
                smsEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${smsEnabled ? 'bg-white/20' : 'bg-white'}`}>
                  {smsEnabled ? <CheckCircle2 size={28} className="text-white" /> : <MessageSquare size={28} className="text-slate-400" />}
                </div>
                <span className={`text-xl font-black ${smsEnabled ? 'text-white' : 'text-slate-500'}`}>
                  {smsEnabled ? 'SMS Uyarıları Aktif' : 'SMS Özelliğini Aç'}
                </span>
              </div>
              
              <div className={`w-14 h-8 rounded-full p-1 transition-colors ${smsEnabled ? 'bg-white' : 'bg-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full transition-transform ${smsEnabled ? 'bg-emerald-500 translate-x-6' : 'bg-white translate-x-0'}`}></div>
              </div>
            </button>

            {/* Aktif olduğunda görünen örnek SMS simülasyonu */}
            {smsEnabled && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-yellow-600" />
                  <span className="text-yellow-800 font-bold">Örnek SMS Gönderimi</span>
                </div>
                <p className="text-yellow-700/80 font-mono text-sm leading-relaxed">
                  "TerraMind Acil: Sera-3 bölgesinde su seviyesi kritik. Sistem otonom sulamayı başlattı. (Tarih: 02.09.2026 14:30)"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}