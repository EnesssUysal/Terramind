import React, { useState, useEffect, useRef } from 'react';
import { Camera, Send, Mic, Droplets, Activity, Leaf, Trash2, ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';

export interface Field {
  id: string;
  name: string;
  crop?: string;
  ndvi?: number;
  weatherImpact?: string;
  sensors: {
    moisture: { value: number; status: string };
    temperature: { value: number };
    nitrogen: { value: number };
    ph: { value: number };
  };
}

interface AiChatScreenProps {
  onBack?: () => void;
  initialContext?: string | null;
  selectedField?: Field | any;
  fields?: Field[] | any[];
  onSelectField?: (id: string) => void;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// --- DAKTİLO EFEKTİ ---
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string;
  isNew?: boolean;
}

// Görseli Yapay Zekaya Göndermek İçin Formatlayıcı
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

export default function AiChatScreen({ onBack, initialContext, selectedField, fields, onSelectField }: AiChatScreenProps) {
  
  // Örnek Tarla Verileri (Eğer MainScreen'den gelmezse diye yedek liste)
  const defaultFields = [
    { id: '1', name: 'Kuzey Tarlası (Buğday)', sensors: { moisture: { value: 18 }, temperature: { value: 24 }, nitrogen: { value: 35 }, ph: { value: 6.2 } } },
    { id: '2', name: 'Güney Tarlası (Mısır)', sensors: { moisture: { value: 45 }, temperature: { value: 22 }, nitrogen: { value: 60 }, ph: { value: 6.8 } } },
    { id: '3', name: 'Sera 1 (Domates)', sensors: { moisture: { value: 65 }, temperature: { value: 26 }, nitrogen: { value: 80 }, ph: { value: 6.0 } } },
  ];

  const availableFields = fields && fields.length > 0 ? fields : defaultFields;
  const [activeField, setActiveField] = useState<any>(selectedField || availableFields[0]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [
      {
        id: '1',
        sender: 'ai',
        text: `Merhaba, ben TerraMind Asistan. Gerçek Vision (Görsel İşleme) motorum devrede. Şu an ${activeField.name} verilerini analiz ediyorum.`,
        isNew: false
      }
    ];
    if (initialContext) {
      initial.push({ id: 'ctx-user', sender: 'user', text: initialContext });
    }
    return initial;
  });
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- TARLA DEĞİŞTİRME İŞLEMİ ---
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const newField = availableFields.find((f: any) => f.id === newId) || availableFields[0];
    setActiveField(newField);
    if (onSelectField) onSelectField(newId);

    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      sender: 'ai', 
      text: `Bağlantı güncellendi. Artık "${newField.name}" sensörlerini dinliyorum.`, 
      isNew: true 
    }]);
  };

  const handleClearChat = () => setMessages([]);

  // Yapay Zekaya Gönderilen Canlı Tarla Verisi
  function buildFieldContext(): string {
    const s = activeField.sensors || { moisture: { value: 18 }, temperature: { value: 22 }, nitrogen: { value: 40 }, ph: { value: 6.5 } };
    return `Tarla: ${activeField.name} | Nem: %${s.moisture?.value || 18} | Sıcaklık: ${s.temperature?.value || 22}°C | Azot: ${s.nitrogen?.value || 40} ppm | pH: ${s.ph?.value || 6.5}`;
  }

  const handleListen = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setInputText((prev) => prev + (prev ? ' ' : '') + event.results[0][0].transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- METİN MODELİ (DİNAMİK) ---
  const handleSend = async (textOverride?: string) => {
    const question = typeof textOverride === 'string' ? textOverride : inputText;
    if (!question.trim() || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: question }]);
    if (typeof textOverride !== 'string') setInputText('');
    setIsTyping(true);

    try {
      if (!GEMINI_API_KEY) throw new Error('API anahtarı bulunamadı.');

      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      const modelsData = await modelsRes.json();
      const activeModels = modelsData.models.filter((m: any) => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'));

      const systemPrompt = `Sen TerraMind Asistan'sın. Uzman, ciddi ve gerçekçi bir ziraat mühendisisin.
GÖREVİN: Çiftçinin sorusunu SADECE aşağıdaki GÜNCEL SENSÖR VERİLERİNE dayanarak cevapla. Kafandan veri uydurma.
Veriler: ${buildFieldContext()}
Çiftçinin sorusu: "${question}"
KURALLAR: En fazla 3 cümle kur. Markdown (yıldız, başlık vs.) kesinlikle KULLANMA. Doğrudan çözüm öner.`;

      let aiReply = null;

      for (const model of activeModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiReply) break; 
          }
        } catch (e) { continue; }
      }

      if (!aiReply) throw new Error('Google modelleri yanıt veremedi.');
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiReply.trim(), isNew: true }]);

    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `⚠️ SİSTEM NOTU: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- VISION (GÖRSEL İŞLEME) MODELİ ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localImageUrl = URL.createObjectURL(file);
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', imageUrl: localImageUrl }]);
    setIsTyping(true);

    try {
      if (!GEMINI_API_KEY) throw new Error('API anahtarı bulunamadı.');

      const base64Data = await fileToBase64(file);
      const imagePart = {
        inlineData: { data: base64Data, mimeType: file.type }
      };

      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      const modelsData = await modelsRes.json();
      const activeModels = modelsData.models.filter((m: any) => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'));

      const visionPrompt = `Sen TerraMind Asistan'sın. Uzman bir ziraat mühendisisin. Gönderilen bu tarım/bitki fotoğrafını dikkatlice incele. Eğer bitkide bir hastalık, zararlı veya besin eksikliği görüyorsan adını ve acil çözümünü söyle. Eğer sağlıklı görünüyorsa bunu belirt. Sadece tek bir paragraf ve düz metin olarak cevap ver.`;

      let aiReply = null;

      for (const model of activeModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: visionPrompt }, imagePart] }],
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiReply) break; 
          }
        } catch (e) { continue; }
      }

      if (!aiReply) throw new Error('Bu görseli analiz edebilecek uygun bir model şu an aktif değil.');
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiReply.trim(), isNew: true }]);

    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `⚠️ Görsel Analiz Hatası: ${err.message}` }]);
    } finally {
      setIsTyping(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col bg-[#F4FAF5] font-sans animate-in fade-in duration-300" style={{ height: 'calc(100vh - 96px)' }}>
      {/* ÜST BİLGİ VE TARLA SEÇİCİ HEADER */}
      <div className="shrink-0 bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
              <ChevronLeft size={24} className="text-slate-700" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 bg-[#1B331B] rounded-xl flex items-center justify-center shadow-md">
                <Leaf size={18} className="text-[#4CAF50]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-[14px] font-black text-[#1B331B] leading-tight">TerraMind AI</h1>
              <span className="text-[10px] font-bold text-emerald-600">Vision Motoru Aktif</span>
            </div>
          </div>
        </div>

        {/* SAĞ ÜST KISIM: TARLA DROPDOWN VE ÇÖP KUTUSU */}
        <div className="flex items-center gap-2">
          <select
            value={activeField.id}
            onChange={handleFieldChange}
            className="max-w-[125px] truncate bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            {availableFields.map((f: any) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button onClick={handleClearChat} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
              {msg.imageUrl && (
                <div className="mb-2">
                  <img src={msg.imageUrl} alt="Uploaded leaf" className="rounded-2xl w-48 h-48 object-cover border-2 border-white/20 shadow-sm" />
                </div>
              )}
              {msg.isNew && msg.sender === 'ai' && msg.text ? <TypewriterText text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="text-[#4CAF50] animate-spin" />
              <span className="text-xs font-bold text-slate-500">Gemini inceliyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
          <button onClick={() => handleSend('Sulama durumu nedir?')} className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors">💧 Sulama Durumu</button>
          <button onClick={() => fileInputRef.current?.click()} className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors flex items-center gap-1.5"><ImageIcon size={14} className="text-emerald-600" /> Yaprak Analizi</button>
          <button onClick={() => handleSend('Tarlanın genel durumu nasıl?')} className="shrink-0 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-colors">🌤️ Genel Durum</button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#F4FAF5] border border-slate-200 rounded-full flex items-center px-2 py-1 shadow-inner focus-within:border-emerald-400 focus-within:bg-white transition-colors">
            
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"><Camera size={20} /></button>
            
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Uzman AI'a sorun..." className="flex-1 bg-transparent border-none outline-none px-2 text-[14px] text-slate-700 placeholder:text-slate-400" disabled={isTyping} />
            
            <button onClick={handleListen} disabled={isTyping} className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 mr-1 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
              <Mic size={20} />
            </button>
          </div>
          
          <button onClick={() => handleSend()} disabled={isTyping || !inputText.trim()} className={`p-3.5 rounded-full transition-all shadow-md ${inputText.trim() && !isTyping ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-slate-200 text-slate-400'}`}>
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}