import React from 'react';
import { TrendingUp, Wallet, PiggyBank, TrendingDown, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';

const icons = { trending: TrendingUp, wallet: Wallet, piggy: PiggyBank, bending: TrendingDown, debt : BanknoteArrowDown, investment : BanknoteArrowUp };

export default function Stat({ label, value, icon = 'trending', color = 'text-profit' }) {

  const Icon = icons[icon] || TrendingUp;

  return (
    <div className="rounded-2xl p-4 bg-white/60 border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-950/90">{label}</div>
          <div className={`text-2xl font-semibold mt-1 ${color}`}>{value}</div>
        </div>

        <div className="p-3 rounded-lg flex items-center justify-center bg-neutral-100 border border-neutral-200 shadow-sm">
          <Icon className={`w-6 h-6`} />
        </div>
      </div>
    </div>
  );
}
