import React from "react";

/**
 * The card chrome shared by all seven charts. Previously duplicated verbatim
 * in each one, including a hard-coded h-72 well that never scaled.
 */
export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-4">
      <div className="text-sm text-neutral-600 mb-2">{title}</div>
      <div className="h-64 sm:h-72 lg:h-80">{children}</div>
    </div>
  );
}

/** Shown in place of a chart when there is nothing to plot. */
export function ChartEmpty({ title, message = "No data" }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-4">
      {title && <div className="text-sm text-neutral-600 mb-2">{title}</div>}
      <div className="h-64 sm:h-72 lg:h-80 grid place-items-center text-sm text-neutral-500">
        {message}
      </div>
    </div>
  );
}
