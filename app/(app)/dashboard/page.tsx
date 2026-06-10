"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../_components/AuthProvider";
import { journalApi, debriefApi, paymentsApi } from "../../_lib/api";
import type { JournalEntry, Debrief, DebriefPending } from "../../_lib/types";
import { FileText, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

function DashboardContent() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [debrief, setDebrief] = useState<Debrief | DebriefPending | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get("transaction_id");
  const checkoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      handleVerifyTransaction(transactionId);
    }
  }, [checkoutSuccess, transactionId]);

  const loadData = async () => {
    try {
      const [entriesData, debriefData] = await Promise.all([
        journalApi.list(),
        debriefApi.latest(),
      ]);
      setEntries(entriesData);
      setDebrief(debriefData);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTransaction = async (txnId: string) => {
    setProcessingPayment(true);
    try {
      await paymentsApi.verifyTransaction(txnId);
      await refresh();
      router.replace("/dashboard");
    } catch (err) {
      console.error("Transaction verification failed", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const tier = user?.tier || "free";
  const isPaid = tier === "pro" || tier === "plus";
  const entriesCount = entries.length;
  const recentEntries = entries.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto text-gray-900 animate-spin" />
            <p className="mt-4 text-gray-600">Processing payment... please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user?.display_name ? `, ${user.display_name}` : ""}
          </h1>
          <p className="text-gray-600">Track your progress and achieve your goals</p>
        </div>
        <Badge variant={isPaid ? "default" : "secondary"}>
          ReflectIQ {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </Badge>
      </div>

      {checkoutSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-green-700">Payment successful! Your subscription is now active.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{entriesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Total entries recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Debrief Status</CardTitle>
          </CardHeader>
          <CardContent>
            {debrief && "status" in debrief ? (
              <div className="text-lg font-semibold text-gray-900">
                Need {debrief.entries_needed} more
              </div>
            ) : debrief ? (
              <div className="text-lg font-semibold text-gray-900">Available</div>
            ) : (
              <div className="text-lg font-semibold text-gray-900">Generating...</div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {debrief && "status" in debrief ? "entries needed" : "AI insights ready"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Your Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900">
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isPaid ? "Full access" : "Upgrade for more"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Entries</CardTitle>
            <Link href="/journal">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No entries yet. Start journaling!</p>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {entry.goal_today}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/journal" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 w-4 h-4" />
                New Journal Entry
              </Button>
            </Link>
            <Link href="/debrief" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 w-4 h-4" />
                View Debrief
              </Button>
            </Link>
            {!isPaid && (
              <Link href="/pricing" className="block">
                <Button variant="default" className="w-full justify-start">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}