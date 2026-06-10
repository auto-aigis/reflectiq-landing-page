"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../_components/AuthProvider";
import { paymentsApi } from "../_lib/api";
import Link from "next/link";

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "forever",
    description: "Get started with basic journaling",
    features: [
      "Unlimited daily journal entries",
      "Simplified weekly debrief (goal summary + 1 blocker)",
      "Journal history: last 30 days only",
      "No on-demand debrief regeneration",
    ],
    cta: "Current Plan",
    popular: false,
    brand: "ReflectIQ Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    interval: "month",
    description: "For serious goal achievers",
    features: [
      "Everything in Free",
      "Full weekly debrief (goal summary + 3 blockers + patterns + nudges)",
      "Full journal history (unlimited)",
      "On-demand debrief regeneration (4x/month)",
      "Export journal entries as CSV or PDF",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    brand: "ReflectIQ Pro",
  },
  {
    id: "plus",
    name: "Plus",
    price: "$19",
    interval: "month",
    description: "For power users and high achievers",
    features: [
      "Everything in Pro",
      "Unlimited on-demand debrief regeneration",
      "Monthly Reset Report (goal drift, behavioral score 0-100)",
      "Streak tracking and accountability dashboard",
      "Early access to new features",
    ],
    cta: "Upgrade to Plus",
    popular: false,
    brand: "ReflectIQ Plus",
  },
];

function PricingContent() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const tier = user?.tier || "free";
  const isPaid = tier === "pro" || tier === "plus";

  const initPaddle = useCallback(() => {
    if (typeof window !== "undefined" && !(window as any).Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (clientToken) {
          (window as any).Paddle.Setup({ token: clientToken });
          (window as any).Paddle.Environment.set("sandbox");
        }
      };
    }
  }, []);

  useEffect(() => {
    initPaddle();
  }, [initPaddle]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const token = searchParams.get("token");
    if (checkout === "success" && token) {
      verifyPayment(token);
    }
  }, [searchParams]);

  const verifyPayment = async (transactionId: string) => {
    try {
      await paymentsApi.verifyTransaction(transactionId);
      await refresh();
    } catch (err) {
      console.error("Payment verification failed", err);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    setLoading(tierId);
    try {
      const { price_id, client_token } = await paymentsApi.checkout(tierId, "monthly");
      const Paddle = (window as any).Paddle;
      if (Paddle && Paddle.Checkout) {
        Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          settings: { displayMode: "overlay" },
        });
      } else {
        const paddleApiUrl = process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL;
        if (paddleApiUrl) {
          window.location.href = `${paddleApiUrl}?client_token=${client_token}&premium_${tierId}=true`;
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">Unlock your full potential with AI-powered insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_TIERS.map((plan) => {
          const isCurrentTier = tier === plan.id;
          const canUpgrade = !isCurrentTier && (plan.id === "pro" || plan.id === "plus") && !isPaid;
          const isUpgradeOrCurrent = isCurrentTier || canUpgrade;

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-gray-900 ring-1 ring-gray-900" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gray-900 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrentTier ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : canUpgrade || (!isPaid && plan.id === "free") ? (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id || plan.id === "free"}
                  >
                    {loading === plan.id ? "Loading..." : plan.cta}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Upgrade to Access
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All plans include secure payment via Paddle. Cancel anytime.</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}