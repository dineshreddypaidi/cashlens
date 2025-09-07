import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = (timestamp) => {
      start += value / (duration / 16);
      if (start < value) {
        setDisplay(start);
        requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return display.toFixed(typeof value === "number" && value % 1 !== 0 ? 1 : 0);
}

export default function MetricsPanel({ totals }) {
  const expToSavings =
    totals.income > 0
      ? (totals.expenses / totals.income).toFixed(2)
      : Infinity;

  const savingsRate =
    totals.income > 0 ? (totals.savings / totals.income) * 100 : 0;

  const investPercent =
    totals.income > 0 ? (totals.investments / totals.income) * 100 : 0;

  const metrics = [
    {
      label: "Expenses → Savings",
      value: expToSavings,
      suffix: "",
      icon: <ArrowDownCircle className="w-7 h-7 text-red-500" />,
      desc: "Money spent for every ₹1 saved",
      color: "from-red-400 to-red-600",
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      suffix: "%",
      icon: <PiggyBank className="w-7 h-7 text-green-500" />,
      desc: "How much of income you keep",
      color: "from-green-400 to-green-600",
    },
    {
      label: "Investment %",
      value: investPercent,
      suffix: "%",
      icon: <TrendingUp className="w-7 h-7 text-blue-500" />,
      desc: "Portion of income invested",
      color: "from-blue-400 to-indigo-600",
    },
    {
      label: "Total Expenses",
      value: totals.expenses,
      suffix: "",
      icon: <ArrowDownCircle className="w-7 h-7 text-orange-500" />,
      desc: "Cash flowing out",
      color: "from-orange-400 to-orange-600",
    },
    {
      label: "Total Income",
      value: totals.income,
      suffix: "",
      icon: <ArrowUpCircle className="w-7 h-7 text-emerald-500" />,
      desc: "Cash flowing in",
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m, idx) => {
        const displayValue = useCountUp(Number(m.value));
        return (
          <motion.div
            key={m.label}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-6 rounded-2xl shadow-md border border-neutral-200 bg-white relative overflow-hidden group"
          >
            {/* Glow background */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${m.color} transition`}
            />
            <div className="flex items-center gap-3 mb-3">
              {m.icon}
              <h3 className="text-base font-medium text-neutral-700">{m.label}</h3>
            </div>
            <div className="text-3xl font-bold text-neutral-900">
              {displayValue}
              <span className="text-sm text-neutral-500 ml-1">{m.suffix}</span>
            </div>
            <p className="text-sm text-neutral-500">{m.desc}</p>
            {/* Animated progress bar */}
            {m.suffix === "%" && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(m.value, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-2 mt-3 rounded-full bg-gradient-to-r ${m.color}`}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
