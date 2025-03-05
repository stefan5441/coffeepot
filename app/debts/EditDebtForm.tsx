"use client";

import { useEffect, useState } from "react";

import { Debt } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchDebt, updateDebt } from "./utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      setError("");
    }
  };

  return (
    debt && (
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>Edit debt</CardTitle>
          <CardDescription>Edit debt values manually</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="debtamount">Debt amount</Label>
                <Input
                  id="debtamount"
                  type="text"
                  value={debt.amount}
                  onChange={(e) => setDebt((debt) => (debt ? { ...debt, amount: Number(e.target.value) } : undefined))}
                ></Input>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="from">From</Label>
                <Select
                  value={debt.from}
                  onValueChange={(value) => setDebt((debt) => (debt ? { ...debt, from: value } : undefined))}
                >
                  <SelectTrigger id="from" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="to">To</Label>
                <Select
                  value={debt.to}
                  onValueChange={(value) => setDebt((debt) => (debt ? { ...debt, to: value } : undefined))}
                >
                  <SelectTrigger id="to" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={debt.percentage}
                  onChange={(e) => setDebt((debt) => (debt ? { ...debt, amount: Number(e.target.value) } : undefined))}
                ></Input>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-40">
            Save debt
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
