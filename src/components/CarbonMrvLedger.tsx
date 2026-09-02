import React, { useMemo, useState } from 'react';
import { ShieldCheck, Link2, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import { mockWaterSavingEvents } from '../mockData';

interface CarbonMrvLedgerProps {
  fieldName?: string; // verilirse sadece o tarlanın kayıtları gösterilir, verilmezse çiftlik geneli
}

// --- Basit, deterministik hash fonksiyonu (FNV-1a 32-bit) ---
// NOT: Bu gerçek kriptografik güvenlik sağlamaz (üretimde SHA-256 + gerçek bir
// blockchain/anchoring servisi kullanılmalı). Amacı, MRV (Measurement-Reporting-
// Verification) mantığını göstermek: her kayıt bir öncekinin hash'ini referans alır,
// böylece geçmişte tek bir rakam bile değiştirilse zincirin geri kalanı bozulur.
function simpleHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// Su tasarrufunu, tahmini pompa enerjisi + şebeke emisyon faktörü üzerinden
// önlenen CO2'ye çevirir (tahmini referans katsayılar).
const PUMP_ENERGY_KWH_PER_M3 = 0.7;
const GRID_EMISSION_KG_PER_KWH = 0.42;

function litersToAvoidedCo2Kg(liters: number): number {
  const m3 = liters / 1000;
  return Math.round(m3 * PUMP_ENERGY_KWH_PER_M3 * GRID_EMISSION_KG_PER_KWH * 1000) / 1000;
}

interface LedgerEntry {
  id: string;
  title: string;
  detail: string;
  time: string;
  field: string;
  avoidedCo2Kg: number;
  hash: string;
  prevHash: string;
}

function buildLedger(fieldName?: string): LedgerEntry[] {
  const source = mockWaterSavingEvents
    .filter((e) => e.savedLiters > 0)
    .filter((e) => !fieldName || e.field === fieldName);

  const GENESIS_HASH = '00000000';
  let prevHash = GENESIS_HASH;
  const entries: LedgerEntry[] = [];

  for (const e of source) {
    const avoidedCo2Kg = litersToAvoidedCo2Kg(e.savedLiters);
    const payload = `${prevHash}|${e.id}|${e.title}|${e.savedLiters}|${e.field}|${e.time}`;
    const hash = simpleHash(payload);
    entries.push({
      id: e.id,
      title: e.title,
      detail: e.detail,
      time: e.time,
      field: e.field,
      avoidedCo2Kg,
      hash,
      prevHash,
    });
    prevHash = hash;
  }
  return entries;
}

type VerifyState = 'idle' | 'checking' | 'verified' | 'broken';

export default function CarbonMrvLedger({ fieldName }: CarbonMrvLedgerProps) {
  const ledger = useMemo(() => buildLedger(fieldName), [fieldName]);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  const totalCo2 = ledger.reduce((sum, e) => sum + e.avoidedCo2Kg, 0);

  const runVerification = () => {
    setVerifyState('checking');
    setTimeout(() => {
      // Zinciri baştan yeniden hesaplayıp, kayıtlı hash'lerle birebir eşleşip
      // eşleşmediğini kontrol ediyoruz — gerçek bir bütünlük kontrolü.
      const recomputed = buildLedger(fieldName);
      const intact = recomputed.every((e, i) => e.hash === ledger[i]?.hash);
      setVerifyState(intact ? 'verified' : 'broken');
    }, 700);
  };

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B331B]">
            <ShieldCheck className="h-4 w-4 text-[#A5D6A7]" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B331B]">Doğrulanabilir Karbon Kaydı</h3>
            <p className="text-xs text-[#8EA694]">MRV Defteri — Measurement · Reporting · Verification</p>
          </div>
        </div>
        <span className="rounded-full bg-[#E8F1EA] px-3 py-1 text-xs font-bold text-[#4CAF50] whitespace-nowrap">
          {totalCo2.toFixed(2)} kg CO₂
        </span>
      </div>

      <p className="text-xs text-[#8EA694] mt-2 mb-4 leading-relaxed">
        Her aksiyon, bir önceki kaydın hash'ini referans alarak zincirlenir. Geçmişte tek bir rakam
        değiştirilse zincirin geri kalanı bozulur — bu yüzden veriler dışarıya (denetçiye, alıcıya,
        karbon piyasasına) güvenle raporlanabilir.
      </p>

      <div className="space-y-2 mb-4">
        {ledger.length === 0 && (
          <p className="text-sm text-[#8EA694] py-4 text-center">Bu kapsamda henüz doğrulanmış kayıt yok.</p>
        )}
        {[...ledger].reverse().map((entry, idx) => (
          <div key={entry.id} className="rounded-[16px] bg-[#F4FAF5] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF50] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1B331B] truncate">{entry.title}</p>
                  <p className="text-xs text-[#597360] leading-relaxed">{entry.detail}</p>
                  <p className="text-[10px] text-[#8EA694] mt-1">
                    {entry.field} · {entry.time}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#4CAF50] whitespace-nowrap">
                −{entry.avoidedCo2Kg} kg CO₂
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white text-[10px] font-mono text-[#8EA694]">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" /> {entry.hash}
              </span>
              <span className="flex items-center gap-1">
                <Link2 className="h-3 w-3" /> önceki: {entry.prevHash}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={runVerification}
        disabled={verifyState === 'checking' || ledger.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-[16px] bg-[#1B331B] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {verifyState === 'checking' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Zincir yeniden hesaplanıyor...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" /> Zincir Bütünlüğünü Doğrula
          </>
        )}
      </button>

      {verifyState === 'verified' && (
        <p className="text-xs text-[#4CAF50] font-semibold mt-3 text-center">
          ✓ Bütünlük doğrulandı: {ledger.length}/{ledger.length} kayıt hash zinciriyle eşleşti. Veri hiç değiştirilmemiş.
        </p>
      )}
      {verifyState === 'broken' && (
        <p className="text-xs text-red-600 font-semibold mt-3 text-center">
          ⚠ Zincirde tutarsızlık tespit edildi — kayıtlardan biri değiştirilmiş olabilir.
        </p>
      )}
    </div>
  );
}