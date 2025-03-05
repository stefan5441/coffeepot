"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Debt } from "./types";
import { fetchDebt } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import EditDebtForm from "@/app/debts/EditDebtForm";
import { useAuth } from "@/components/auth-provider";
import AddPaymentForm from "@/app/debts/AddPaymentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FetchState = "loading" | "error" | "success" | "idle";

export default function Debts() {
  const { user, isAuthorized, loading } = useAuth();

  const [debt, setDebt] = useState<Debt | undefined>();
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadDebt = async () => {
    setFetchState("loading");

    try {
      const { data, error } = await fetchDebt();

      if (error) {
        setErrorMessage(error);
        setFetchState("error");
        return;
      }

      if (data) {
        setDebt(data);
        setFetchState("success");
      } else {
        setFetchState("error");
        setErrorMessage("No data received");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
      setFetchState("error");
    }
  };

  useEffect(() => {
    loadDebt();
  }, []);

  const renderDebtStatus = () => {
    if (fetchState === "loading") {
      return <Skeleton className="w-sm h-12 rounded-lg" />;
    }

    if (fetchState === "error") {
      return (
        <Alert variant="destructive" className="w-sm">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      );
    }

    if (fetchState === "success" && debt) {
      return (
        <div className="w-sm p-4 bg-gray-200 rounded-lg">
          {debt.amount > 0 ? `${debt.from} owes ${debt.to} ${debt.amount} cash` : "The debt has been settled"}
        </div>
      );
    }

    return <p>No debt data available</p>;
  };

  if (loading || !user || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-sm" />
        <Skeleton className="h-64 w-sm" />
        <Link href="/?error=unauthorized" passHref>
          Unauthorized, go back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {renderDebtStatus()}

      <Tabs defaultValue="addpayment" className="w-sm max-w-md mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="addpayment" className="data-[state=active]:bg-gray-200">
            Add payment
          </TabsTrigger>
          <TabsTrigger value="editdebt" className="data-[state=active]:bg-gray-200">
            Edit debt
          </TabsTrigger>
        </TabsList>
        <TabsContent value="addpayment">
          <AddPaymentForm debt={debt} setDebt={setDebt} />
        </TabsContent>
        <TabsContent value="editdebt">
          <EditDebtForm debt={debt} setDebt={setDebt} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
