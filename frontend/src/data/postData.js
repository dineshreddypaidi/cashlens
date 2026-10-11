import { addTxn } from "./adapters";

export default async function postTxn(record) {
  try {
    return await addTxn(record);
  } catch (err) {
    console.error("Failed to add transaction:", err);
    throw err;
  }
}
