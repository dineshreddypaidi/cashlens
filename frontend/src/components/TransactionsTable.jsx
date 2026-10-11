import React from "react";
import { Tag } from "lucide-react";
import { fmtCurrency } from "../utils/format";
import { useCurrency } from "./utils/useCurrency";

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

function TypePill({ type }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        type === "expense"
          ? "bg-red-50 text-loss border border-red-100"
          : "bg-emerald-50 text-profit border border-emerald-100"
      }`}
    >
      {type}
    </span>
  );
}

function DescriptionTag({ description }) {
  if (!description) return <div className="text-neutral-400 text-xs">—</div>;
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 border border-neutral-200">
      <Tag className="w-3 h-3 shrink-0 text-neutral-500" />
      <span className="text-neutral-600 break-words">{description}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <>
      <div className="text-lg font-medium mb-2">No records found</div>
      <div className="text-sm">
        There are no transactions in this range. Try adjusting the date filters.
      </div>
    </>
  );
}

export default function TransactionsTable({ rows = [], loading = false }) {
  const { currency } = useCurrency();

  return (
    <div className="flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="shrink-0 px-4 py-3 flex items-center justify-between gap-3 border-b border-neutral-200">
        <div className="text-sm text-neutral-600 font-medium">Transactions</div>
        <div className="text-sm text-neutral-500 shrink-0">
          {loading ? "Loading…" : `${rows.length} total`}
        </div>
      </div>

      {/* Phones: one card per row, so nothing scrolls sideways. */}
      <ul className="sm:hidden divide-y divide-neutral-100 overflow-y-auto overscroll-contain max-h-[65vh]">
        {rows.map((t) => (
          <li key={t.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-neutral-500 whitespace-nowrap">
                {formatDate(t.date)}
              </div>
              <TypePill type={t.transaction_type} />
            </div>

            <div className="mt-1 font-medium text-neutral-800 break-words">
              {t.category}
            </div>
            {t.note && (
              <div className="text-xs text-neutral-500 mt-0.5 break-words">{t.note}</div>
            )}

            <div className="mt-2 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <DescriptionTag description={t.description} />
              </div>
              <div
                className={`font-semibold tabular-nums whitespace-nowrap ${
                  t.transaction_type === "expense" ? "text-loss" : "text-profit"
                }`}
              >
                {fmtCurrency(t.amount, currency)}
              </div>
            </div>
          </li>
        ))}

        {!rows.length && !loading && (
          <li className="px-4 py-12 text-center text-neutral-500">
            <EmptyState />
          </li>
        )}
      </ul>

      {/* Tablet and up: a real table. The container scrolls on Y, which is what
          makes the sticky header actually stick. border-separate is required —
          with collapsed borders a sticky thead loses its bottom border. */}
      <div className="hidden sm:block relative overflow-auto overscroll-contain max-h-[60vh]">
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 border-b border-neutral-200 whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-3 border-b border-neutral-200">Category</th>
              <th className="text-left px-4 py-3 border-b border-neutral-200">Description</th>
              <th className="text-right px-4 py-3 border-b border-neutral-200 whitespace-nowrap">Amount</th>
              <th className="text-left px-4 py-3 border-b border-neutral-200 whitespace-nowrap">Type</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((t, i) => (
              <tr
                key={t.id}
                className={`group hover:bg-neutral-50 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                } cursor-default`}
              >
                <td className="px-4 py-3 border-b border-neutral-100 text-neutral-500 whitespace-nowrap">
                  {formatDate(t.date)}
                </td>

                <td className="px-4 py-3 border-b border-neutral-100 min-w-0">
                  <div className="font-medium text-neutral-800 break-words">{t.category}</div>
                  {t.note && (
                    <div className="text-xs text-neutral-500 mt-1 break-words">{t.note}</div>
                  )}
                </td>

                <td className="px-4 py-3 border-b border-neutral-100 min-w-0">
                  <DescriptionTag description={t.description} />
                </td>

                <td
                  className={`px-4 py-3 border-b border-neutral-100 text-right font-medium tabular-nums whitespace-nowrap ${
                    t.transaction_type === "expense" ? "text-loss" : "text-profit"
                  }`}
                >
                  {fmtCurrency(t.amount, currency)}
                </td>

                <td className="px-4 py-3 border-b border-neutral-100 text-neutral-600 whitespace-nowrap">
                  <TypePill type={t.transaction_type} />
                </td>
              </tr>
            ))}

            {!rows.length && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
