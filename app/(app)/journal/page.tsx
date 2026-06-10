"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/_components/AuthProvider";
import { journalApi, exportApi } from "@/app/_lib/api";
import type { JournalEntry } from "@/app/_lib/types";
import { Plus, Download, Trash2, FileText, Flame } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [goalToday, setGoalToday] = useState("");
  const [blocker, setBlocker] = useState("");
  const [win, setWin] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const tier = user?.tier || "free";
  const isPlus = tier === "plus";
  const canExport = tier === "pro" || tier === "plus";

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await journalApi.list();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load entries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (goalToday.length > 500 || blocker.length > 500 || win.length > 500) {
      setError("Fields must be under 500 characters");
      return;
    }

    setSaving(true);

    try {
      const entry = await journalApi.create(goalToday, blocker, win, contextNote || undefined);
      setEntries([entry, ...entries]);
      setShowForm(false);
      setGoalToday("");
      setBlocker("");
      setWin("");
      setContextNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await journalApi.delete(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const blob = format === "csv" ? await exportApi.csv() : await exportApi.pdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `journal-export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Journal</h1>
          <p className="text-gray-600">Record your daily goals, blockers, and wins</p>
        </div>
        <div className="flex gap-2">
          {canExport && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <Download className="w-4 h-4 mr-1" /> PDF
              </Button>
            </>
          )}
          {!canExport && (
            <Link href="/pricing">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Export (Pro)
              </Button>
            </Link>
          )}
        </div>
      </div>

      {tier === "free" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-3">
            <p className="text-sm text-amber-800">
              Free plan: Viewing last 30 days only.{" "}
              <Link href="/pricing" className="font-medium underline">Upgrade to Pro</Link> for full history.
            </p>
          </CardContent>
        </Card>
      )}

      {isPlus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-blue-800">Streak tracking enabled</span>
            </div>
            <Badge variant="outline" className="bg-white">Plus Feature</Badge>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-1" /> New Entry
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="goal">What was your main goal today?</Label>
                <Textarea
                  id="goal"
                  value={goalToday}
                  onChange={(e) => setGoalToday(e.target.value)}
                  placeholder="..."
                  maxLength={500}
                  required
                  className="min-h-[80px]"
                />
                <p className="text-xs text-gray-500 text-right">{goalToday.length}/500</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blocker">What blocked you or slowed you down?</Label>
                <Textarea
                  id="blocker"
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  placeholder="..."
                  maxLength={500}
                  required
                  className="min-h-[80px]"
                />
                <p className="text-xs text-gray-500 text-right">{blocker.length}/500</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="win">What was a win, no matter how small?</Label>
                <Textarea
                  id="win"
                  value={win}
                  onChange={(e) => setWin(e.target.value)}
                  placeholder="..."
                  maxLength={500}
                  required
                  className="min-h-[80px]"
                />
                <p className="text-xs text-gray-500 text-right">{win.length}/500</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="context">Context note (optional)</Label>
                <Textarea
                  id="context"
                  value={contextNote}
                  onChange={(e) => setContextNote(e.target.value)}
                  placeholder="Additional context..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Entry"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No entries yet. Start journaling!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Goal</span>
                    <p className="text-gray-900">{entry.goal_today}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Blocker</span>
                    <p className="text-gray-700">{entry.blocker}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Win</span>
                    <p className="text-gray-700">{entry.win}</p>
                  </div>
                  {entry.context_note && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Context</span>
                      <p className="text-gray-600 text-sm">{entry.context_note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}