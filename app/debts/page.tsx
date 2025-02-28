"use client";

import { useEffect, useState } from "react";

import { Debt } from "./types";
import { fetchDebt } from "./utils";
import EditDebtForm from "@/app/debts/EditDebtForm";
import AddPaymentForm from "@/app/debts/AddPaymentForm";

export default function Debts() {
  const [debt, setDebt] = useState<Debt | undefined>();

  useEffect(() => {
    const loadDebt = async () => {
      const { data, error } = await fetchDebt();
      if (!error && data) {
        setDebt(data);
      }
    };
    loadDebt();
  }, []);

  console.log(debt);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Debt Management</h1>
      {debt ? (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          {debt.amount ? `${debt.from} owes ${debt.to} ${debt.amount} cash` : "The debt has been settled"}
        </div>
      ) : (
        <p>Loading debt data...</p>
      )}
      <AddPaymentForm debt={debt} setDebt={setDebt} />
      <EditDebtForm debt={debt} setDebt={setDebt} />
    </div>
  );
}
