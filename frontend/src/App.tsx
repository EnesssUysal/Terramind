import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerId = 'toprakNemi' | 'su' | 'ph' | 'azot' | 'fosfor' | 'potasyum' | 'sicaklik' | 'hastalikRiski'
type StatusLevel = 0 | 1 | 2
type NavId = 'home' | 'fields' | 'analytics' | 'ai' | 'profile'

// ─── Constants ────────────────────────────────────────────────────────────────

const DATA_LAYERS: { id: LayerId; label: string }[] = [
  { id: 'toprakNemi', label: 'Toprak Nemi' },
  { id: 'su', label: 'Su' },
  { id: 'ph', label: 'pH' },
  { id: 'azot', label: 'Azot' },
  { id: 'fosfor', label: 'Fosfor' },
  { id: 'potasyum', label: 'Potasyum' },
  { id: 'sicaklik', label: 'Sıcaklık' },
  { id: 'hastalikRiski', label: 'Hastalık Riski' },
]

// 0 = sağlıklı, 1 = uyarı, 2 = kritik
const ZONE_STATUSES: Record<LayerId, StatusLevel[]> = {
  toprakNemi:    [0, 2, 1, 0, 1, 0, 0, 2, 1, 0],
  su:            [0, 0, 1, 2, 0, 1, 0, 0, 2, 1],
  ph:            [1, 0, 0, 1, 2, 0, 1, 0, 0, 2],
  azot:          [0, 0, 2, 1, 0, 2, 0, 1, 0, 1],
  fosfor:        [1, 1, 0, 0, 1, 0, 2, 0, 1, 0],
  potasyum:      [0, 1, 0, 2, 0, 1, 1, 0, 0, 2],
  sicaklik:      [1, 0, 1, 0, 2, 0, 0, 1, 0, 1],
  hastalikRiski: [0, 2, 0, 1, 0, 2, 1, 0, 2, 0],
}

const ZONE_PATHS = [
  'M0,0 L118,0 L122,88 L0,92 Z',
  'M118,0 L242,0 L246,82 L122,88 Z',
  'M242,0 L360,0 L360,88 L246,82 Z',
  'M0,92 L122,88 L124,158 L0,162 Z',
  'M122,88 L246,82 L248,154 L124,158 Z',
  'M246,82 L360,88 L360,158 L248,154 Z',
  'M0,162 L124,158 L120,220 L0,220 Z',
  'M124,158 L200,154 L196,220 L120,220 Z',
  'M200,154 L248,154 L244,220 L196,220 Z',
  'M248,154 L360,158 L360,220 L244,220 Z',
]

const ZONE_LABELS = [
  { label: 'A1', cx: 59, cy: 46 },
  { label: 'A2', cx: 184, cy: 43 },
  { label: 'A3', cx: 303, cy: 46 },
  { label: 'B1', cx: 60, cy: 125 },
  { label: 'B2', cx: 185, cy: 121 },
  { label: 'B3', cx: 304, cy: 123 },
  { label: 'C1', cx: 59, cy: 192 },
  { label: 'C2', cx: 158, cy: 189 },
  { label: 'C3', cx: 222, cy: 189 },
  { label: 'C4', cx: 303, cy: 191 },
]

const STATUS_CFG = [
  { fill: 'rgba(34,197,94,0.42)',  stroke: 'rgba(22,163,74,0.9)',   selFill: 'rgba(34,197,94,0.68)',  dot: '#16A34A', text: '#15803D', bg: '#F0FDF4', label: 'Sağlıklı' },
  { fill: 'rgba(234,179,8,0.42)', stroke: 'rgba(202,138,4,0.9)',   selFill: 'rgba(234,179,8,0.68)',  dot: '#D97706', text: '#92400E', bg: '#FFFBEB', label: 'Uyarı'    },
  { fill: 'rgba(239,68,68,0.42)', stroke: 'rgba(220,38,38,0.9)',   selFill: 'rgba(239,68,68,0.68)',  dot: '#DC2626', text: '#991B1B', bg: '#FEF2F2', label: 'Kritik'   },
]

