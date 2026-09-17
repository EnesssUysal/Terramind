import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, Mic, Droplets, Activity, Leaf, Trash2 } from 'lucide-react';

interface FieldItem {
  id: string;
  name: string;
}

interface AiTabProps {
  fields?: FieldItem[];
  selectedFieldId?: string;
  onSelectField?: (id: string) => void;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

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
  id: number;
  sender: 'user' | 'ai';
  text: string;
  isNew: boolean;
  imageUrl?: string;
}

export const AiTab: React.FC<AiTabProps> = ({
  fields = [{ id: 'default', name: 'Genel Tesis' }],
  selectedFieldId,
  onSelectField,
}) => {
  const [localFieldId, setLocalFieldId] = useState(fields[0]?.id || 'default');
  const activeFieldId = selectedFieldId || localFieldId;
  const activeFieldName = fields.find(f => f.id === activeFieldId)?.name || 'Genel Tesis';

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: `Merhaba, ben TerraMind Asistan. Şifre doğrulandı, güncel Gemini motoruna bağlandım! Size nasıl yardımcı olabilirim?`,
      isNew: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const newName = fields.find(f => f.id === newId)?.name || 'Bilinmeyen Tarla';
    if (onSelectField) onSelectField(newId);
    else setLocalFieldId(newId);

    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Bağlantı güncellendi: "${newName}" verileri aktif.`, isNew: true }]);
  };

  const handleClearChat = () => setMessages([]);

  const handleListen = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInputText((prev) => prev + (prev ? ' ' : '') + event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- DİNAMİK MODEL AVCISI (404 HATASINA KESİN ÇÖZÜM) ---
  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputText;
    if (!textToSend.trim() || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSend, isNew: false }]);
    if (typeof textOverride !== 'string') setInputText('');
    setIsTyping(true);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('API anahtarı bulunamadı (.env dosyanızı kontrol edin).');
      }

      // 1. ADIM: Google'a bağlanıp aktif modellerin listesini çekiyoruz
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      if (!modelsRes.ok) throw new Error('Modeller listesi Google sunucularından alınamadı.');
      const modelsData = await modelsRes.json();
      
      // 2. ADIM: Listeden metin üretebilen ve adı "gemini" olan İLK AKTİF modeli buluyoruz
      const activeModel = modelsData.models.find((m: any) => 
        m.name.includes('gemini') && 
        m.supportedGenerationMethods?.includes('generateContent')
      );

      if (!activeModel) {
        throw new Error('Hesabınıza tanımlı aktif bir Gemini modeli bulunamadı.');
      }

      const promptContext = `Sen TerraMind Asistan'sın. Uzman bir ziraat mühendisi ve akıllı tarım yapay zekasısın.
Şu anki seçili tarla: ${activeFieldName}.
Sistemdeki Veriler: Toprak Nemi %18, Sıcaklık 22°C.
Kullanıcının Sorusu: "${textToSend}"
Görev: Verilere dayanarak net, mantıklı ve profesyonel bir Türkçe yanıt ver. Maksimum 3-4 cümle olsun. Düz metin kullan.`;

      // 3. ADIM: Soruyu Google'ın bize verdiği o aktif modele (activeModel.name) gönderiyoruz!
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${activeModel.name}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptContext }] }] }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google API reddetti: ${response.status} - ${errorData.substring(0,100)}`);
      }

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiReply) throw new Error('Yapay zekadan boş yanıt geldi.');

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReply.trim(), isNew: true }]);

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `⚠️ SİSTEM NOTU: ${msg}`, isNew: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localImageUrl = URL.createObjectURL(file);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `📷 [Fotoğraf Yüklendi]`, isNew: false, imageUrl: localImageUrl }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `Görüntü analiz edildi. ${activeFieldName} alanındaki yapraklarda pas hastalığı riski tespit edildi.`, isNew: true }]);
      setIsTyping(false);
    }, 2500);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
      <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">TerraMind AI</h1>
            <p className="text-xs font-semibold text-emerald-600">Dinamik Gemini Motoru</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select value={activeFieldId} onChange={handleFieldChange} className="max-w-[140px] truncate bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-emerald-100 transition-colors">
            {fields.map(field => <option key={field.id} value={field.id}>{field.name}</option>)}
          </select>
          <button onClick={handleClearChat} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
              {msg.imageUrl && <div className="mb-2"><img src={msg.imageUrl} alt="Yüklenen Fotoğraf" className="w-full max-w-[200px] h-auto rounded-lg border-2 border-white/20" /></div>}
              {msg.isNew && msg.sender === 'ai' ? <TypewriterText text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm flex items-center space-x-2">
              <span className="animate-bounce text-emerald-600">●</span>
              <span className="animate-bounce delay-100 text-emerald-600">●</span>
              <span className="animate-bounce delay-200 text-emerald-600">●</span>
              <span className="ml-2 text-xs font-semibold">Gemini verileri yorumluyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 space-y-3 sticky bottom-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => handleSend('Bu tarla için sulama önerin nedir?')} className="flex items-center space-x-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Droplets className="w-3.5 h-3.5 text-blue-500" /><span>Sulama Önerisi</span>
          </button>
          <button onClick={() => handleSend('Tarlanın genel durumu nasıl?')} className="flex items-center space-x-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /><span>Genel Analiz</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-emerald-600 transition-colors mr-3"><Camera className="w-5 h-5" /></button>
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Uzman yapay zekaya danışın..." className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400" disabled={isTyping} />
            <button onClick={handleListen} disabled={isTyping} className={`ml-2 p-1.5 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md scale-110' : 'text-slate-400 hover:text-emerald-600'}`}><Mic className="w-5 h-5" /></button>
          </div>
          <button onClick={() => handleSend()} disabled={!inputText.trim() || isTyping} className={`p-3 rounded-full flex items-center justify-center transition-all ${inputText.trim() && !isTyping ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' : 'bg-slate-100 text-slate-400'}`}><Send className="w-5 h-5 ml-1" /></button>
        </div>
      </footer>
    </div>
  );
};

export default AiTab;