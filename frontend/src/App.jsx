import React, { useState, useEffect, lazy, Suspense } from 'react';

import { useCurrency } from "./components/utils/CurrencyContext";

import { fmtCurrency } from './utils/format';

import DateRange from './components/utils/DateRange';
import Stat from './components/utils/Stat';

import Header from './components/Header';

import TransactionsTable from './components/TransactionsTable';
import AddRecordModal from './components/AddRecordModal';

import SegmentedControl from './components/SegmentedControl';

import MetricsPanel from './components/MetricPanel';
import MyRule from './components/MyRule';

import { useMainData } from "./data/realData";
import postTxn from './data/postData';

import { totalGroup } from './components/charts/utils/groupers';

export default function App() {

  const { currency } = useCurrency();

  const today = new Date();
  const startDefault = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString("en-CA");
  const endDefault =  today.toISOString().slice(0, 10);

  const [txnAdded , setTxnAdded] = useState(false);

  const [range, setRange] = useState({ start: startDefault, end: endDefault });
  const { data, transactions, error } = useMainData(range,txnAdded);

  const [txns, setTxns] = useState([]);
  const [totals, setTotals] = useState([]);

  const [view, setView] = useState('transactions');

  const MetricGraphs = lazy(() => import("./components/MetricGraphs.jsx"));
  const DescGraphs = lazy(() => import("./components/DescGraphs.jsx"));

  useEffect(() => {
    if (transactions) {
      setTxns(transactions);
    }
    setTotals(totalGroup(txns))
  }, [data, transactions, txns]);

  async function addRecord(record) {
    setTxnAdded(false);
    setTxns((prev) => [
      { ...record,  id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1},
      ...prev,
    ]);

    try {
      const saved = await postTxn(record);
      setTxnAdded(true);
      setTxns((prev) =>
        prev.map((txn) =>
          txn._optimistic ? { ...saved,} : txn
        )
      );
    } catch (err) {
      setTxns((prev) => prev.filter((txn) => txn._optimistic !== true));
      return err;
    }
  }

  const Options = {
    transactions: () => (
      <div className="grid grid-cols-1 gap-4">
        <TransactionsTable rows={txns} />
      </div>
    ),
    charts: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
          <Suspense fallback={<div className="p-4 text-profit">Loading charts...</div>}>
            <MetricGraphs rows={txns} />
          </Suspense>
        </div>
        <hr className="p-2 mb-3 w-4/5 border-t border-neutral-700/40 mx-auto" />
          <Suspense fallback={<div className="p-4 text-profit">Loading charts...</div>}>
            <DescGraphs rows={txns} />
          </Suspense>
      </>
    ),
    metrics: ( totals ) => (
      <div className="grid grid-cols-1 gap-4">
        <MetricsPanel totals={totals} />
      </div>
    ),
    my_rule: () => (
      <div className="grid grid-cols-1 gap-4">
        <MyRule income={(data?.maindata?.total_income * 0.8)} contributed={data?.maindata?.contributed_one_perc}/>
      </div>
    ),
  };

  if (error) return <div className="text-loss text-center">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background text-neutral-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <Stat label="Current Value" value={fmtCurrency(data?.maindata?.current_value, currency)} icon="piggy" color= {data?.maindata?.current_value > 0 ? 'text-profit' : 'text-loss'} />
            <Stat label="Investments" value={fmtCurrency(data?.maindata?.investments, currency)} icon="investment" color="text-profit" />
            <Stat label="Debt" value={fmtCurrency(data?.maindata?.total_debt, currency)} icon="debt" color="text-loss" />
          </div>

          <hr className="border-1 text-neutral-700/40" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
            <div className="flex items-center gap-3">
              <AddRecordModal onAdd={addRecord} />
              <SegmentedControl value={view} onChange={setView} />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <DateRange start={range.start} end={range.end} onChange={setRange} />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Stat label="Income" value={fmtCurrency(totals.income, currency)} icon="wallet" color="text-profit" />
            <Stat label="Expenses" value={fmtCurrency(totals.expenses, currency)} icon="bending" color="text-loss" />
          </div>

          <hr className="text-neutral-400/70" />

        </div>

        <div className="mt-6">
          {Options[view] ? Options[view]({ totals }) : null}
        </div>

        <div className="text-xs text-neutral-500 text-center mt-6">&copy; • Dineshreddypaidi</div>
      </main>
    </div>
  );
}
