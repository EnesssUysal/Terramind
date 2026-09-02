import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MessageSquare, Mail, PhoneCall, HelpCircle, Lightbulb, Bug, ChevronRight, Bot, Loader2, Send, X, User } from 'lucide-react';

interface SupportScreenProps {
  onBack: () => void;
}

export default function SupportScreen({ onBack }: SupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Stateleri
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{sender: 'expert' | 'user', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Telefon Araması
  const handleCall = () => window.location.href = 'tel:+908501234567';

  // E-Posta İstemcisi
  const handleEmail = () => window.location.href = 'mailto:destek@terramind.app?subject=TerraMind%20Destek%20Talebi';

  // AI Hata Bildirim Simülasyonu
  const handleAiBugReport = () => {
    setIsAiModalOpen(true);
    setIsAiAnalyzing(true);
    setTimeout(() => setIsAiAnalyzing(false), 2000);
  };

  // Canlı Destek Simülasyonu
  const handleLiveChat = () => {
    setIsLiveChatOpen(true);
    setMessages([]);
    setIsTyping(true);
    
    // Ziraat Uzmanı Bağlanma Simülasyonu
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        { sender: 'expert', text: 'Merhaba! Ben TerraMind Ziraat Uzmanı. Sistemden gördüğüm kadarıyla Sera-3 bölgesinde toprak nemi %20 seviyesinde. Size bu konuda mı yardımcı olmamı istersiniz?' }
      ]);
    }, 2500);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'user', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="flex-1 bg-[#F4FAF5] min-h-screen font-sans animate-in fade-in duration-300 pb-12 relative">
      
      {/* ÜST BAR */}
      <div className="bg-white px-6 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors mr-3">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <h1 className="text-xl font-black text-slate-800">Çözüm Merkezi</h1>
      </div>

      {/* HERO ALANI & ARAMA ÇUBUĞU */}
      <div className="px-6 pt-6 pb-12 bg-gradient-to-br from-[#1B331B] to-[#2D5A27] relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white mb-2">Nasıl Yardımcı Olabiliriz?</h2>
          <p className="text-emerald-100/80 text-sm font-medium mb-8">
            TerraMind destek ekibi ve akıllı asistanımız sorunlarınızı çözmek için 7/24 hazır.
          </p>
        </div>
        
        <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex items-center z-10">
          <div className="bg-slate-50 p-2.5 rounded-xl mr-3 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Sorununuzu buraya yazın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
          />
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="px-6 mt-12 space-y-8">
        
        {/* ACİL İLETİŞİM KANALLARI */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Öncelikli Kanallar</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleLiveChat} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group text-left flex flex-col justify-between h-32">
              <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <MessageSquare size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Canlı Destek</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Uzmanlarla anında görüşün</p>
              </div>
            </button>

            <button onClick={handleCall} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group text-left flex flex-col justify-between h-32">
              <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <PhoneCall size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Bizi Arayın</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">+90 (850) 123 45 67</p>
              </div>
            </button>
          </div>
        </section>

        {/* DİĞER SEÇENEKLER LİSTESİ */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Destek & Geri Bildirim</h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <button onClick={handleEmail} className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center">
                <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-white transition-colors">
                  <Mail size={18} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">E-posta Gönder</h4>
                  <p className="text-xs text-slate-500">destek@terramind.app</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>

            <button onClick={handleAiBugReport} className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors group">
              <div className="flex items-center">
                <div className="bg-red-50 p-2.5 rounded-xl mr-4 group-hover:bg-white transition-colors">
                  <Bug size={18} className="text-red-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-red-700 text-sm">Hata Bildir (AI Destekli)</h4>
                  <p className="text-xs text-red-500/70">Yapay zeka sistem loglarını inceler</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-red-300 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </section>
      </div>

      {/* CANLI DESTEK SOHBET MODALI */}
      {isLiveChatOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#F4FAF5] w-full h-[85vh] sm:h-[600px] sm:max-w-md sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden rounded-t-3xl border border-slate-200 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            
            {/* Sohbet Başlığı */}
            <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">Ziraat Uzmanı</h3>
                  <p className="text-[10px] font-bold text-emerald-600">Çevrimiçi</p>
                </div>
              </div>
              <button onClick={() => setIsLiveChatOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Mesajlaşma Alanı */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center h-10">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 animate-in fade-in slide-in-from-bottom-2`}>
                  {msg.sender === 'expert' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mb-1">
                      <User size={14} className="text-blue-600" />
                    </div>
                  )}
                  <div className={`p-3.5 max-w-[75%] shadow-sm ${msg.sender === 'user' ? 'bg-[#1B331B] text-white rounded-2xl rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'}`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mesaj Gönderme Çubuğu */}
            <div className="bg-white p-4 border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1.5 pl-4">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Mesajınızı yazın..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button onClick={sendChatMessage} className="bg-emerald-500 hover:bg-emerald-600 p-2.5 rounded-full transition-colors shadow-sm">
                  <Send size={16} className="text-white ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* YAPAY ZEKA HATA BİLDİRİM MODALI (Önceki kodun aynısı) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-[#1B331B] p-6 text-center relative">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <Bot size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-black text-lg">TerraMind AI Asistan</h3>
              <p className="text-emerald-100/70 text-xs mt-1">Sistem Diyagnostik Merkezi</p>
            </div>
            
            <div className="p-6">
              {isAiAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 size={32} className="text-emerald-600 animate-spin mb-4" />
                  <p className="text-slate-600 font-bold text-sm text-center">Sistem logları taranıyor...</p>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-2">
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-sm font-medium border border-emerald-100 mb-6">
                    Sistem taraması tamamlandı. Kritik bir sensör arızası tespit edilmedi. Manuel bir hata bildirmek ister misiniz?
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-[#1B331B] text-white font-bold py-3.5 rounded-xl hover:bg-[#2D5A27] transition-colors">Sorunu Manuel Yaz</button>
                    <button onClick={() => setIsAiModalOpen(false)} className="w-full bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Kapat</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}