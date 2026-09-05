import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Camera, Send, Mic, Droplets, Activity, CloudSun, Leaf } from 'lucide-react';

export const AiTab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Merhaba, ben TerraMind Asistan. Malatya tesisinden gelen son verilere göre Güney Parsel'de toprak nemi %18'e geriledi. Size nasıl yardımcı olabilirim?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- SES TANIMA (Web Speech API) ---
  const handleListen = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome veya Safari kullanın.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // --- MESAJ GÖNDERME ---
  const handleSend = (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputText;
    if (!textToSend.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSend }]);
    if (typeof textOverride !== 'string') setInputText('');
    
    // AI Yanıt Simülasyonu
    setTimeout(() => {
      let aiReply = `"${textToSend}" isteğinizi aldım. Sistem verilerini analiz ediyorum...`;
      if (textToSend.includes('Sulama')) aiReply = "Güney Parsel için sulama durumu: Toprak nemi kritik (%18). 45 dakikalık otonom sulama döngüsü başlatılmasını öneririm.";
      if (textToSend.includes('Yaprak')) aiReply = "Lütfen analiz edilecek yaprağın fotoğrafını çekin veya yükleyin.";
      if (textToSend.includes('Hava')) aiReply = "Bölgenizde hava şu an 22°C ve açık. Rüzgar hızı 10 km/h. Önümüzdeki 3 gün yağış beklenmiyor.";

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReply }]);
    }, 1000);
  };

  // --- GERÇEK KAMERA / GALERİ ERİŞİMİ ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Fotoğrafı sohbete kullanıcı mesajı olarak ekle
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender: 'user', 
      text: `📷 [Fotoğraf Yüklendi: ${file.name}]` 
    }]);

    // AI'ın fotoğrafı analiz etme simülasyonu
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "Fotoğraf başarıyla işlendi. Görüntü analizi modeline göre yapraklarda erken evre azot eksikliği belirtileri tespit edildi. Analiz raporunu Tarlalar sekmesinden detaylı inceleyebilirsiniz." 
      }]);
    }, 1500);

    // Aynı fotoğrafı tekrar seçebilmek için input'u sıfırla
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
      <header className="flex items-center p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <button className="p-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">TerraMind AI</h1>
            <p className="text-xs font-semibold text-emerald-600">Çevrimiçi (Saha Sensörlerine Bağlı)</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-sm' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 space-y-3 sticky bottom-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => handleSend("Sulama Durumu nedir?")} className="flex items-center space-x-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Sulama Durumu</span>
          </button>
          <button onClick={() => handleSend("Yaprak Analizi yapmak istiyorum.")} className="flex items-center space-x-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Yaprak Analizi</span>
          </button>
          <button onClick={() => handleSend("Bölgedeki Hava Tahmini nedir?")} className="flex items-center space-x-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
            <span>Hava Tahmini</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            
            {/* GİZLİ KAMERA/DOSYA INPUTU */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
            
            {/* KAMERA BUTONU (Gizli inputu tetikler) */}
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="text-slate-400 hover:text-emerald-600 transition-colors mr-3"
            >
              <Camera className="w-5 h-5" />
            </button>
            
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Yapay zekaya sorun veya fotoğraf yükleyin..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400"
            />
          </div>

          <button 
            onClick={handleListen}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] scale-110' 
                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' 
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AiTab;