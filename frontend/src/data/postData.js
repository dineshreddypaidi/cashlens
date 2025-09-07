import api from "../lib/api"; // axios instance with baseURL

export default async function postTxn(record) {
  try {
    const res = await api.post("txn/add/", record);
    return res.data;
  } catch (err) {
    console.error("Failed to add transaction:", err);
    throw err;
  }
}
