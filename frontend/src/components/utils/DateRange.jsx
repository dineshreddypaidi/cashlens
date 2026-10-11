import React from "react";

export default function DateRange({ start, end, onChange }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="date"
        value={start}
        max={end}
        onChange={(e) => onChange({ start: e.target.value, end })}
        className="flex-1 min-w-0 w-full sm:w-auto bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm"
      />
      <span className="shrink-0 text-neutral-500">—</span>
      <input
        type="date"
        value={end}
        min={start}
        onChange={(e) => onChange({ start, end: e.target.value })}
        className="flex-1 min-w-0 w-full sm:w-auto bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm"
      />
    </div>
  );
}
