import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Dışarıya tıklanınca kapanması için
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="relative inline-flex items-center justify-center ml-1.5 cursor-pointer" 
      ref={tooltipRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      title={content} // Native browser tooltip as fallback
    >
      <Info size={14} className={`transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400'}`} />
      
      {isOpen && (
        <div 
          className="absolute z-[99999] bottom-full mb-2 left-1/2 -translate-x-1/2 w-[260px] p-4 bg-[#1e293b] text-slate-100 text-[13px] font-medium rounded-xl shadow-2xl text-center leading-relaxed pointer-events-none border border-slate-700"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1e293b]"></div>
        </div>
      )}
    </div>
  );
}
