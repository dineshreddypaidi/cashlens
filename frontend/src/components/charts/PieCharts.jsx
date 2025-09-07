import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";

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

export function CashflowPie( {usedata} ) {
  const data = [
    { name: "Income", value: usedata.income },
    { name: "Expenses", value: usedata.expenses },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Cashflow - %</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="95%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function IncomeSourcesPie( {data} ) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Income</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="95%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export function ExpensesPie( { data } ) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">Expenses</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DescriptionPie( { data, type, description } ) {
  if (data.length < 1) { return "No data"; }
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <div className="text-sm text-neutral-600 mb-2">{type} {type === "Income" ? "from" : "for"} {description}</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}