"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/app/_lib/api";
import { Loader2, Check, AlertCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(searchParams.get("email"));
  const [resendSent, setResendSent] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyToken();
    } else if (email) {
      setStatus("loading");
      setMessage("Check your email for a verification link");
    } else {
      router.push("/login");
    }
  }, [token, email]);

  const verifyToken = async () => {
    try {
      setStatus("loading");
      setMessage("Verifying your email...");
      await authApi.resendVerification(token!);
      setStatus("success");
      setMessage("Email verified successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto text-gray-900 animate-spin" />
            <p className="mt-4 text-gray-600">{message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            {status === "success" ? (
              <>
                <Check className="w-12 h-12 mx-auto text-green-600" />
                <p className="mt-4 text-gray-600">{message}</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 mx-auto text-red-600" />
                <p className="mt-4 text-gray-600">{message}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-900 mb-2" />
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to<br />
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click the link in the email to verify your account.
          </p>
          <div className="text-center">
            <Button variant="outline" onClick={handleResend} disabled={resendSent}>
              {resendSent ? "Email sent!" : "Resend verification email"}
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Already verified?{" "}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}