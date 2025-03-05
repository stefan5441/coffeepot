"use client";

import { useEffect, useState } from "react";

import { Debt } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchDebt, updateDebt } from "./utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        if (!newPaymentFrom && data.from) {
          setNewPaymentFrom(data.from);
        }
      }
    };
    loadDebt();
  }, [setDebt, newPaymentFrom]);

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
      setNewPaymentAmount("");
      setError("");
    }
  };

  return (
    debt && (
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>New payment</CardTitle>
          <CardDescription>Add a new payment</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form id="addPaymentForm" onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Payment amount</Label>
                <Input
                  id="amount"
                  placeholder="2000"
                  type="number"
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="paidby">Paid by</Label>
                <Select value={newPaymentFrom} onValueChange={setNewPaymentFrom}>
                  <SelectTrigger id="paidby" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {debt?.from && <SelectItem value={debt.from}>{debt.from}</SelectItem>}
                    {debt?.to && <SelectItem value={debt.to}>{debt.to}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="addPaymentForm" className="w-40">
            Add payment
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
