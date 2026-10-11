import React, { useMemo } from 'react';
import { HeartHandshake, ShieldCheck} from 'lucide-react';
import { fmtCurrency } from '../utils/format';
import { useCurrency } from "./utils/useCurrency";

export default function MyRule({income = 0,contributed = 0,percent = 1,}) {
    const { currency } = useCurrency();

    const { target, remaining, progress } = useMemo(() => {
        const onePct = (income * percent) / 100;
        const targetVal = onePct; // rule target = one percent of income
        const rem = Math.max(0, targetVal - contributed);
        const prog = targetVal > 0 ? Math.min(100, Math.max(0, (contributed / targetVal) * 100)) : 0;
        
        return {
        onePercent: onePct,
        target: targetVal,
        remaining: rem,
        progress: prog,
        };
    }, [income, contributed, percent]);

   return (
    <div className="bg-zinc-200/40 border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 p-2 rounded-xl bg-neutral-100 border border-neutral-200">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-neutral-900">1% Rule</div>
            <div className="text-xs text-neutral-500">Donate {percent}% of total earnings</div>
          </div>
        </div>

        <div className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs border border-neutral-200 bg-neutral-50 whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>My way of Social service</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 md:items-center gap-5">
        {/* Progress donut */}
        <ProgressDonut progress={progress} label={`${Math.round(progress)}%`} />

        {/* Numbers + actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
            <InfoTile label="Income" value={fmtCurrency(income, currency)} />
            <InfoTile label={`${percent}% Target`} value={fmtCurrency(target, currency)} />
            <InfoTile label="Contributed" value={fmtCurrency(contributed, currency)} accent="text-profit" />
            <InfoTile label="Remaining" value={fmtCurrency(remaining, currency)} accent="text-loss" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, accent }) {
  return (
    <div className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <div className="text-xs text-neutral-500 truncate">{label}</div>
      <div title={value} className={`mt-1 text-base font-semibold truncate tabular-nums ${accent || ''}`}>{value}</div>
    </div>
  );
}

function ProgressDonut({ progress = 0, label = '' }) {
  const clamped = Math.max(0, Math.min(100, Number(progress) || 0));
  const size = 140;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="flex items-center justify-center">
      {/* viewBox (not width/height) is what lets this scale down on a phone. */}
      <svg viewBox={`0 0 ${size} ${size}`} className="block w-32 h-32 sm:w-36 sm:h-36" role="img" aria-label={`${label} of target`}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        {/* Progress — rotated so the arc starts at 12 o'clock. */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="text-profit transition-all duration-500"
        />

        <g>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-neutral-900 text-lg font-semibold">
            {label}
          </text>
          <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" className="fill-neutral-500 text-xs">
            of target
          </text>
        </g>
      </svg>
    </div>
  );
}
