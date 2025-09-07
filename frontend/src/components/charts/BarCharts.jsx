import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ReferenceLine, Cell } from 'recharts';

function formatShortDate(d) {
  if (!d && d !== 0) return "";
  const parsed = new Date(d);
  if (isNaN(parsed)) return String(d);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

export function MonthlyTotalsChart({ data }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Monthly Totals</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month"/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="Income" fill="#16a34a" barSize={50} />
            <Bar dataKey="Expenses"  fill="#ef4444" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export function DailySavingsChart({ data }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Daily Savings</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatShortDate} />
            <YAxis domain={["auto", "auto"]}/>
            <Tooltip />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="savings" barSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.savings >= 0 ? "#16a34a" : "#dc2626"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}