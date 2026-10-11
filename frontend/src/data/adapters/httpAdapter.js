import api from "../../lib/api";

/**
 * Web adapter: the existing Django endpoints, through the existing axios
 * instance (CSRF interceptor and error normalisation included). Behaviour here
 * is identical to what the site did before the adapter seam existed.
 */
export async function getMainData() {
  const res = await api.get("main/");
  return res.data;
}

export async function getTxnsRange(start, end) {
  const res = await api.get(`txns/${start}/${end}/`);
  return res.data;
}

export async function addTxn(record) {
  const res = await api.post("txn/add/", record);
  return res.data;
}

export async function getRate() {
  const res = await api.get("rate/");
  return Number(res.data?.conversion_rate);
}
