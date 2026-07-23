import React, { useState } from 'react';
import { Send, Sparkles, User, HelpCircle } from 'lucide-react';
import { aiMessages } from '../mockData';

interface AiTabProps {
  initialContext?: string | null;
}

export default function AiTab({ initialContext }: AiTabProps) {
  const [messages, setMessages] = useState(() => {
    const msgs = [...aiMessages];
    if (initialContext) {
      msgs.push({
        id: Date.now(),
        text: initialContext,
        sender: 'user'
      });
      msgs.push({
        id: Date.now() + 1,
        text: "Bu verilere dayanarak size nasıl yardımcı olabilirim? Aşağıdaki önerilerden birini seçebilir veya sorunuzu yazabilirsiniz.",
        sender: 'ai'
      });
    }
    return msgs;
  });
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Şu an test ortamında olduğumuz için bu soruya standart bir yanıt veriyorum. TerraMind AI yakında burada olacak.",
        sender: 'ai'
      }]);
    }, 1000);
  };

  const suggestions = ["Sulama", "Toprak", "Bitki Hastalıkları", "Gübreleme", "Verim", "Tarım"];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)]">
      <div className="px-6 pt-6 pb-4 bg-white shadow-sm z-10 flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B331B]">
          <Sparkles className="h-5 w-5 text-[#A5D6A7]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1B331B]">TerraMind AI</h2>
          <p className="text-[11px] font-medium text-[#4CAF50]">Çevrimiçi</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-[20px] p-4 ${
              msg.sender === 'user' 
                ? 'bg-[#1B331B] text-white rounded-tr-[4px]' 
                : 'bg-white text-[#1B331B] shadow-sm rounded-tl-[4px]'
            }`}>
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-4 pb-6 px-6">
        <div className="no-scrollbar flex overflow-x-auto space-x-2 mb-4 pb-1">
          {suggestions.map(s => (
            <button 
              key={s}
              onClick={() => setInput(s)}
              className="flex-shrink-0 flex items-center space-x-1.5 rounded-full border border-[#D2E6D7] bg-[#F4FAF5] px-3 py-1.5 text-[13px] font-medium text-[#597360] transition-colors hover:bg-[#E8F1EA]"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{s}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Yapay zekaya bir şey sorun..."
            className="flex-1 rounded-full bg-[#F4FAF5] px-5 py-3.5 text-[15px] text-[#1B331B] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4CAF50] text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
