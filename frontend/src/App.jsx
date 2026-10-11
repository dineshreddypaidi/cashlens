import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';

import { useCurrency } from "./components/utils/useCurrency";

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

const MetricGraphs = lazy(() => import("./components/MetricGraphs.jsx"));
const DescGraphs = lazy(() => import("./components/DescGraphs.jsx"));

function Notice({ children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
      {children}
    </div>
  );
}

export default function App() {

  const { currency } = useCurrency();

  const today = new Date();
  const startDefault = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString("en-CA");
  const endDefault =  today.toISOString().slice(0, 10);

  // A counter, not a flag: a boolean stops changing after the first add, so
  // later adds would never retrigger the fetch.
  const [txnVersion, setTxnVersion] = useState(0);

  const [range, setRange] = useState({ start: startDefault, end: endDefault });
  const { data, transactions, error, loading } = useMainData(range, txnVersion);

  const [txns, setTxns] = useState([]);

  const [view, setView] = useState('transactions');

  useEffect(() => {
    if (transactions) {
      setTxns(transactions);
    }
  }, [transactions]);

  // Derived, so totals can never lag a render behind txns.
  const totals = useMemo(() => totalGroup(txns), [txns]);

  async function addRecord(record) {
    const optimisticId = txns.length ? Math.max(...txns.map((p) => p.id)) + 1 : 1;
    setTxns((prev) => [
      { ...record, id: optimisticId, _optimistic: true },
      ...prev,
    ]);

    try {
      // The add endpoint returns only a message, so there is nothing to merge
      // in; bumping the version refetches and replaces the optimistic row.
      await postTxn(record);
      setTxnVersion((v) => v + 1);
    } catch (err) {
      setTxns((prev) => prev.filter((txn) => txn._optimistic !== true));
      return err;
    }
  }

  const Options = {
    transactions: () => (
      <div className="grid grid-cols-1 gap-4">
        <TransactionsTable rows={txns} loading={loading} />
      </div>
    ),
    charts: () => (
      <>
        {txns.length <= 5 ? <Notice>Add more txns to get charts</Notice> :
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3">
            <Suspense fallback={<div className="p-4 text-profit">Loading charts...</div>}>
              <MetricGraphs rows={txns} />
            </Suspense>
          </div>
          <hr className="p-2 mb-3 w-4/5 border-t border-neutral-700/40 mx-auto" />
            <Suspense fallback={<div className="p-4 text-profit">Loading charts...</div>}>
              <DescGraphs rows={txns} />
            </Suspense>
        </>
        }
      </>
    ),
    metrics: () => (
      <div className="grid grid-cols-1 gap-4">
        <MetricsPanel rows={txns} maindata={data?.maindata}/>
      </div>
    ),
    my_rule: () => (
      <div className="grid grid-cols-1 gap-4">
        <MyRule income={data?.maindata?.total_income} contributed={data?.maindata?.contributed_one_perc}/>
      </div>
    ),
  };

  if (error) return <div className="text-loss text-center">Error: {error}</div>;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-neutral-900 pb-[env(safe-area-inset-bottom)]">
      <Header />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <Stat label="Current Value" value={fmtCurrency(data?.maindata?.current_value, currency)} icon="piggy" color= {data?.maindata?.current_value > 0 ? 'text-profit' : 'text-loss'} />
            <Stat label="Investments" value={fmtCurrency(data?.maindata?.investments, currency)} icon="investment" color="text-profit" />
            <div className="col-span-2 sm:col-span-1">
              <Stat label="Debt" value={fmtCurrency(data?.maindata?.total_debt, currency)} icon="debt" color="text-loss" />
            </div>
          </div>

          <hr className="border-1 text-neutral-700/40" />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <AddRecordModal onAdd={addRecord} />

            {/* min-w forces the tab bar onto its own line rather than
                clipping its last tab when the row runs out of room. */}
            <div className="flex-1 min-w-[200px]">
              <SegmentedControl value={view} onChange={setView} />
            </div>

            <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-3">
              <DateRange start={range.start} end={range.end} onChange={setRange} />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Stat label="Income" value={fmtCurrency(totals.income, currency)} icon="wallet" color="text-profit" />
            <Stat label="Expenses" value={fmtCurrency(totals.expenses, currency)} icon="bending" color="text-loss" />
          </div>

          <hr className="text-neutral-400/70" />

        </div>

        <div className="mt-6">
          {Options[view] ? Options[view]({ }) : null}
        </div>

        <div className="text-xs text-neutral-500 text-center mt-6">&copy; • Dineshreddypaidi</div>
      </main>
    </div>
  );
}
