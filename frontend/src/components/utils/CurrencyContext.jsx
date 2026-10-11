import React, { useState, useEffect } from "react";

import { CurrencyContext } from "./useCurrency";
import { fetchRate } from "../../utils/format";

function readStored() {
  try {
    return sessionStorage.getItem("currency") || "INR";
  } catch {
    return "INR"; // environments without sessionStorage
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(readStored);

  // The live USD/INR rate lands asynchronously into a module-level value in
  // format.js. Flipping state here re-renders the tree below so every
  // fmtCurrency() call picks it up instead of keeping the fallback forever.
  const [, setRateLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchRate().then(() => {
      if (mounted) setRateLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // sync when user changes currency in-app
  const updateCurrency = (newCurrency) => {
    try {
      sessionStorage.setItem("currency", newCurrency);
    } catch {
      // ignore: persistence is best-effort
    }
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
