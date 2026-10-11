import React from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./AddRecordOps";

export default function DescGraphSelector( { incomeCategory, setIncomeCategory, expenseCategory, setExpenseCategory } ) {
  const incomeKeys = Object.keys(INCOME_CATEGORIES);
  const expenseKeys = Object.keys(EXPENSE_CATEGORIES);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full px-0 sm:px-4 py-3 border-0 rounded-lg mb-3">
      {/* Left: Income Category */}
      <div className="flex items-center gap-2 min-w-0">
        <label htmlFor="income" className="shrink-0 text-sm font-medium text-gray-700">
          Income:
        </label>
        <select
          id="income"
          value={incomeCategory}
          onChange={(e) => setIncomeCategory(e.target.value)}
          className="border border-neutral-200 rounded-2xl p-2 min-h-11 w-full min-w-0 sm:w-48 text-base sm:text-sm"
        >
          {incomeKeys.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Expense Category */}
      <div className="flex items-center gap-2 min-w-0">
        <label htmlFor="expense" className="shrink-0 text-sm font-medium text-gray-700">
          Expense:
        </label>
        <select
          id="expense"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          className="border border-neutral-200 rounded-2xl p-2 min-h-11 w-full min-w-0 sm:w-48 text-base sm:text-sm"
        >
          {expenseKeys.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
