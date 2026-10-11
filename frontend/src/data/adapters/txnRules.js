/**
 * The accounting rules, ported verbatim from the Django `txn_handler`
 * (backend/api/views.py). This is the core of the app and must behave
 * identically on the server and on the device, so it lives in one pure
 * function with no I/O.
 *
 * Category keys below match src/components/utils/AddRecordOps.jsx exactly,
 * including the "intrest_paid" spelling.
 */
export function applyTxnToMainData(main, txn) {
  const next = {
    current_value: Number(main?.current_value) || 0,
    investments: Number(main?.investments) || 0,
    total_debt: Number(main?.total_debt) || 0,
    total_income: Number(main?.total_income) || 0,
    contributed_one_perc: Number(main?.contributed_one_perc) || 0,
  };

  const amount = Number(txn?.amount) || 0;
  const { category, description, transaction_type } = txn ?? {};

  if (transaction_type === "income") {
    next.current_value += amount;
    next.total_income += amount;

    if (category === "Loan") {
      next.total_debt += amount;
    }
    if (category === "Investment_withdraw") {
      next.investments -= amount;
    }
  }

  if (transaction_type === "expense") {
    next.current_value -= amount;

    if (category === "Debt_Payments" && description !== "intrest_paid") {
      next.total_debt -= amount;
    }
    if (category === "MyRule") {
      next.contributed_one_perc += amount;
    }
    if (category === "Investments") {
      next.investments += amount;
    }
  }

  return next;
}
