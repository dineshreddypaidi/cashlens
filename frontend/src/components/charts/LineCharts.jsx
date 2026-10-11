import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { fmtCompact } from '../../utils/format';

function formatShortDate(d) {
  if (!d && d !== 0) return "";
  const parsed = new Date(d);
  if (isNaN(parsed)) return String(d);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

export function DailyCashflowChart({ data }) {
  return (
    <ChartCard title="Daily Cashflow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 11 }} minTickGap={16} />
          <YAxis domain={["auto", "auto"]} width={52} tick={{ fontSize: 11 }} tickFormatter={fmtCompact} />
          <Tooltip />
          <Line type="monotone" dataKey="Income" stroke="#16a34a" strokeWidth={2} />
          <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
