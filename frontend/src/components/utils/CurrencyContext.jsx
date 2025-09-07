// CurrencyContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return sessionStorage.getItem("currency") || "INR";
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem("currency") || "INR";
      if (stored !== currency) setCurrency(stored);
    }, 500);
    return () => clearInterval(interval);
  }, [currency]);

  // sync when user changes currency in-app
  const updateCurrency = (newCurrency) => {
    sessionStorage.setItem("currency", newCurrency);
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// easy hook
export function useCurrency() {
  return useContext(CurrencyContext);
}
