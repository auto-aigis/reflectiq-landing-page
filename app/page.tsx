"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  BookOpen,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
      title: "Structured Weekly Journaling",
      description:
        "Write about your goals, blockers, and wins in natural language. No rigid templates — just guided prompts that evolve with you.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "Longitudinal NLP Pattern Analysis",
      description:
        "Our AI reads across months of your entries to surface behavioral patterns and recurring self-sabotage triggers you cannot see yourself.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      title: "Goal Drift Detection",
      description:
        "Instantly know when your actions are drifting away from your stated goals. Get realigned before weeks become months of lost progress.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      title: "Weekly Progress Debrief",
      description:
        "Receive a personalized AI-generated debrief every week with concrete next-step nudges tailored to your patterns and progress.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
      title: "Behavioral Pattern Insights",
      description:
        "Discover WHY you keep missing the same goals. Understand your cycles of motivation, procrastination, and self-sabotage.",
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "AI Accountability Coaching",
      description:
        "Not a chatbot. Not therapy. A structured coaching system that holds you accountable based on YOUR own written commitments.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Journal Your Week",
      description:
        "Spend 5-10 minutes writing about your goals, what blocked you, and what you accomplished. Use natural language — no forms or checkboxes.",
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
    },
    {
      number: "02",
      title: "AI Analyzes Your Patterns",
      description:
        "Our NLP engine reads across all your past entries, identifying recurring themes, blockers, emotional triggers, and goal drift over time.",
      icon: <Brain className="h-8 w-8 text-indigo-600" />,
    },
    {
      number: "03",
      title: "Receive Your Progress Debrief",
      description:
        "Every week, get a personalized debrief with pattern insights, self-sabotage alerts, and concrete next-step nudges to keep you on track.",
      icon: <Sparkles className="h-8 w-8 text-indigo-600" />,
    },
    {
      number: "04",
      title: "Achieve With Clarity",
      description:
        "Over time, build deep self-awareness about your goal achievement patterns. Stop repeating the same mistakes and accelerate your progress.",
      icon: <Target className="h-8 w-8 text-indigo-600" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for getting started with structured weekly reviews.",
      features: [
        "Weekly journaling with guided prompts",
        "Basic weekly summary",
        "Up to 4 entries per month",
        "Goal tracking dashboard",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "Full AI coaching experience with deep pattern analysis.",
      features: [
        "Unlimited weekly entries",
        "Full longitudinal NLP analysis",
        "Personalized Progress Debriefs",
        "Goal drift detection alerts",
        "Behavioral pattern insights",
        "Self-sabotage trigger identification",
        "Priority AI processing",
      ],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Annual Pro",
      price: "$79",
      period: "/year",
      description: "Everything in Pro at 27% off. Commit to a year of growth.",
      features: [
        "Everything in Pro",
        "Save 27% vs monthly",
        "Annual progress report",
        "Early access to new features",
        "Community access",
      ],
      popular: false,
      cta: "Get Annual Plan",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How is ReflectIQ different from a regular journal app?",
      answer:
        "Regular journal apps just store your text. ReflectIQ actively reads across months of your entries using NLP to surface patterns you cannot see yourself — like recurring self-sabotage triggers, goal drift, and behavioral cycles. It then delivers actionable coaching based on YOUR own writing.",
    },
    {
      question: "Is this a therapy replacement?",
      answer:
        "No. ReflectIQ is designed for goal achievers, not therapy patients. Think of it as a structured weekly review system with an AI coach that understands your patterns over time. If you need mental health support, please work with a qualified therapist.",
    },
    {
      question: "How much time does it take each week?",
      answer:
        "Most users spend 5-10 minutes journaling their weekly entry. Reading your Progress Debrief takes another 2-3 minutes. That is under 15 minutes per week for deep self-awareness about your goal achievement patterns.",
    },
    {
      question: "Is my journal data private and secure?",
      answer:
        "Absolutely. Your entries are encrypted at rest and in transit. We never share your personal writing with third parties. Our AI processes your data solely to generate your insights — no human reads your entries.",
    },
    {
      question: "When do the AI insights become useful?",
      answer:
        "You will start getting basic insights after your first entry, but the real magic happens after 4-6 weeks of consistent journaling. The more data the AI has about your patterns over time, the more powerful and personalized your debriefs become.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ReflectIQ</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900">
              How It Works
            </a>
            <a href="#pricing" className="block text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#faq" className="block text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </a>
            <Separator />
            <div className="flex flex-col gap-2 pt-2">
              <a href="/login">
                <Button variant="ghost" className="w-full text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full text-sm bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Goal Coaching
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Stop repeating the same mistakes.{" "}
            <span className="text-indigo-600">Start understanding why.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ReflectIQ turns your weekly journaling into actionable self-insights. Our AI reads across months of your entries to surface behavioral patterns, goal drift, and self-sabotage triggers — then delivers personalized coaching nudges.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="text-base px-8 py-6">
                See How It Works
              </Button>
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Private & Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-green-600" />
              <span>5 min/week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to understand yourself better
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Not another mood tracker. ReflectIQ is built for goal achievers who want data-driven self-awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From journal entry to breakthrough insight in 4 steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Simple enough to stick with. Powerful enough to change how you pursue goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)]">
                    <div className="border-t-2 border-dashed border-indigo-200 w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            You already know what you want to achieve. The problem is understanding why you keep getting in your own way.
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Most ambitious people set the same goals quarter after quarter. They lack the self-awareness to see their own patterns. ReflectIQ gives you that missing mirror — built from your own words, over time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white">73%</div>
              <div className="text-sm text-indigo-100 mt-1">of people abandon goals within 6 weeks</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white">5x</div>
              <div className="text-sm text-indigo-100 mt-1">more likely to achieve goals with accountability</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white">10 min</div>
              <div className="text-sm text-indigo-100 mt-1">per week for transformative self-awareness</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Invest in understanding yourself
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when the insights become indispensable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-2 border-indigo-600 shadow-lg scale-105" : "border border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to finally understand your own patterns?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of ambitious 20-somethings who are using AI-powered self-insights to achieve their goals faster. Your first Progress Debrief is just one week of journaling away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">ReflectIQ</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                FAQ
              </a>
              <a href="/login" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                Sign In
              </a>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-sm text-gray-500">
            <p>{"© 2024 ReflectIQ. All rights reserved. Built for ambitious goal achievers."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}