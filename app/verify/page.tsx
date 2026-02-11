"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(
            data?.message ||
              data?.error ||
              "Failed to verify email. The link may have expired.",
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying your email");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Verification complete"}
            {status === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-foreground text-center font-medium">{message}</p>
              <p className="text-sm text-muted-foreground text-center">
                You can now log in to your account and start exploring.
              </p>
              <Button
                asChild
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-foreground text-center font-medium">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button asChild variant="outline" className="flex-1 h-11">
                  <Link href="/register">Register Again</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-muted-foreground">Please wait...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
