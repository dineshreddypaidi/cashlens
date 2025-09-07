import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, Plus, CreditCard, DollarSign } from "lucide-react";

import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./utils/AddRecordOps";

export default function AddRecordModal({ onAdd, defaultDate }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <div className="relative">
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold shadow hover:opacity-95"
      >
        <Plus className="w-4 h-4" /> Add
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <AddRecordForm
            onAdd={(payload) => onAdd?.(payload)}
            defaultDate={defaultDate}
            onClose={() => setOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------- Modal ---------- */
function Modal({ children, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- AddRecordForm ---------- */
function AddRecordForm({ onAdd, defaultDate, onClose }) {
  const [transactionType, setTransactionType] = useState("expense"); // expense | income
  const categories = useMemo(
    () =>
      transactionType === "expense"
        ? EXPENSE_CATEGORIES
        : INCOME_CATEGORIES,
    [transactionType]
  );

  const [category, setCategory] = useState(Object.keys(categories)[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => {
    if (!defaultDate) return new Date().toISOString().slice(0, 10);
    const d = defaultDate instanceof Date ? defaultDate : new Date(defaultDate);
    return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    setCategory(Object.keys(categories)[0]);
  }, [transactionType,categories]);

  function resetForm() {
    setCategory(Object.keys(EXPENSE_CATEGORIES)[0]);
    setDescription("");
    setAmount("");
    setNote("");
    setDate(new Date().toISOString().slice(0, 10));
    setTransactionType("expense");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const parsedAmount = Number(String(amount).replace(/,/g, "")) || 0;
    if (!parsedAmount || parsedAmount <= 0) {
      alert("Enter a valid amount greater than 0");
      return;
    }

    const payload = {
      transaction_type: transactionType,
      category,
      description: description.trim(),
      note: note.trim() || null,
      amount: parsedAmount,
      date,
    };

    onAdd?.(payload);
    resetForm();
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 flex rounded-2xl bg-neutral-100 p-1 border border-neutral-200">
          <button
            type="button"
            onClick={() => setTransactionType("expense")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
              transactionType === "expense"
                ? "bg-loss text-neutral-900"
                : "text-neutral-600 hover:bg-loss/20 cursor-pointer"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("income")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
              transactionType === "income"
                ? "bg-profit text-neutral-900"
                : "text-neutral-600 hover:bg-profit/20 cursor-pointer"
            }`}
          >
            <DollarSign className="w-4 h-4" /> Income
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-3 p-2 rounded-md hover:bg-loss/50 cursor-pointer "
        >
          <X />
        </button>
      </div>

      {/* form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-3">
          {/* Category */}
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Category</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setDescription(""); // reset description when category changes
              }}
              className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-300"
            >
              {Object.keys(categories).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Subcategory / Description */}
          {category && categories[category] && (
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Description</span>
              <select
                ref={firstInputRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select description</option>
                {categories[category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="space-y-3">
          {/* Amount */}
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Amount</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="0.00"
            />
          </label>

          {/* Date */}
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-300"
            />
          </label>

          {/* Note */}
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Note (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Any extra info..."
            />
          </label>
        </div>
      </div>

      {/* actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-loss/70 hover:bg-loss cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-3 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer"
        >
          Add record
        </button>
      </div>
    </form>
  );
}
