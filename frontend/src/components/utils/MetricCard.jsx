import { motion } from "framer-motion";
import { Info } from "lucide-react";

const variants = {
  positive: "from-green-50 to-white border-green-200 text-green-700",
  negative: "from-red-50 to-white border-red-200 text-red-700",
  neutral: "from-blue-50 to-white border-blue-200 text-blue-700",
};

export default function MetricCard({ label, value, info, icon, type = "neutral" }) {
  const theme = variants[type] || variants.neutral;
  motion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl shadow-md border bg-gradient-to-br ${theme} backdrop-blur-sm p-6`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-80">{label}</span>

        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="p-2 rounded-xl bg-white/70 shadow-sm"
        >
          {icon}
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-4 text-3xl font-bold tracking-tight"
      >
        {value}
      </motion.div>

      {info && (
        <div className="flex items-center gap-2 text-xs opacity-70 mt-3">
          <Info size={14} />
          <span>{info}</span>
        </div>
      )}
    </motion.div>
  );
}
