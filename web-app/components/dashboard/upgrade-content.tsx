"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Rocket, RotateCcw, Shield, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export function UpgradeContent() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [paymentStep, setPaymentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const plans = {
    free: {
      name: "Free",
      price: "$0",
      period: "",
      description: "Basic URL shortening with limited features",
      features: ["Basic URL shortening", "Up to 50 URLs", "Basic analytics", "Standard earnings rate", "Email support"],
      notIncluded: [
        "Priority support",
        "Custom short URLs",
        "Advanced analytics",
        "API access",
        "Higher earnings rate",
      ],
    },
    basic: {
      name: "Basic",
      price: selectedPlan === "monthly" ? "$9.99" : "$99.99",
      period: selectedPlan === "monthly" ? "/month" : "/year",
      description: "Perfect for individuals and small businesses",
      features: [
        "Everything in Free",
        "Up to 500 URLs",
        "Enhanced analytics",
        "1.5x earnings rate",
        "Custom short URLs",
        "Priority email support",
      ],
    },
    pro: {
      name: "Pro",
      price: selectedPlan === "monthly" ? "$19.99" : "$199.99",
      period: selectedPlan === "monthly" ? "/month" : "/year",
      description: "Ideal for professionals and growing businesses",
      features: [
        "Everything in Basic",
        "Unlimited URLs",
        "Advanced analytics",
        "2x earnings rate",
        "API access",
        "Custom branded domains",
        "Priority support",
        "Team collaboration",
      ],
      popular: true,
    },
    enterprise: {
      name: "Enterprise",
      price: selectedPlan === "monthly" ? "$49.99" : "$499.99",
      period: selectedPlan === "monthly" ? "/month" : "/year",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Pro",
        "3x earnings rate",
        "Dedicated account manager",
        "Custom integration support",
        "Advanced security features",
        "SLA guarantees",
        "White-label solution",
        "Enterprise API with higher rate limits",
      ],
    },
  }

  const handleUpgrade = (plan: string) => {
    setPaymentStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Upgrade successful!",
        description: "Your account has been upgraded to premium.",
      })
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="relative space-y-12 min-h-screen pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 relative z-10"
      >
        <AnimatePresence mode="wait">
          {paymentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">Premium Access</span>
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
                >
                  Elevate Your Experience
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="max-w-2xl mx-auto text-lg text-muted-foreground italic"
                >
                  Unlock powerful tools, higher earnings, and exclusive features with ShortCash Premium.
                </motion.p>
              </div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <Tabs defaultValue="monthly" className="w-[400px]" onValueChange={setSelectedPlan}>
                  <TabsList className="grid w-full grid-cols-2 h-12 bg-background/50 backdrop-blur-xl border border-border/50 p-1 rounded-xl shadow-lg">
                    <TabsTrigger value="monthly" className="rounded-lg font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="rounded-lg font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300">
                      Yearly <span className="ml-1 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">SAVE 15%</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Free Plan */}
                <motion.div variants={itemVariants}>
                  <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-500">
                    <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                      <CardTitle className="text-xl font-bold">{plans.free.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{plans.free.price}</span>
                        <span className="text-sm text-muted-foreground font-medium">{plans.free.period}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{plans.free.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow ">
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">What&apos;s included:</h3>
                          <ul className="space-y-3 text-sm">
                            {plans.free.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Separator className="bg-border/30" />
                        <div>
                          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Not included:</h3>
                          <ul className="space-y-3 text-sm opacity-60">
                            {plans.free.notIncluded.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="h-4 w-4 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">•</span>
                                <span className="text-muted-foreground italic">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-border/50 p-6">
                      <Button variant="outline" className="w-full border-primary/20 text-primary/50 cursor-not-allowed" disabled>
                        Current Plan
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Basic Plan */}
                <motion.div variants={itemVariants}>
                  <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full flex flex-col hover:border-primary/50 transition-all duration-500">
                    <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                      <CardTitle className="text-xl font-bold">{plans.basic.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{plans.basic.price}</span>
                        <span className="text-sm text-muted-foreground font-medium">{plans.basic.period}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{plans.basic.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow">
                      <div className="space-y-6">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Features:</h3>
                        <ul className="space-y-3 text-sm">
                          {plans.basic.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-border/50 p-6">
                      <Button className="w-full bg-primary/80 hover:bg-primary transition-all duration-300 font-bold shadow-lg shadow-primary/20" onClick={() => handleUpgrade("basic")}>
                        Upgrade Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Pro Plan */}
                <motion.div variants={itemVariants}>
                  <Card className="relative border-primary bg-primary/5 backdrop-blur-2xl shadow-2xl overflow-hidden h-full flex flex-col scale-105 z-20">
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-tighter px-6 py-1 rotate-45 translate-x-4 translate-y-2 shadow-sm">
                        Popular
                      </div>
                    </div>
                    <CardHeader className="bg-primary/10 border-b border-primary/20 pb-6">
                      <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5 fill-primary" />
                        {plans.pro.name}
                      </CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-primary">{plans.pro.price}</span>
                        <span className="text-sm text-primary/70 font-medium">{plans.pro.period}</span>
                      </div>
                      <CardDescription className="text-primary/70 font-medium line-clamp-2">{plans.pro.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow bg-primary/[0.02]">
                      <div className="space-y-6">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Elite Features:</h3>
                        <ul className="space-y-3 text-sm">
                          {plans.pro.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-foreground/80 font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-primary/10 border-t border-primary/20 p-6">
                      <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 font-black uppercase tracking-wider shadow-xl shadow-primary/30" onClick={() => handleUpgrade("pro")}>
                        Get Pro Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div variants={itemVariants}>
                  <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-500">
                    <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                      <CardTitle className="text-xl font-bold">{plans.enterprise.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{plans.enterprise.price}</span>
                        <span className="text-sm text-muted-foreground font-medium">{plans.enterprise.period}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{plans.enterprise.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow ">
                      <div className="space-y-6">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Enterprise Features:</h3>
                        <ul className="space-y-3 text-sm">
                          {plans.enterprise.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-border/50 p-6">
                      <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 transition-all duration-300 font-bold" onClick={() => handleUpgrade("enterprise")}>
                        Contact Sales
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>

              <div className="mt-20 space-y-12">
                <div className="grid gap-8 md:grid-cols-3">
                  <motion.div variants={itemVariants}>
                    <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl hover:bg-primary/5 transition-all duration-300 group h-full">
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Zap className="h-8 w-8 text-primary shadow-sm" />
                        </div>
                        <CardTitle className="text-xl font-bold">Increased Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed italic">
                          Earn up to 3x more per click with premium plans. Maximize your revenue with higher rates and better
                          conversion power.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl hover:bg-primary/5 transition-all duration-300 group h-full">
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Rocket className="h-8 w-8 text-primary shadow-sm" />
                        </div>
                        <CardTitle className="text-xl font-bold">Advanced Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed italic">
                          Gain deeper insights with real-time analytics. Track user behavior, geographic data, and conversion
                          rates with precision.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl hover:bg-primary/5 transition-all duration-300 group h-full">
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Shield className="h-8 w-8 text-primary shadow-sm" />
                        </div>
                        <CardTitle className="text-xl font-bold">Priority Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed italic">
                          Get lightning-fast responses and dedicated support. Our premium support team is ready to help you succeed 24/7.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="rounded-2xl border border-border/50 bg-background/30 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <h2 className="mb-8 text-2xl font-black tracking-tight border-b border-border/30 pb-4">Frequently Asked Questions</h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground/90 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Can I upgrade or downgrade at any time?
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will
                        take effect at the end of your billing cycle.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground/90 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        How do the increased earnings work?
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Premium plans earn at higher rates for each click. Basic earns 1.5x, Pro earns 2x, and Enterprise
                        earns 3x compared to the free plan.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground/90 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Is there a refund policy?
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We offer a 14-day money-back guarantee if you&apos;re not satisfied with your premium plan. No questions asked.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground/90 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        What payment methods do you accept?
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We accept all major credit cards, PayPal, and various cryptocurrency payments including BTC, ETH, and USDT.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-xl py-10"
            >
              <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Complete Your Upgrade</h1>
                <p className="text-muted-foreground italic">You&apos;re just one step away from premium power</p>
              </div>

              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-border/50 p-8">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Your subscription will begin immediately after secure payment</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="space-y-6">
                      <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 border border-border/50 p-3 rounded-xl bg-background/30 hover:bg-primary/5 transition-colors cursor-pointer">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center font-bold cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-border/50 p-3 rounded-xl bg-background/30 hover:bg-primary/5 transition-colors cursor-pointer">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="font-bold cursor-pointer">PayPal</Label>
                        </div>
                      </RadioGroup>

                      <Separator className="bg-border/30" />

                      {paymentMethod === "card" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name on Card</Label>
                            <Input id="name" placeholder="John Doe" required className="bg-background/50 border-border/50 h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-number" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Card Number</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" required className="bg-background/50 border-border/50 h-11" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" required className="bg-background/50 border-border/50 h-11" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CVC</Label>
                              <Input id="cvc" placeholder="123" required className="bg-background/50 border-border/50 h-11" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "paypal" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-primary/5 p-8 text-center border border-dashed border-primary/30"
                        >
                          <p className="text-sm font-medium italic">You will be redirected to PayPal to complete your payment securely.</p>
                        </motion.div>
                      )}

                      <div className="rounded-xl bg-muted/30 p-6 border border-border/50 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Plan Subtotal</span>
                          <span className="font-medium">$19.99</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Processing Tax (8%)</span>
                          <span className="font-medium">$1.60</span>
                        </div>
                        <Separator className="bg-border/30 my-1" />
                        <div className="flex items-center justify-between font-black text-lg">
                          <span>Total Amount</span>
                          <span className="text-primary">$21.59</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col space-y-3">
                      <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 transition-all duration-300 font-bold text-lg shadow-xl shadow-primary/30" disabled={loading}>
                        {loading ? (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Complete Payment"
                        )}
                      </Button>
                      <Button variant="ghost" type="button" className="w-full text-muted-foreground hover:text-foreground" onClick={() => setPaymentStep(1)}>
                        Back to Plans
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
