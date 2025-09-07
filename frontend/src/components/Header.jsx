import React, { useState, useEffect } from "react";

export default function Header() {
  // initialize from sessionStorage, default to INR 
  const [currency, setCurrency] = useState(() => {
    try { 
      return sessionStorage.getItem("currency") || "INR"; 
    } catch (e) {
       return "INR"; // fallback for environments without sessionStorage
    } });


    useEffect(() => {
       try { 
        sessionStorage.setItem("currency", currency); 
       } catch (e) { 
        return e;
     } 
    }, [currency]);



  const currencySymbols = {
    INR: "₹",
    USD: "$",
  };

  const handleChange = (e) => setCurrency(e.target.value);

  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-zinc-300/70 border-b border-neutral-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center font-bold">
            {currencySymbols[currency]}
          </div>
          <div>
            <div className="text-xl font-semibold leading-tight">CASH LENS</div>
            <div className="text-xs text-neutral-500">Income • Expenses</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
