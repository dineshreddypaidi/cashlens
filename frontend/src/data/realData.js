// src/hooks/useMainData.js
import { useEffect, useState } from "react";
import api from "../lib/api"; // axios instance with baseURL

export function useMainData( range, txnAdded ) {
  const [data, setData] = useState({ maindata: null });
  const [error, setError] = useState(null);
  const [transactions, setTxns] = useState([]);

  useEffect(() => {
    let mounted = true;

    setError(null);

    Promise.all([api.get("main/"), api.get(`txns/${range.start}/${range.end}`)])
      .then(([mainRes, txnsRes]) => {
        if (!mounted) return;
        setData(mainRes.data);
        setTxns(txnsRes.data.transactions);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to fetch");
      })
      .finally(() => mounted);

    return () => {
      mounted = false;
    };
  }, [range,txnAdded]);
  return { data, transactions, error };
}
