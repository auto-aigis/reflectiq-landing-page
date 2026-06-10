"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../_components/AuthProvider";
import { debriefApi, exportApi } from "../_lib/api";
import type { Debrief } from "../_lib/types";
import type { Debrief, DebriefPending, RegenerationCount } from "@/app/_lib/types";
import { Loader2, RefreshCw, AlertCircle, TrendingUp, Target, Zap, Lock } from "lucide-react";

export default function DebriefPage() {
  const { user } = useAuth();
  const [debrief, setDebrief] = useState<Debrief | DebriefPending | null>(null);
  const [regenCount, setRegenCount] = useState<RegenerationCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const tier = user?.tier || "free";
  const isFree = tier === "free";
  const isPro = tier === "pro";
  const isPlus = tier === "plus";
  const canRegenerate = isPro || isPlus;
  const canRegenerateUnlimited = isPlus;

  const isFullDebrief = !isFree;

  useEffect(() => {
    loadDebrief();
  }, []);

  const loadDebrief = async () => {
    try {
      const [debriefData, regenData] = await Promise.all([
        debriefApi.latest(),
        canRegenerate ? debriefApi.regenerationCount() : Promise.resolve(null),
      ]);
      setDebrief(debriefData);
      setRegenCount(regenData as RegenerationCount | null);
    } catch (err) {
      console.error("Failed to load debrief", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const result = await debriefApi.generate(true);
      setDebrief(result);
      if (canRegenerate) {
        const count = await debriefApi.regenerationCount();
        setRegenCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate debrief");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const pending = debrief && "status" in debrief;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Weekly Progress Debrief</h1>
          <p className="text-gray-600">AI-powered insights from your journal entries</p>
        </div>
        {canRegenerate && regenCount && (
          <Badge variant={isPlus ? "default" : "secondary"}>
            {regenCount.remaining} regenerations left this month
          </Badge>
        )}
      </div>

      {isFree && !pending && debrief && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              <span className="text-amber-800">
                Upgrade to Pro to unlock the full debrief including behavioral patterns and nudges
              </span>
            </div>
            <Link href="/pricing">
              <Button size="sm">Upgrade</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {pending && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Need more entries
            </h3>
            <p className="text-gray-600 mb-4">
              You need at least 3 journal entries to generate your first debrief.
              You currently have {(debrief as DebriefPending).entries_needed} more to go.
            </p>
            <Link href="/journal">
              <Button>Start Journaling</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!pending && debrief && "goal_summary" in debrief && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Goal Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{debrief.goal_summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Top Blockers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(isFullDebrief ? debrief.top_blockers : [debrief.top_blockers?.[0]]).map(
                  (blocker, i) =>
                    blocker && (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-700">{blocker}</span>
                      </li>
                    )
                )}
              </ul>
            </CardContent>
          </Card>

          {isFullDebrief && debrief.behavioral_pattern_alert && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Behavioral Pattern Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">{debrief.behavioral_pattern_alert}</p>
              </CardContent>
            </Card>
          )}

          {isFullDebrief && debrief.nudges && debrief.nudges.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Next-Step Nudges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {debrief.nudges.map((nudge, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full text-sm flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span className="text-gray-800">{nudge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {canRegenerate && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={generating || (!canRegenerateUnlimited && regenCount !== null && regenCount.remaining <= 0)}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${generating ? "animate-spin" : ""}`} />
                {generating
                  ? "Generating..."
                  : !canRegenerateUnlimited && regenCount !== null && regenCount.remaining <= 0
                  ? "Monthly limit reached"
                  : "Regenerate Debrief"}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}