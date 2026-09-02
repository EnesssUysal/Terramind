import React, { useState, useEffect, useRef } from 'react';
import { Camera, Send, Droplets, Zap, AlertTriangle, Leaf, CheckCircle2, ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';

interface AiChatScreenProps {
  onBack?: () => void;
  initialContext?: string | null;
}

type MessageType = 'text' | 'diagnosis' | 'irrigation';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  type: MessageType;
  text?: string;
  imageUrl?: string;
}

export default function AiChatScreen({ onBack, initialContext }: AiChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const initial: Message[] = [
      {
        id: '1',
        sender: 'ai',
        type: 'text',
        text: 'Merhaba, ben TerraMind Asistan. Malatya tesisinden gelen son verilere göre Güney Parsel\'de toprak nemi %18\'e geriledi. Size nasıl yardımcı olabilirim?'
      }
    ];
    if (initialContext) {
      initial.push({ id: 'ctx-user', sender: 'user', type: 'text', text: initialContext });
      initial.push({
        id: 'ctx-ai',
        sender: 'ai',
        type: 'text',
        text: 'Bu verilere dayanarak size nasıl yardımcı olabilirim? Aşağıdaki önerilerden birini seçebilir veya sorunuzu yazabilirsiniz.'
      });
    }
    return initial;
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isValveOpen, setIsValveOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', type: 'text', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (userMsg.text?.toLowerCase().includes('sulama')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          type: 'irrigation',
          text: 'Güney Parsel (Sera-3) için güncel sulama durumu aşağıdadır. İsterseniz otonom sistemi ezip manuel müdahale edebilirsiniz.'
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          type: 'text',
          text: 'Bu konuyu analiz ediyorum. Sistem loglarında olağandışı bir durum görünmüyor. Başka bir alanı kontrol etmemi ister misiniz?'
        }]);
      }
    }, 1500);
  };

  const handleCameraSimulation = () => {
    const userImgMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400'
    };
    setMessages(prev => [...prev, userImgMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        type: 'diagnosis',
        text: 'Görüntü işleme modelimiz (Vision AI) yapraktaki semptomları inceledi.'
      }]);
    }, 2500);
  };

  return (
    <div className="flex flex-col bg-[#F4FAF5] font-sans animate-in fade-in duration-300" style={{ height: 'calc(100vh - 96px)' }}>

      <div className="shrink-0 bg-white px-6 py-4 flex items-center shadow-sm border-b border-slate-100">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors mr-3">
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#1B331B] rounded-xl flex items-center justify-center shadow-md">
              <Leaf size={20} className="text-[#4CAF50]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-[15px] font-black text-[#1B331B] leading-tight">TerraMind AI</h1>
            <span className="text-[11px] font-bold text-emerald-600">Çevrimiçi (Saha Sensörlerine Bağlı)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>

            {msg.sender === 'user' && (
              <div className="bg-[#1B331B] text-white p-4 rounded-3xl rounded-br-sm max-w-[85%] shadow-md">
                {msg.text && <p className="text-sm font-medium">{msg.text}</p>}
                {msg.imageUrl && (
                  <div className="mt-1 relative">
                    <img src={msg.imageUrl} alt="Uploaded leaf" className="rounded-2xl w-48 h-48 object-cover border-2 border-white/20" />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-lg">Analiz Ediliyor...</div>
                  </div>
                )}
              </div>
            )}

            {msg.sender === 'ai' && (
              <div className="max-w-[90%]">
                <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-3xl rounded-tl-sm shadow-sm">
                  <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                </div>

                {msg.type === 'irrigation' && (
                  <div className="mt-2 bg-white border border-blue-100 rounded-2xl p-4 shadow-sm w-full animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <Droplets size={18} className="text-blue-500" /> Güney Parsel (NODE-02)
                      </div>
                      <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg">Kritik Nem: %18</span>
                    </div>
                    <button
                      onClick={() => setIsValveOpen(!isValveOpen)}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        isValveOpen
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                      }`}
                    >
                      <Zap size={18} className={isValveOpen ? 'text-blue-500' : 'text-blue-200'} />
                      {isValveOpen ? 'Sistem Devrede (Kapat)' : "Manuel Müdahale: Vana-2'yi Aç"}
                    </button>
                  </div>
                )}

                {msg.type === 'diagnosis' && (
                  <div className="mt-2 bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-2xl p-4 shadow-sm w-full animate-in zoom-in-95 duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-orange-100 p-2 rounded-xl shrink-0">
                        <AlertTriangle size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">Gül Pası Hastalığı (Phragmidium)</h4>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">%94 Güven Skoru</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-4">
                      Yapraklardaki turuncu/sarı spor lekeleri pas hastalığına işaret ediyor. Nemin yüksek olması yayılımı hızlandırmış olabilir.
                    </p>
                    <div className="bg-white rounded-xl p-3 border border-orange-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Önerilen Acil Eylem</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Bakır oksi-klorür bazlı ilaçlama.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="text-[#4CAF50] animate-spin" />
              <span className="text-xs font-bold text-slate-500">Sistem verileri taranıyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4">

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
          <button onClick={() => { setInputText('Sulama durumu nedir?'); handleSend(); }} className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors">
            💧 Sulama Durumu
          </button>
          <button onClick={() => handleCameraSimulation()} className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors flex items-center gap-1.5">
            <ImageIcon size={14} className="text-emerald-600" /> Yaprak Analizi
          </button>
          <button className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors">
            🌤️ Hava Tahmini
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#F4FAF5] border border-slate-200 rounded-full flex items-center px-2 py-1 shadow-inner focus-within:border-emerald-400 focus-within:bg-white transition-colors">

            <button
              onClick={handleCameraSimulation}
              className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              title="Fotoğraf Yükle & Analiz Et"
            >
              <Camera size={20} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Yapay zekaya sorun veya fotoğraf yükleyin..."
              className="flex-1 bg-transparent border-none outline-none px-2 text-[14px] text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={handleSend}
            className={`p-3.5 rounded-full transition-all shadow-md ${inputText.trim() ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-slate-200 text-slate-400'}`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}