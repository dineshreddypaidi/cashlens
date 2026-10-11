/**
 * Parity check for the ported accounting rules.
 *
 * Every branch here mirrors `txn_handler` in backend/api/views.py. If the two
 * ever drift, the phone and the server will disagree about the user's money,
 * so this runs as a plain Node script with no test framework:
 *
 *   node src/data/adapters/txnRules.test.mjs
 */
import assert from "node:assert/strict";

import { applyTxnToMainData } from "./txnRules.js";

const ZERO = {
  current_value: 0,
  investments: 0,
  total_debt: 0,
  total_income: 0,
  contributed_one_perc: 0,
};

const cases = [
  {
    name: "income: plain salary moves current_value and total_income",
    txn: { transaction_type: "income", category: "Salary", description: "Bonus", amount: 1000 },
    expect: { current_value: 1000, total_income: 1000 },
  },
  {
    name: "income + Loan: also increases debt",
    txn: { transaction_type: "income", category: "Loan", description: "personal_loan", amount: 500 },
    expect: { current_value: 500, total_income: 500, total_debt: 500 },
  },
  {
    name: "income + Investment_withdraw: decreases investments",
    txn: { transaction_type: "income", category: "Investment_withdraw", description: "Stocks", amount: 300 },
    expect: { current_value: 300, total_income: 300, investments: -300 },
  },
  {
    name: "expense: plain spend only moves current_value",
    txn: { transaction_type: "expense", category: "Food", description: "Tea", amount: 50 },
    expect: { current_value: -50 },
  },
  {
    name: "expense + Debt_Payments: reduces debt",
    txn: { transaction_type: "expense", category: "Debt_Payments", description: "credit_card", amount: 200 },
    expect: { current_value: -200, total_debt: -200 },
  },
  {
    name: "expense + Debt_Payments/intrest_paid: does NOT reduce debt",
    txn: { transaction_type: "expense", category: "Debt_Payments", description: "intrest_paid", amount: 200 },
    expect: { current_value: -200 },
  },
  {
    name: "expense + MyRule: counts toward the 1% contribution",
    txn: { transaction_type: "expense", category: "MyRule", description: "Donated", amount: 90 },
    expect: { current_value: -90, contributed_one_perc: 90 },
  },
  {
    name: "expense + Investments: increases investments",
    txn: { transaction_type: "expense", category: "Investments", description: "Stocks", amount: 700 },
    expect: { current_value: -700, investments: 700 },
  },
];

let failures = 0;

for (const { name, txn, expect } of cases) {
  const want = { ...ZERO, ...expect };
  const got = applyTxnToMainData(ZERO, txn);
  try {
    assert.deepEqual(got, want);
    console.log(`  ok   ${name}`);
  } catch {
    failures += 1;
    console.error(`  FAIL ${name}`);
    console.error(`       want ${JSON.stringify(want)}`);
    console.error(`       got  ${JSON.stringify(got)}`);
  }
}

// Non-numeric and missing fields must not produce NaN in the stored totals.
const dirty = applyTxnToMainData(
  { current_value: "100", investments: null, total_debt: undefined },
  { transaction_type: "expense", category: "Food", amount: "25" }
);
try {
  assert.deepEqual(dirty, { ...ZERO, current_value: 75 });
  console.log("  ok   coerces string/null/undefined inputs without NaN");
} catch {
  failures += 1;
  console.error(`  FAIL coercion guard, got ${JSON.stringify(dirty)}`);
}

// Applying N transactions in sequence must equal the server's running totals.
const sequence = [
  { transaction_type: "income", category: "Salary", description: "Monthly Paycheck", amount: 8500000 },
  { transaction_type: "expense", category: "Investments", description: "Stocks", amount: 2500000 },
  { transaction_type: "income", category: "Loan", description: "personal_loan", amount: 300000 },
  { transaction_type: "expense", category: "MyRule", description: "Donated", amount: 90000 },
  { transaction_type: "expense", category: "Debt_Payments", description: "intrest_paid", amount: 8900 },
];
const running = sequence.reduce(applyTxnToMainData, ZERO);
try {
  assert.deepEqual(running, {
    current_value: 8500000 - 2500000 + 300000 - 90000 - 8900,
    investments: 2500000,
    total_debt: 300000,
    total_income: 8800000,
    contributed_one_perc: 90000,
  });
  console.log("  ok   running totals over a sequence");
} catch {
  failures += 1;
  console.error(`  FAIL running totals, got ${JSON.stringify(running)}`);
}

if (failures) {
  console.error(`\n${failures} failing case(s)`);
  process.exit(1);
}
console.log("\nall accounting rules match the Django handler");
