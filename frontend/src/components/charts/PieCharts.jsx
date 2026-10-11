import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import ChartCard, { ChartEmpty } from "./ChartCard";
import useMediaQuery, { SM_UP } from "../../utils/useMediaQuery";

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={12}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function getColor(name) {
  // Special cases
  if (name === "Income") return "#22C55E";
  if (name === "Expenses") return "#EF4444";

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash) % 30);
  const lightness = 45 + (Math.abs(hash >> 3) % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * One pie, sized and labelled for the current breakpoint. Slice labels are
 * dropped below `sm`, where they overlap into mush on a crowded pie.
 */
function Pie1({ title, data, label }) {
  const smUp = useMediaQuery(SM_UP);

  if (!data?.length) return <ChartEmpty title={title} />;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={smUp ? label : false}
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: smUp ? 14 : 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CashflowPie({ usedata }) {
  const data = [
    { name: "Income", value: Number(usedata?.income) || 0 },
    { name: "Expenses", value: Number(usedata?.expenses) || 0 },
  ].filter((d) => d.value > 0);

  return <Pie1 title="Cashflow - %" data={data} label={renderCustomizedLabel} />;
}

export function IncomeSourcesPie({ data }) {
  return <Pie1 title="Income" data={data} label={renderCustomizedLabel} />;
}

export function ExpensesPie({ data }) {
  return <Pie1 title="Expenses" data={data} label />;
}

export function DescriptionPie({ data, type, description }) {
  const title = `${type} ${type === "Income" ? "from" : "for"} ${description}`;
  return <Pie1 title={title} data={data} label />;
}
