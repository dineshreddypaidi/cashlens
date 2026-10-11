import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ReferenceLine, Cell } from 'recharts';
import ChartCard from './ChartCard';
import { fmtCompact } from '../../utils/format';

function formatShortDate(d) {
  if (!d && d !== 0) return "";
  const parsed = new Date(d);
  if (isNaN(parsed)) return String(d);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

export function MonthlyTotalsChart({ data }) {
  return (
    <ChartCard title="Monthly Totals">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis width={52} tick={{ fontSize: 11 }} tickFormatter={fmtCompact} />
          <Tooltip />
          <Bar dataKey="Income" fill="#16a34a" barSize={50} />
          <Bar dataKey="Expenses"  fill="#ef4444" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}


export function DailySavingsChart({ data }) {
  return (
    <ChartCard title="Daily Savings">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 11 }} minTickGap={16} />
          <YAxis domain={["auto", "auto"]} width={52} tick={{ fontSize: 11 }} tickFormatter={fmtCompact} />
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
    </ChartCard>
  );
}
