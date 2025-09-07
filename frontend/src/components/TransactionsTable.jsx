import React from "react";
import { Tag, Pencil } from "lucide-react";
import { fmtCurrency } from "../utils/format";
import { useCurrency } from "./utils/CurrencyContext";

function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function TransactionsTable({ rows = [] }) {
  const { currency } = useCurrency();

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600 font-medium">Transactions</div>
        <div className="text-sm text-neutral-500">{rows.length} total</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Type</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((t, i) => (
              <tr
                key={t.id}
                className={`group border-t border-neutral-100 hover:bg-neutral-50 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                } cursor-default`}
              >
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap w-36">
                  {formatDate(t.date)}
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-800">{t.category}</div>
                  {t.note && (
                    <div className="text-xs text-neutral-500 mt-1">{t.note}</div>
                  )}
                </td>

                <td className="px-4 py-3 w-36">
                  {t.description ? (
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 border border-neutral-200">
                      <Tag className="w-3 h-3 text-neutral-500" />
                      <span className="text-neutral-600">{t.description}</span>
                    </div>
                  ) : (
                    <div className="text-neutral-400 text-xs">—</div>
                  )}
                </td>

                <td
                  className={`px-4 py-3 text-right font-medium ${
                    t.transaction_type === "expense" ? "text-loss" : "text-profit"
                  }`}
                >
                  {fmtCurrency(t.amount, currency)}
                </td>

                <td className="px-4 py-3 capitalize text-neutral-600 w-28">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      t.transaction_type === "expense"
                        ? "bg-red-50 text-loss border border-red-100"
                        : "bg-emerald-50 text-profit border border-emerald-100"
                    }`}
                  >
                    {t.transaction_type}
                  </span>
                </td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  <div className="text-lg font-medium mb-2">No records found</div>
                  <div className="text-sm">
                    There are no transactions in this range. Try adjusting the date
                    filters.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
