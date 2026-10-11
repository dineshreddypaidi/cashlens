// src/data/realData.js
import { useEffect, useState } from "react";
import { getMainData, getTxnsRange } from "./adapters";

export function useMainData( range, txnVersion ) {
  const [data, setData] = useState({ maindata: null });
  const [error, setError] = useState(null);
  const [transactions, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setError(null);
    setLoading(true);

    Promise.all([getMainData(), getTxnsRange(range.start, range.end)])
      .then(([mainRes, txnsRes]) => {
        if (!mounted) return;
        setData(mainRes);
        setTxns(txnsRes.transactions ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to fetch");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [range, txnVersion]);

  return { data, transactions, error, loading };
}
