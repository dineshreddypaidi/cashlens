import React from "react";

import { useCurrency } from "./utils/useCurrency";

const currencySymbols = {
  INR: "₹",
  USD: "$",
};

export default function Header() {
  // Single source of truth: CurrencyContext owns the value and persists it to
  // sessionStorage. Header no longer keeps a second copy.
  const { currency, setCurrency } = useCurrency();

  const handleChange = (e) => setCurrency(e.target.value);

  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-zinc-300/70 border-b border-neutral-300 pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-black text-white grid place-items-center font-bold">
            {currencySymbols[currency]}
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-semibold leading-tight truncate">CASH LENS</div>
            <div className="hidden min-[360px]:block text-xs text-neutral-500 truncate">Income • Expenses</div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label htmlFor="currency" className="sr-only">
            Select currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={handleChange}
            className="rounded-lg border border-neutral-200 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-300/70 bg-white"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>
    </header>
  );
}
