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

let exchange_rate_usdinr = 87.63;

const api_key = "d649263e33d299c04cc049a2";

fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/USD/INR`)
  .then((res) => res.json())
  .then((data) => {
    if (data?.conversion_rate) {
      exchange_rate_usdinr = data.conversion_rate;
    }
  })
  .catch((err) => {
    console.error("Error fetching rate, using fallback:", err);
  });

export const fmtCurrency = (n, currency) => {
  const safeCurrency = isValidCurrency(currency)
    ? currency.toUpperCase()
    : "INR";
  const locale = guessLocaleForCurrency(safeCurrency);

  let fractions = 0;
  if (safeCurrency === "USD") {
    n /= exchange_rate_usdinr;
    fractions = 2;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: fractions,
    }).format(n ?? 0);
  } catch (err) {
    err;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n ?? 0);
  }
};