const SENSOR_CARDS = [
  { id: 'toprakNemi', label: 'Toprak Nemi', value: '68',  unit: '%',     status: 0 as StatusLevel, trend: '+2.1', iconBg: '#EFF6FF', iconColor: '#3B82F6', symbol: '💧' },
  { id: 'ph',         label: 'pH Değeri',   value: '6.8', unit: '',      status: 0 as StatusLevel, trend: '0.0',  iconBg: '#F5F3FF', iconColor: '#7C3AED', symbol: 'pH' },
  { id: 'su',         label: 'Su Seviyesi', value: '45',  unit: '%',     status: 1 as StatusLevel, trend: '-3.2', iconBg: '#EFF6FF', iconColor: '#2563EB', symbol: '🌊' },
  { id: 'azot',       label: 'Azot (N)',    value: '32',  unit: 'mg/kg', status: 2 as StatusLevel, trend: '-8.4', iconBg: '#FEF2F2', iconColor: '#DC2626', symbol: 'N'  },
  { id: 'fosfor',     label: 'Fosfor (P)',  value: '18',  unit: 'mg/kg', status: 0 as StatusLevel, trend: '+0.3', iconBg: '#F0FDF4', iconColor: '#15803D', symbol: 'P'  },
  { id: 'potasyum',   label: 'Potasyum (K)',value: '124', unit: 'mg/kg', status: 0 as StatusLevel, trend: '+1.1', iconBg: '#FFFBEB', iconColor: '#B45309', symbol: 'K'  },
  { id: 'havaSic',    label: 'Hava Sıcaklığı', value: '26', unit: '°C', status: 0 as StatusLevel, trend: '+1.5', iconBg: '#FEF2F2', iconColor: '#EF4444', symbol: '🌡️' },
  { id: 'nem',        label: 'Nem',         value: '62',  unit: '%',     status: 0 as StatusLevel, trend: '-0.8', iconBg: '#F5F3FF', iconColor: '#A78BFA', symbol: '🌫️' },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IcHome({ on }: { on: boolean }) {
  const c = on ? '#15803D' : '#94A3B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 4L21 10.5V20C21 20.55 20.55 21 20 21H15V15.5H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  )
}
function IcMap({ on }: { on: boolean }) {
  const c = on ? '#15803D' : '#94A3B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"
        fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <line x1="9" y1="3" x2="9" y2="18" stroke={c} strokeWidth="1.4" />
      <line x1="15" y1="6" x2="15" y2="21" stroke={c} strokeWidth="1.4" />
    </svg>
  )
}
function IcChart({ on }: { on: boolean }) {
  const c = on ? '#15803D' : '#94A3B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="14" width="4" height="7" rx="1" fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" />
      <rect x="10" y="9"  width="4" height="12" rx="1" fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" />
      <rect x="17" y="4"  width="4" height="17" rx="1" fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" />
    </svg>
  )
}
function IcSparkle({ on, size = 22 }: { on: boolean; size?: number }) {
  const c = on ? '#15803D' : '#94A3B8'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.6 9.2L20.5 10.5L13.6 11.8L12 19L10.4 11.8L3.5 10.5L10.4 9.2Z"
        fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M19.5 3.5L20.1 5.5L22 6.1L20.1 6.7L19.5 8.5L18.9 6.7L17 6.1L18.9 5.5Z"
        fill={c} />
    </svg>
  )
}
function IcUser({ on }: { on: boolean }) {
  const c = on ? '#15803D' : '#94A3B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" fill={on ? '#DCFCE7' : 'none'} stroke={c} strokeWidth="1.75" />
      <path d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21"
        stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#DCFCE7', borderRadius: 20, padding: '2px 9px 2px 7px' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 0 2.5px rgba(22,163,74,0.22)' }} className="live-dot" />
      <span style={{ fontSize: 10, fontWeight: 700, color: '#15803D', letterSpacing: '0.6px' }}>CANLI VERİ</span>
    </span>
  )
}

function HealthRing({ score }: { score: number }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = circ * score / 100
  return (
    <div style={{ position: 'relative', width: 54, height: 54 }}>
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle cx="27" cy="27" r={r} fill="none" stroke="#16A34A" strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" transform="rotate(-90 27 27)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1A0F', lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>{score}</span>
        <span style={{ fontSize: 8, color: '#9CA3AF', marginTop: 1.5 }}>skor</span>
      </div>
    </div>
  )
}

