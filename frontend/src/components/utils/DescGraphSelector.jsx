import React from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./AddRecordOps";

export default function DescGraphSelector( { incomeCategory, setIncomeCategory, expenseCategory, setExpenseCategory } ) {
  const incomeKeys = Object.keys(INCOME_CATEGORIES);
  const expenseKeys = Object.keys(EXPENSE_CATEGORIES);

  return (
    <div className="flex justify-between items-center w-full p-4 border-0 rounded-lg mb-3">
      {/* Left: Income Category */}
      <div className="flex items-center gap-2">
        <label htmlFor="income" className="text-sm font-medium text-gray-700">
          Income:
        </label>
        <select
          id="income"
          value={incomeCategory}
          onChange={(e) => setIncomeCategory(e.target.value)}
          className="border rounded-2xl p-2 w-48"
        >
          {incomeKeys.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Expense Category */}
      <div className="flex items-center gap-2">
        <label htmlFor="expense" className="text-sm font-medium text-gray-700">
          Expense:
        </label>
        <select
          id="expense"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          className="border rounded-2xl p-2 w-48"
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
