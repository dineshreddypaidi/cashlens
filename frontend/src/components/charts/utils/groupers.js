export function groupByDate(txns) {
  const map = new Map();
  txns.forEach((t) => {
    const key = t.date;
    if (!map.has(key)) map.set(key, { date: key, Income: 0, Expenses: 0 });
    const row = map.get(key);
    if (t.transaction_type === "income") row.Income += t.amount;
    else row.Expenses += t.amount;
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function SavingsPerDay(txns) {
  let day_txns = groupByDate(txns);

  return day_txns.map(({ date, Income, Expenses }) => ({
    date,
    savings: Income - Expenses,
  }));
}

export function groupByMonth(txns) {
  const map = new Map();
  txns.forEach((t) => {
    const key = t.date.slice(0, 7); // YYYY-MM
    if (!map.has(key)) map.set(key, { month: key, Income: 0, Expenses: 0 });
    const row = map.get(key);
    if (t.transaction_type === "income") row.Income += t.amount;
    else row.Expenses += t.amount;
  });
  return Array.from(map.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}

export function totalGroup(txns) {
  const income = txns
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = txns
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const totals = { income, expenses };
  return totals;
}

export function expensesGroup(txns) {
  const map = new Map();
  txns.forEach((t) => {
    if (t.transaction_type !== "expense") return; // only expenses
    if (!map.has(t.category)) {
      map.set(t.category, { name: t.category, value: 0 });
    }
    map.get(t.category).value += t.amount;
  });

  return Array.from(map.values());
}

export function incomeGroup(txns) {
  const map = new Map();
  txns.forEach((t) => {
    if (t.transaction_type !== "income") return;
    if (!map.has(t.category)) {
      map.set(t.category, { name: t.category, value: 0 });
    }
    map.get(t.category).value += t.amount;
  });

  return Array.from(map.values());
}

export function groupByDescription(categories, categoryName, transactions) {
  if (!categories[categoryName]) return [];

  const result = categories[categoryName].map((desc) => ({
    name: desc,
    value: 0,
  }));

  const lookup = Object.fromEntries(result.map((r) => [r.name, r]));

  for (const txn of transactions) {
    if (lookup[txn.description]) {
      lookup[txn.description].value += txn.amount;
    }
  }

  return result.filter((r) => r.value > 0);
}
