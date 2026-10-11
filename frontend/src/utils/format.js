import { getRate } from "../data/adapters";

const CURRENCY_LOCALE_MAP = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "en-IE",
};

const isValidCurrency = (c) => typeof c === "string" && /^[A-Za-z]{3}$/.test(c);

const guessLocaleForCurrency = (currencyCode) => {
  if (!currencyCode) return "en-IN";
  const code = currencyCode.toUpperCase();
  return CURRENCY_LOCALE_MAP[code] || "en-IN";
};

const FALLBACK_USDINR = 87.63;

let exchange_rate_usdinr = FALLBACK_USDINR;
let ratePromise = null;

/**
 * Fetches the USD/INR rate once per session through the active adapter (the
 * backend proxies it, so no API key ships to the client). Resolves either way:
 * on failure the fallback above stays in place, which is also the normal path
 * for the offline Android build.
 */
export function fetchRate() {
  if (!ratePromise) {
    ratePromise = getRate()
      .then((rate) => {
        if (Number.isFinite(rate) && rate > 0) {
          exchange_rate_usdinr = rate;
        }
        return exchange_rate_usdinr;
      })
      .catch(() => exchange_rate_usdinr);
  }
  return ratePromise;
}

export const fmtCurrency = (n, currency) => {
  const safeCurrency = isValidCurrency(currency)
    ? currency.toUpperCase()
    : "INR";
  const locale = guessLocaleForCurrency(safeCurrency);

  // Coerce before any arithmetic: an undefined amount is routine during load
  // and used to divide through to NaN, printing "$NaN".
  let num = Number(n) || 0;

  let fractions = 0;
  if (safeCurrency === "USD") {
    num /= exchange_rate_usdinr;
    fractions = 2;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: fractions,
    }).format(num);
  } catch {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  }
};

/**
 * Short axis labels. Full INR amounts are too wide for a chart gutter on a
 * phone and get clipped, so ticks use compact notation (1.2Cr, 75L) while
 * tooltips keep the exact figure.
 */
export const fmtCompact = (n) => {
  const num = Number(n) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  } catch {
    return String(num);
  }
};
