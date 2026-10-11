import MetricCard from "./utils/MetricCard";
import { fmtCurrency } from "../utils/format";
import { useCurrency } from "./utils/CurrencyContext";
import { Banknote } from "lucide-react";

function MetricCalculation(rows, maindata) {
  const current = Number(maindata?.current_value) || 0;
  const investments = Number(maindata?.investments) || 0;
  const debt = Number(maindata?.total_debt) || 0;
  return current + investments - debt;
}

export default function MetricsPanel({rows, maindata}) {
  const { currency } = useCurrency();

  const data = MetricCalculation(rows, maindata);

  // Without maindata the figure is meaningless, so don't paint it as a loss.
  const type = !maindata ? "neutral" : data > 0 ? "positive" : "negative";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <MetricCard
        label="Net Worth"
        value= {fmtCurrency(data, currency)}
        info="= Current Value + Investments – Total Debt"
        icon={<Banknote size={20} />}
        type={type}
      />
    </div>
  );
}