function SensorSymbol({ symbol, iconBg, iconColor }: { symbol: string; iconBg: string; iconColor: string }) {
  const isEmoji = /\p{Emoji}/u.test(symbol) && symbol.length > 1
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 10, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: isEmoji ? 17 : symbol.length > 1 ? 10 : 14,
      fontWeight: 700, color: iconColor,
      fontFamily: isEmoji ? 'inherit' : "'DM Mono', monospace",
      flexShrink: 0,
    }}>
      {symbol}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeLayer, setActiveLayer] = useState<LayerId>('toprakNemi')
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [activeNav, setActiveNav] = useState<NavId>('home')

  const statuses = ZONE_STATUSES[activeLayer]
  const currentLayerLabel = DATA_LAYERS.find(l => l.id === activeLayer)!.label

  const navItems = [
    { id: 'home'      as NavId, label: 'Ana Sayfa',  Icon: IcHome  },
    { id: 'fields'    as NavId, label: 'Tarlalar',   Icon: IcMap   },
    { id: 'analytics' as NavId, label: 'Analitik',   Icon: IcChart },
    { id: 'ai'        as NavId, label: 'Yapay Zeka', Icon: IcSparkle },
    { id: 'profile'   as NavId, label: 'Profil',     Icon: IcUser  },
  ]

  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 0 2.5px rgba(22,163,74,0.22); }
          50%      { box-shadow: 0 0 0 5px   rgba(22,163,74,0.08); }
        }
        .live-dot { animation: livePulse 2s ease-in-out infinite; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* Outer canvas */}
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #D1E8D5 0%, #C4DFC9 100%)', display: 'flex', justifyContent: 'center', fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* Mobile shell */}
        <div style={{ width: '100%', maxWidth: 390, height: '100vh', position: 'relative', background: '#F8F9F7', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Status bar */}
          <div style={{ height: 48, background: '#F8F9F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 0', flexShrink: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', letterSpacing: '-0.3px' }}>9:41</span>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12">
                <rect x="0"    y="5"   width="3" height="7"  rx="0.6" fill="#111827" />
                <rect x="4.5"  y="3.5" width="3" height="8.5" rx="0.6" fill="#111827" />
                <rect x="9"    y="1.5" width="3" height="10.5" rx="0.6" fill="#111827" />
                <rect x="13.5" y="3.5" width="3" height="8.5" rx="0.6" fill="#D1D5DB" />
              </svg>
              {/* Wifi */}
              <svg width="15" height="12" viewBox="0 0 15 12">
                <path d="M0 4C3.8 0.5 11.2 0.5 15 4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M2.5 6.5C4.8 4.5 10.2 4.5 12.5 6.5" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M5 9C6.2 8 8.8 8 10 9" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="7.5" cy="11" r="1" fill="#111827" />
              </svg>
              {/* Battery */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <div style={{ width: 24, height: 12, borderRadius: 3, border: '1.5px solid #374151', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '76%', height: '100%', background: '#16A34A', borderRadius: 1.5 }} />
                </div>
                <div style={{ width: 2, height: 5, background: '#374151', borderRadius: '0 1px 1px 0' }} />
              </div>
            </div>
          </div>

          {/* Scroll area */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>

            {/* ── Header ── */}
            <div style={{ padding: '6px 20px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', letterSpacing: '1px', textTransform: 'uppercase' }}>TerraMind</span>
                    <LiveDot />
                  </div>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0D1A0F', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Manisa Üzüm Tarlası
                  </h1>
                  <p style={{ fontSize: 12.5, color: '#6B7280', margin: '3px 0 0', fontWeight: 400 }}>
                    Manisa, Türkiye · 42 dönüm
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, marginLeft: 10 }}>
                  {/* Weather pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', borderRadius: 12, padding: '5px 10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.6" />
                      {[0,45,90,135,180,225,270,315].map(a => (
                        <line key={a} x1={12+7.5*Math.cos(a*Math.PI/180)} y1={12+7.5*Math.sin(a*Math.PI/180)}
                          x2={12+9.5*Math.cos(a*Math.PI/180)} y2={12+9.5*Math.sin(a*Math.PI/180)}
                          stroke="#CA8A04" strokeWidth="1.6" strokeLinecap="round" />
                      ))}
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>26°C</span>
                    <span style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500 }}>Güneşli</span>
                  </div>
                  <HealthRing score={92} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#EBEBEA', margin: '0 20px' }} />

            {/* ── Layer Selector ── */}
            <div style={{ padding: '13px 0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Veri Katmanı</span>
                <span style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 600 }}>{currentLayerLabel}</span>
              </div>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '2px 20px 4px', scrollbarWidth: 'none' }}>
                {DATA_LAYERS.map(l => {
                  const active = activeLayer === l.id
                  return (
                    <button key={l.id} onClick={() => { setActiveLayer(l.id); setSelectedZone(null) }}
                      style={{
                        flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                        border: active ? '1.5px solid #16A34A' : '1.5px solid #E0E3DF',
                        background: active ? '#16A34A' : '#FFFFFF',
                        color: active ? '#FFFFFF' : '#374151',
                        fontSize: 12, fontWeight: active ? 600 : 500,
                        cursor: 'pointer', transition: 'all 0.18s ease',
                        whiteSpace: 'nowrap', letterSpacing: '-0.1px',
                      }}>
                      {l.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Satellite Field Map ── */}
            <div style={{ margin: '0 14px', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 22px rgba(0,0,0,0.13)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'relative', height: 228, background: '#1A3120' }}>
                {/* Satellite-style field map — drawn entirely in SVG */}
                <svg viewBox="0 0 360 220" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }}>
                  <defs>
                    {/* Vine-row stripe patterns, one per zone with a unique angle */}
                    {([7,9,11,6,8,10,5,7,9,12] as number[]).map((angle, i) => (
                      <pattern key={i} id={`vr${i}`} x="0" y="0" width="5" height="5"
                        patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
                        <line x1="0" y1="2.5" x2="5" y2="2.5" stroke="rgba(0,0,0,0.22)" strokeWidth="1.1" />
                      </pattern>
                    ))}
                    {/* Per-zone clip paths */}
                    {ZONE_PATHS.map((path, i) => (
                      <clipPath key={i} id={`zc${i}`}><path d={path} /></clipPath>
                    ))}
                    {/* Edge vignette */}
                    <radialGradient id="vig" cx="50%" cy="50%" r="72%">
                      <stop offset="10%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.40)" />
                    </radialGradient>
                    {/* Faint measurement grid */}
                    <pattern id="mgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* 1 · Base backdrop */}
                  <rect width="360" height="220" fill="#192E1D" />

                  {/* 2 · Zone terrain fills — natural colour variation */}
                  {(['#2E5030','#284A2A','#325434','#2A4C2C','#305232',
                     '#2E5030','#325234','#2A4E2C','#305030','#284E2A'] as string[]).map((c, i) => (
                    <path key={i} d={ZONE_PATHS[i]} fill={c} />
                  ))}

                  {/* 3 · Vine-row texture — clipped per zone */}
                  {ZONE_PATHS.map((_, i) => (
                    <rect key={i} width="360" height="220"
                      fill={`url(#vr${i})`} clipPath={`url(#zc${i})`} />
                  ))}

                  {/* 4 · Growth-variation tint patches */}
                  <path d="M118,0 L160,0 L162,44 L120,46 Z"        fill="rgba(80,120,40,0.18)" />
                  <path d="M0,130 L60,128 L58,162 L0,162 Z"         fill="rgba(60,100,30,0.20)" />
                  <path d="M248,90 L360,95 L360,132 L250,127 Z"     fill="rgba(90,130,50,0.16)" />
                  <path d="M125,160 L200,156 L198,212 L123,216 Z"   fill="rgba(50,90,25,0.22)" />
                  <path d="M202,155 L246,152 L242,202 L200,206 Z"   fill="rgba(110,140,60,0.15)" />

                  {/* 5 · Zone boundary roads / access ditches */}
                  <path d="M0,92 L122,88 L246,82 L360,88"  stroke="#141E12" strokeWidth="5.5" fill="none" />
                  <path d="M0,162 L124,158 L248,154 L360,158" stroke="#141E12" strokeWidth="5.5" fill="none" />
                  <path d="M122,0 L122,88 L124,158 L120,220"  stroke="#141E12" strokeWidth="5.5" fill="none" />
                  <path d="M244,0 L246,82 L248,154 L244,220"  stroke="#141E12" strokeWidth="5.5" fill="none" />
                  {/* Dirt-track highlight */}
                  <path d="M0,92 L122,88 L246,82 L360,88"  stroke="#7A8E58" strokeWidth="1.4" fill="none" opacity="0.38" />
                  <path d="M0,162 L124,158 L248,154 L360,158" stroke="#7A8E58" strokeWidth="1.4" fill="none" opacity="0.38" />
                  <path d="M122,0 L122,88 L124,158 L120,220"  stroke="#7A8E58" strokeWidth="1.4" fill="none" opacity="0.38" />
                  <path d="M244,0 L246,82 L248,154 L244,220"  stroke="#7A8E58" strokeWidth="1.4" fill="none" opacity="0.38" />

                  {/* 6 · Perimeter hedge / tree line */}
                  {([
                    [18,0,28,8],[68,0,26,8],[128,0,24,7],[192,0,26,7],[260,0,28,8],[320,0,24,7],
                    [18,220,28,8],[72,220,26,8],[138,220,24,7],[198,220,26,7],[268,220,28,8],[325,220,24,7],
                    [0,22,8,22],[0,70,8,20],[0,118,8,24],[0,170,8,20],
                    [360,18,8,22],[360,68,8,20],[360,120,8,24],[360,170,8,20],
                  ] as [number,number,number,number][]).map(([cx,cy,rx,ry], idx) => (
                    <ellipse key={idx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#182C16" opacity="0.88" />
                  ))}

                  {/* 7 · Irrigation channel (runs east–west near bottom of B-row) */}
                  <path d="M0,148 L122,143 L248,139 L360,143" stroke="#162A38" strokeWidth="4" fill="none" />
                  <path d="M0,148 L122,143 L248,139 L360,143" stroke="#2D7A9A" strokeWidth="1.2" fill="none" opacity="0.65" />
                  <circle cx="122" cy="143" r="3.5" fill="#2D7A9A" opacity="0.65" />
                  <circle cx="248" cy="139" r="3.5" fill="#2D7A9A" opacity="0.65" />

                  {/* 8 · Reservoir / holding pond in zone C3 */}
                  <ellipse cx="222" cy="183" rx="15" ry="9"   fill="#1C3E52" />
                  <ellipse cx="222" cy="183" rx="11" ry="6.5" fill="#2A607A" opacity="0.85" />
                  <ellipse cx="220" cy="181" rx="5"  ry="3"   fill="#3A85A0" opacity="0.50" />

                  {/* 9 · Farmhouse complex — zone A1 corner */}
                  <rect x="12" y="8"  width="22" height="15" rx="1"   fill="#3C2A18" />
                  <rect x="10" y="5"  width="26" height="6"  rx="1"   fill="#4E3824" />
                  <rect x="12" y="22" width="22" height="4"  rx="1"   fill="rgba(0,0,0,0.35)" />
                  <rect x="37" y="13" width="11" height="9"  rx="0.5" fill="#362215" opacity="0.9" />
                  <path d="M24,23 L24,88" stroke="#4A5835" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.45" />

                  {/* 10 · Edge vignette */}
                  <rect width="360" height="220" fill="url(#vig)" />

                  {/* 11 · Measurement grid overlay */}
                  <rect width="360" height="220" fill="url(#mgrid)" />

                  {/* 12 · Data-layer status overlays */}
                  {ZONE_PATHS.map((path, i) => {
                    const s = statuses[i]
                    const cfg = STATUS_CFG[s]
                    const sel = selectedZone === i
                    return (
                      <g key={i} onClick={() => setSelectedZone(sel ? null : i)} style={{ cursor: 'pointer' }}>
                        <path d={path}
                          fill={sel ? cfg.selFill : cfg.fill}
                          stroke={cfg.stroke}
                          strokeWidth={sel ? 2.5 : 1.5}
                          style={{ transition: 'fill 0.18s ease, stroke-width 0.18s ease' }}
                        />
                      </g>
                    )
                  })}

                  {/* 13 · Zone labels */}
                  {ZONE_LABELS.map((z, i) => {
                    const sel = selectedZone === i
                    return (
                      <text key={i} x={z.cx} y={z.cy + 4} textAnchor="middle"
                        style={{
                          fontSize: 9.5, fontWeight: 700,
                          fill: sel ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
                          fontFamily: "'DM Mono', monospace",
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.70))',
                          pointerEvents: 'none', userSelect: 'none',
                        }}>
                        {z.label}
                      </text>
                    )
                  })}

                  {/* 14 · Crosshair */}
                  <line x1="174" y1="106" x2="186" y2="106" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
                  <line x1="180" y1="100" x2="180" y2="112" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
                  <circle cx="180" cy="106" r="4.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                </svg>

                {/* Layer badge */}
                <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)', borderRadius: 9, padding: '3px 9px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                    {currentLayerLabel}
                  </span>
                </div>

                {/* North indicator */}
                <div style={{ position: 'absolute', top: 10, right: 12, width: 28, height: 28, background: 'rgba(0,0,0,0.44)', backdropFilter: 'blur(6px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M7 1L8.8 6H5.2Z" fill="white" />
                    <path d="M7 13L5.2 8H8.8Z" fill="rgba(255,255,255,0.35)" />
                  </svg>
                </div>

                {/* Scale */}
                <div style={{ position: 'absolute', bottom: 11, left: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 42, height: 2, background: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontFamily: "'DM Mono', monospace", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>100m</span>
                </div>

                {/* Selected zone info */}
                {selectedZone !== null && (
                  <div style={{ position: 'absolute', bottom: 11, right: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: 9, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_CFG[statuses[selectedZone]].dot }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'white' }}>
                      Bölge {ZONE_LABELS[selectedZone].label} · {STATUS_CFG[statuses[selectedZone]].label}
                    </span>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div style={{ background: '#FFFFFF', padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F0EE' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  {STATUS_CFG.map((cfg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.dot, opacity: 0.85 }} />
                      <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{cfg.label}</span>
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>10 bölge</span>
              </div>
            </div>

            {/* ── AI Assistant Card ── */}
            <div style={{ margin: '14px 14px 0', background: 'linear-gradient(145deg, #0A2015 0%, #163527 55%, #0D2C1C 100%)', borderRadius: 20, padding: '16px', boxShadow: '0 6px 28px rgba(10,32,21,0.30)' }}>
              <div style={{ display: 'flex', gap: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: 13, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcSparkle on size={19} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.7px', textTransform: 'uppercase' }}>TerraMind AI</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>Bugün 09:38</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.88)', lineHeight: 1.58, margin: '0 0 12px', fontWeight: 400 }}>
                    Güneybatı bölümünde{' '}
                    <span style={{ color: '#FCD34D', fontWeight: 600 }}>azot eksikliği</span>{' '}
                    tespit edildi. Yarın beklenen yağış nedeniyle bugün{' '}
                    <span style={{ color: '#93C5FD', fontWeight: 600 }}>sulama önerilmez</span>.
                    Toprak nemi optimal aralıkta seyrediyor.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: '8px 10px', background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 11, color: '#4ADE80', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.1px' }}>
                      Detaylı Analiz
                    </button>
                    <button style={{ flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 11, color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.1px' }}>
                      Önlem Al
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sensor Data Section ── */}
            <div style={{ padding: '18px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0D1A0F', letterSpacing: '-0.3px' }}>Sensör Verileri</span>
              <span style={{ fontSize: 12.5, color: '#16A34A', fontWeight: 600, cursor: 'pointer' }}>Tümünü gör</span>
            </div>

            {/* 2-col sensor grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 14px' }}>
              {SENSOR_CARDS.map(card => {
                const cfg = STATUS_CFG[card.status]
                const trendPos = card.trend.startsWith('+')
                const trendNeu = card.trend === '0.0'
                const trendColor = trendNeu ? '#9CA3AF' : trendPos ? '#16A34A' : '#DC2626'
                const trendLabel = trendNeu ? '— sabit' : `${card.trend}% / 24s`
                return (
                  <div key={card.id} style={{
                    background: '#FFFFFF', borderRadius: 17, padding: '13px 13px 11px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    border: `1px solid ${card.status === 2 ? 'rgba(239,68,68,0.18)' : card.status === 1 ? 'rgba(234,179,8,0.18)' : '#EAECEB'}`,
                    cursor: 'pointer', transition: 'transform 0.15s ease',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                      <SensorSymbol symbol={card.symbol} iconBg={card.iconBg} iconColor={card.iconColor} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3.5, background: cfg.bg, borderRadius: 8, padding: '3px 7px' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: cfg.text }}>{cfg.label}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginBottom: 1.5 }}>{card.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                      <span style={{ fontSize: 23, fontWeight: 700, color: '#0D1A0F', letterSpacing: '-0.6px', fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>
                        {card.value}
                      </span>
                      {card.unit && <span style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500 }}>{card.unit}</span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: trendColor, fontWeight: 600, marginTop: 4 }}>
                      {trendLabel}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Irrigation Status Card ── */}
            <div style={{ margin: '12px 14px 0', background: '#FFFFFF', borderRadius: 17, padding: '14px 15px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #EAECEB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C12 2 5 9.5 5 14.5C5 18.09 8.13 21 12 21C15.87 21 19 18.09 19 14.5C19 9.5 12 2 12 2Z"
                        fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M8.5 15.5C8.5 14.12 9.62 13 11 13" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0D1A0F', letterSpacing: '-0.2px' }}>Sulama Durumu</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1.5 }}>Sonraki çalışma: Yarın 06:00</div>
                  </div>
                </div>
                <div style={{ background: '#DCFCE7', borderRadius: 10, padding: '5px 11px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D' }}>Aktif</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ background: '#F2F4F2', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #15803D, #4ADE80)', borderRadius: 6, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>Kapsama alanı</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace" }}>78%</span>
              </div>
            </div>

            {/* ── Quick Stats row ── */}
            <div style={{ margin: '12px 14px 0', display: 'flex', gap: 10 }}>
              {[
                { label: 'Toplam Alan', value: '42', unit: 'dönüm', icon: '🌿' },
                { label: 'Aktif Sensör', value: '24', unit: 'adet', icon: '📡' },
                { label: 'Son Sulama', value: '12s', unit: 'önce', icon: '⏱️' },
              ].map(stat => (
                <div key={stat.label} style={{ flex: 1, background: '#FFFFFF', borderRadius: 15, padding: '11px 10px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #EAECEB', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{stat.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1A0F', letterSpacing: '-0.4px', fontFamily: "'DM Mono', monospace" }}>{stat.value}<span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginLeft: 2 }}>{stat.unit}</span></div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ height: 16 }} />
          </div>

          {/* ── Floating AI Button ── */}
          <button
            onClick={() => setActiveNav('ai')}
            style={{
              position: 'absolute', bottom: 84, right: 18,
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(140deg, #15803D 0%, #22C55E 100%)',
              border: 'none',
              boxShadow: '0 4px 18px rgba(21,128,61,0.42), 0 1px 4px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 20,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
          >
            <IcSparkle on size={23} />
          </button>

          {/* ── Bottom Navigation ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 72, background: 'rgba(248,249,247,0.97)',
            backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'flex-start', paddingTop: 8,
            zIndex: 10,
          }}>
            {navItems.map(item => {
              const on = activeNav === item.id
              return (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, border: 'none', background: 'transparent', cursor: 'pointer', padding: '3px 4px' }}>
                  <item.Icon on={on} />
                  <span style={{ fontSize: 9.5, fontWeight: on ? 700 : 400, color: on ? '#15803D' : '#9CA3AF', letterSpacing: '-0.1px', lineHeight: 1 }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}
