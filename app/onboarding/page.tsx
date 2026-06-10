"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { onboardingApi, authApi } from "../_lib/api";
import type { Domain, TypicalBlocker } from "../_lib/types";

const DOMAINS: Domain[] = ["work", "health", "relationships", "finances", "learning"];
const BLOCKERS: TypicalBlocker[] = ["procrastination", "perfectionism", "distraction", "avoidance", "other"];

export default function OnboardingPage() {
  const [mainGoal, setMainGoal] = useState("");
  const [domain, setDomain] = useState<string>("");
  const [typicalBlocker, setTypicalBlocker] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        await onboardingApi.get();
        router.push("/journal");
      } catch {
        // Not completed yet
      }
    };
    checkOnboarding();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!mainGoal.trim() || !domain || !typicalBlocker) {
      setError("Please answer all questions");
      return;
    }

    setLoading(true);

    try {
      await onboardingApi.save(mainGoal, domain, typicalBlocker);
      router.push("/journal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save answers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to ReflectIQ</CardTitle>
          <CardDescription>Let&apos;s get to know you better</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="mainGoal">What is your main goal right now?</Label>
              <Input
                id="mainGoal"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="e.g., Get promoted, Run a marathon, Save for a house"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Which domain are you focused on?</Label>
              <Select value={domain} onValueChange={setDomain} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blocker">How do you typically block yourself?</Label>
              <Select value={typicalBlocker} onValueChange={setTypicalBlocker} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a blocker type" />
                </SelectTrigger>
                <SelectContent>
                  {BLOCKERS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}