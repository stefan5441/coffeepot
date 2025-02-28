"use client";

import { useEffect, useState } from "react";

import { Debt } from "./types";
import { fetchDebt, updateDebt } from "./utils";

type Props = {
  debt: Debt | undefined;
  setDebt: React.Dispatch<React.SetStateAction<Debt | undefined>>;
};

export default function AddPaymentForm({ debt, setDebt }: Props) {
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>("");
  const [newPaymentFrom, setNewPaymentFrom] = useState<string>("");

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadDebt = async () => {
      const { data, error } = await fetchDebt();
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setDebt(data);
      }
    };
    loadDebt();
  }, [setDebt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPaymentAmount || !newPaymentFrom) {
      setError("Please set both amount and who paid, I can't guess for you.");
      return;
    }

    if (!debt) {
      setError("Debt data is missing. Please try again later.");
      return;
    }

    const { from: debtFrom, to: debtTo, percentage: fromPercentage, amount: currentAmount } = debt;

    const paymentAmount = Number(newPaymentAmount);

    const paidForAmount = (paymentAmount * fromPercentage) / 100;
    const newDebtAmount = Math.round(Math.abs(currentAmount - paidForAmount));

    let newDebtFrom = debtFrom;
    let newDebtTo = debtTo;
    let newPercentage = fromPercentage;

    if (currentAmount - paidForAmount < 0) {
      newDebtFrom = debtTo;
      newDebtTo = debtFrom;
      newPercentage = 100 - fromPercentage;
    }

    const debtPayload = {
      from: newDebtFrom,
      to: newDebtTo,
      amount: newDebtAmount,
      percentage: newPercentage,
    };

    const { data, error: updateError } = await updateDebt(debtPayload);

    if (updateError) {
      setError(updateError);
      return;
    }
    if (data) {
      setDebt(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-sky-700 rounded-xl p-4">
      <div className="flex flex-col">
        <label>Add new payment</label>
        <input
          className="bg-sky-600 rounded-sm"
          type="number"
          value={newPaymentAmount}
          onChange={(e) => setNewPaymentAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label>Paid by</label>
        <select
          className="bg-sky-600 rounded-sm"
          value={newPaymentFrom}
          onChange={(e) => setNewPaymentFrom(e.target.value)}
        >
          <option value="">Select</option>
          <option value={debt?.from}>{debt?.from}</option>
          <option value={debt?.to}>{debt?.to}</option>
        </select>
      </div>

      <button className="bg-purple-500" type="submit">
        ADD PAYMENT
      </button>

      <p className="text-amber-500">{error}</p>
    </form>
  );
}
