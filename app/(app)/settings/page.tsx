"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../_components/AuthProvider";
import { settingsApi, exportApi } from "../../_lib/api";
import { User, Mail, Download, CreditCard, ExternalLink, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const tier = user?.tier || "free";
  const isPaid = tier === "pro" || tier === "plus";
  const canExport = tier === "pro" || tier === "plus";

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.get();
      setDisplayName(settings.display_name || "");
      setEmail(settings.email);
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await settingsApi.update(email, displayName || undefined);
      await refresh();
      setMessage("Settings saved successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
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

  const openBillingPortal = async () => {
    try {
      const { url } = await settingsApi.billingPortal();
      window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to open billing portal");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Current Plan</p>
              <p className="text-sm text-gray-500">ReflectIQ {tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
            </div>
            <Badge variant={isPaid ? "default" : "secondary"}>
              {tier === "free" ? "Free" : tier === "pro" ? "Pro" : "Plus"}
            </Badge>
          </div>
          {isPaid && (
            <Button variant="outline" onClick={openBillingPortal} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          )}
          {!isPaid && (
            <Link href="/pricing" className="block">
              <Button className="w-full">
                Upgrade Plan
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download your journal entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canExport ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport("csv")} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport("pdf")} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Export functionality is available for Pro and Plus plans.
              </p>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">
                  Upgrade to Export
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}