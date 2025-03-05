"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { user, isAuthorized, loading, signInWithGoogle, signOut } = useAuth();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Debt Management App</CardTitle>
          <CardDescription>Track and manage debts between friends</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error === "unauthorized" && (
            <Alert variant="destructive">
              <AlertDescription>Access restricted to authorized users only.</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="py-8 text-center">
              <p>Loading...</p>
            </div>
          ) : user ? (
            <div className="space-y-4 text-center">
              <p>
                Welcome, <span className="font-semibold">{user.email}</span>
              </p>

              {isAuthorized ? (
                <div className="flex justify-center space-x-4">
                  <Link href="/debts">
                    <Button size="lg" className="w-full">
                      Go to Debts
                    </Button>
                  </Link>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Your account ({user.email}) is not authorized to use this application. Only Girlboss Sarah and Steco
                    King have access.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="mb-4">Sign in to manage your debts</p>
                <p className="text-sm text-gray-500 mb-4">Note: This app is restricted to specific users only.</p>
              </div>

              <Button
                onClick={signInWithGoogle}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          {user && (
            <Button onClick={signOut} variant="ghost" size="sm">
              Sign Out
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
