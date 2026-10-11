import React from 'react';
import { TrendingUp, Wallet, PiggyBank, TrendingDown, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';

const icons = { trending: TrendingUp, wallet: Wallet, piggy: PiggyBank, bending: TrendingDown, debt : BanknoteArrowDown, investment : BanknoteArrowUp };

export default function Stat({ label, value, icon = 'trending', color = 'text-profit' }) {

  const Icon = icons[icon] || TrendingUp;

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl p-3 sm:p-4 bg-white/60 border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-neutral-950/90 truncate">{label}</div>
          <div
            title={value}
            className={`text-base min-[414px]:text-lg lg:text-2xl font-semibold mt-1 truncate tabular-nums ${color}`}
          >
            {value}
          </div>
        </div>

        <div className="shrink-0 p-2 sm:p-3 rounded-lg hidden min-[414px]:flex items-center justify-center bg-neutral-100 border border-neutral-200 shadow-sm">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}
