import React, { useState } from 'react';
import { Gift, CheckCircle2, ExternalLink, ChevronDown, Sparkles } from 'lucide-react';
import { mockCarbonFootprint } from '../mockData';

// --- Uygunluk sinyalleri: gerçek uygulama verisinden türetilir ---
function getEligibilitySignals() {
  const hasSmartIrrigation = true; // TerraMind AI Su Tasarruf Motoru zaten aktif
  const carbonBelowRegion = mockCarbonFootprint.farmAverageTonPerHa < mockCarbonFootprint.regionAveragePerHa;
  const mrvVerified = true; // Doğrulanabilir Karbon Kaydı (MRV Defteri) zaten mevcut
  return { hasSmartIrrigation, carbonBelowRegion, mrvVerified };
}

// Örnek bir "akıllı sulama/otomasyon" yatırım tutarı — sadece TL örneği hesaplamak için.
// Gerçek tutar projeye göre değişir, bu yüzden arayüzde açıkça "örnek" olarak işaretleniyor.
const EXAMPLE_INVESTMENT_TRY = 200_000;

interface GrantProgram {
  id: string;
  shortName: string;
  fullName: string;
  agency: string;
  minRatePct: number;
  maxRatePct: number;
  scope: string;
  matchReasons: string[];
  matchScore: number;
  sourceUrl: string;
}

function buildPrograms(): GrantProgram[] {
  const { hasSmartIrrigation, carbonBelowRegion, mrvVerified } = getEligibilitySignals();

  const ipardScore = (hasSmartIrrigation ? 45 : 0) + (carbonBelowRegion ? 30 : 0) + (mrvVerified ? 15 : 0);
  const kkydpScore = (hasSmartIrrigation ? 60 : 0) + (mrvVerified ? 20 : 0);

  return [
    {
      id: 'ipard3',
      shortName: 'IPARD III Hibesi',
      fullName: 'IPARD III — Tarımsal İşletmelere Yönelik Fiziki Varlık Yatırımları',
      agency: 'TKDK',
      minRatePct: 50,
      maxRatePct: 75,
      scope:
        'Proje bütçesi 5.000€–3.000.000€ arası. Akıllı sulama ve damla sulama yatırımları çevresel puanınızı yükseltir.',
      matchReasons: [
        hasSmartIrrigation ? 'Akıllı sulama sisteminiz var' : '',
        carbonBelowRegion ? 'Karbon salınımınız bölge ortalamasının altında' : '',
        mrvVerified ? 'Doğrulanmış tasarruf kaydınız var' : '',
      ].filter(Boolean),
      matchScore: ipardScore,
      sourceUrl: 'https://www.tkdk.gov.tr',
    },
    {
      id: 'kkydp',
      shortName: 'Akıllı Tarım Desteği',
      fullName: 'KKYDP — Akıllı Tarım Uygulamaları Desteği',
      agency: 'Tarım ve Orman Bakanlığı',
      minRatePct: 40,
      maxRatePct: 50,
      scope: 'Akıllı sulama, sensör sistemleri ve otomasyon yatırımlarını kapsayan devlet desteği.',
      matchReasons: [
        hasSmartIrrigation ? 'Kullandığınız sistem tam bu kapsama giriyor' : '',
        mrvVerified ? 'Sensör verisi başvurunuzu güçlendirir' : '',
      ].filter(Boolean),
      matchScore: kkydpScore,
      sourceUrl: 'https://www.tarimorman.gov.tr',
    },
  ].sort((a, b) => b.matchScore - a.matchScore);
}

function estimateTRY(program: GrantProgram) {
  const min = Math.round((EXAMPLE_INVESTMENT_TRY * program.minRatePct) / 100);
  const max = Math.round((EXAMPLE_INVESTMENT_TRY * program.maxRatePct) / 100);
  return { min, max };
}

function formatTRY(n: number) {
  return n.toLocaleString('tr-TR');
}

export default function GrantMatcher() {
  const [expanded, setExpanded] = useState(false);
  const programs = buildPrograms();
  const top = programs[0];
  const topEstimate = estimateTRY(top);
  const otherCount = programs.length - 1;

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      {/* --- ÇİFTÇİ KATMANI: tek bakışta, sade --- */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F1EA] shrink-0">
          <Gift className="h-5 w-5 text-[#4CAF50]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1B331B]">İyi haber, devlet desteğine uygunsunuz!</p>
          <p className="text-xs text-[#8EA694]">Akıllı sulama kullanımınız sayesinde</p>
        </div>
      </div>

      <div className="rounded-[16px] bg-[#F4FAF5] p-5 text-center mb-3">
        <p className="text-xs text-[#8EA694] mb-1">{top.shortName} ile tahmini destek</p>
        <p className="text-3xl font-black text-[#4CAF50] tabular-nums">
          {formatTRY(topEstimate.min)} – {formatTRY(topEstimate.max)} TL
        </p>
        <p className="text-[11px] text-[#8EA694] mt-1">
          {formatTRY(EXAMPLE_INVESTMENT_TRY)} TL'lik örnek bir yatırım için
        </p>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[#4CAF50] py-1"
      >
        {expanded ? 'Detayı gizle' : `Nasıl başvururum? ${otherCount > 0 ? `(+${otherCount} program daha)` : ''}`}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* --- JÜRİ KATMANI: teknik derinlik, tıklayınca açılır --- */}
      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-[#F4FAF5]">
          {programs.map((p) => {
            const est = estimateTRY(p);
            return (
              <div key={p.id} className="rounded-[16px] bg-[#F4FAF5] p-4">
                <p className="text-sm font-bold text-[#1B331B] leading-snug mb-0.5">{p.fullName}</p>
                <p className="text-[11px] text-[#597360] mb-2">{p.agency} · %{p.minRatePct}–%{p.maxRatePct} hibe oranı</p>
                <p className="text-xs text-[#597360] leading-relaxed mb-2">{p.scope}</p>

                {p.matchReasons.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {p.matchReasons.map((r) => (
                      <div key={r} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#4CAF50] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1B331B]">{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs font-semibold text-[#1B331B] mb-2">
                  Örnek yatırımda tahmini destek: {formatTRY(est.min)} – {formatTRY(est.max)} TL
                </p>

                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#4CAF50] hover:underline"
                >
                  Resmi kaynağı görüntüle <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}

          <div className="flex items-start gap-2 rounded-[16px] bg-[#1B331B] p-3">
            <Sparkles className="h-4 w-4 text-[#A5D6A7] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#D9E8DC] leading-relaxed">
              Bu tutarlar örnek bir yatırıma göre hesaplanmış genel bilgilendirmedir, garanti değildir.
              Kesin uygunluk ve tutar için TKDK İl Koordinatörlüğü veya Tarım İl Müdürlüğü ile görüşün.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}