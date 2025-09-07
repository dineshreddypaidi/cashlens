import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function formatShortDate(d) {
  if (!d && d !== 0) return "";
  const parsed = new Date(d);
  if (isNaN(parsed)) return String(d);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

export function DailyCashflowChart({ data }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Daily Cashflow</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatShortDate} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="Income" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}