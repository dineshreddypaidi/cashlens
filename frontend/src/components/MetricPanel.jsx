import MetricCard from "./utils/MetricCard";
import { fmtCurrency } from "../utils/format";
import { useCurrency } from "./utils/CurrencyContext";
import { Banknote, TrendingDown, Scale, BarChart } from "lucide-react";

function MetricCalculation(rows,maindata) {
  const net_worth = maindata?.current_value + maindata?.investments - maindata?.total_debt;
  return net_worth;

}

export default function MetricsPanel({rows, maindata}) {
  const { currency } = useCurrency();

  const data = MetricCalculation(rows,maindata);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        label="Net Worth"
        value= {fmtCurrency(data, currency)}
        info="= Current Value + Investments – Total Debt"
        icon={<Banknote size={20} />}
        type={data > 0 ? "positive" : "negative"}
      />
    </div>
  );
}
