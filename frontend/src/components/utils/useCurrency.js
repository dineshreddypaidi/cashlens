import { createContext, useContext } from "react";

/**
 * Context and hook live apart from the provider component: a file that exports
 * both components and non-components breaks React Fast Refresh.
 */
export const CurrencyContext = createContext(undefined);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside a CurrencyProvider");
  }
  return ctx;
}
