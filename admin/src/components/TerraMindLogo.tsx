import React from 'react';

export interface TerraMindLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  badge?: boolean;
  onClick?: () => void;
}

export const TerraMindLogo: React.FC<TerraMindLogoProps> = ({
  size = 32,
  showText = false,
  className = '',
  textClassName = '',
  badge = false,
  onClick
}) => {
  const gradientId = React.useId().replace(/:/g, '_');

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div 
        className={`relative flex items-center justify-center shrink-0 ${
          badge ? 'rounded-2xl p-2 bg-gradient-to-br from-emerald-950 to-[#060D0A] border border-emerald-500/30 shadow-lg shadow-emerald-950/50' : ''
        }`}
        style={{ width: badge ? size * 1.25 : size, height: badge ? size * 1.25 : size }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105 shrink-0"
        >
          <defs>
            <linearGradient id={`admin-tm-logo-${gradientId}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <g 
            stroke={`url(#admin-tm-logo-${gradientId})`} 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          >
            {/* Orijinal Sol Hemisfer / Çember Arkı */}
            <path d="M 50 5 A 45 45 0 0 0 50 95" />
            
            {/* 1. Üst Nöral / Ağaç Dalı */}
            <path d="M 20 18 Q 40 18 50 30 L 60 30 L 70 20 L 80 20" />
            <circle cx="80" cy="20" r="3.2" fill="#34D399" stroke="#064E3B" strokeWidth="0.8" />
            
            {/* 2. Orta-Üst Nöral Dal */}
            <path d="M 9 35 Q 35 35 45 50 L 55 50 L 65 40 L 85 40" />
            <circle cx="85" cy="40" r="3.2" fill="#34D399" stroke="#064E3B" strokeWidth="0.8" />
            
            {/* 3. Orta-Alt Nöral Dal */}
            <path d="M 6 55 Q 30 55 40 70 L 50 70 L 60 60 L 80 60" />
            <circle cx="80" cy="60" r="3.2" fill="#34D399" stroke="#064E3B" strokeWidth="0.8" />
            
            {/* 4. Alt Nöral Dal */}
            <path d="M 13 75 Q 25 75 35 85 L 45 85 L 55 75 L 70 75" />
            <circle cx="70" cy="75" r="3.2" fill="#34D399" stroke="#064E3B" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none text-white font-sans ${textClassName || 'text-xl'}`}>
            TerraMind
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
            Admin Suite
          </span>
        </div>
      )}
    </div>
  );
};

export default TerraMindLogo;
