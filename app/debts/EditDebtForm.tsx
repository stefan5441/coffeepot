"use client";

import { useEffect, useState } from "react";

import { Debt } from "./types";
import { fetchDebt, updateDebt } from "./utils";

type Props = {
  debt: Debt | undefined;
  setDebt: React.Dispatch<React.SetStateAction<Debt | undefined>>;
};

export default function EditDebtForm({ debt, setDebt }: Props) {
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const loadDebt = async () => {
      const { data, error } = await fetchDebt();
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setDebt(data);
        setUsers([data.from, data.to]);
      }
    };
    loadDebt();
  }, [setDebt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt) {
      setError("Some data is missing");
      return;
    }

    const { from, to, amount, percentage } = debt;
    if (!from || !to || amount === undefined || percentage === undefined) {
      setError("Some fields are missing");
      return;
    }

    const { data, error: updateError } = await updateDebt({ from, to, amount, percentage });
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
        <label>Debt</label>
        <input
          className="bg-sky-600 rounded-sm"
          type="number"
          value={debt?.amount ?? 0}
          onChange={(e) => setDebt((debt) => (debt ? { ...debt, amount: Number(e.target.value) } : undefined))}
        />
      </div>

      <div className="flex flex-col">
        <label>From</label>
        <select
          className="bg-sky-600 rounded-sm"
          value={debt?.from || ""}
          onChange={(e) => setDebt((debt) => (debt ? { ...debt, from: e.target.value } : undefined))}
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label>To</label>
        <select
          className="bg-sky-600 rounded-sm"
          value={debt?.to || ""}
          onChange={(e) => setDebt((debt) => (debt ? { ...debt, to: e.target.value } : undefined))}
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label>Percentage</label>
        <input
          className="bg-sky-600 rounded-sm"
          type="number"
          value={debt?.percentage ?? 0}
          onChange={(e) => setDebt((debt) => (debt ? { ...debt, percentage: Number(e.target.value) } : undefined))}
        />
      </div>

      <button className="bg-purple-500" type="submit">
        Save edited debt
      </button>

      <p className="text-amber-500">{error}</p>
    </form>
  );
}
