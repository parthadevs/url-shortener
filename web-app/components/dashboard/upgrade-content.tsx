"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Rocket, Shield, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export function UpgradeContent() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [paymentStep, setPaymentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)

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
    <div className="container mx-auto max-w-7xl">
      {paymentStep === 1 ? (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <Sparkles className="mr-2 inline-block h-8 w-8 text-primary" />
              Upgrade to Premium
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Unlock advanced features and increase your earnings with ShortCash Premium
            </p>
          </div>

          <Tabs defaultValue="monthly" className="mb-8" onValueChange={setSelectedPlan}>
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly Billing <span className="ml-1 text-xs text-primary">Save 15%</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>{plans.free.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plans.free.price}</span>
                  <span className="text-sm text-muted-foreground">{plans.free.period}</span>
                </div>
                <CardDescription>{plans.free.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">What&apos;s included:</h3>
                    <ul className="space-y-2 text-sm">
                      {plans.free.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Not included:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plans.free.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2 h-4 w-4">-</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Basic Plan */}
            <Card>
              <CardHeader>
                <CardTitle>{plans.basic.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plans.basic.price}</span>
                  <span className="text-sm text-muted-foreground">{plans.basic.period}</span>
                </div>
                <CardDescription>{plans.basic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">What&apos;s included:</h3>
                    <ul className="space-y-2 text-sm">
                      {plans.basic.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUpgrade("basic")}>
                  Upgrade to Basic
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary">
              {plans.pro.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plans.pro.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plans.pro.price}</span>
                  <span className="text-sm text-muted-foreground">{plans.pro.period}</span>
                </div>
                <CardDescription>{plans.pro.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">What&apos;s included:</h3>
                    <ul className="space-y-2 text-sm">
                      {plans.pro.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUpgrade("pro")}>
                  Upgrade to Pro
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>{plans.enterprise.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plans.enterprise.price}</span>
                  <span className="text-sm text-muted-foreground">{plans.enterprise.period}</span>
                </div>
                <CardDescription>{plans.enterprise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">What&apos;s included:</h3>
                    <ul className="space-y-2 text-sm">
                      {plans.enterprise.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUpgrade("enterprise")}>
                  Upgrade to Enterprise
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="text-center">
                  <Zap className="mx-auto h-8 w-8 text-primary" />
                  <CardTitle>Increased Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    Earn up to 3x more per click with premium plans. Maximize your revenue with higher rates and better
                    conversion.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Rocket className="mx-auto h-8 w-8 text-primary" />
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    Gain deeper insights with advanced analytics. Track user behavior, geographic data, and conversion
                    rates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Shield className="mx-auto h-8 w-8 text-primary" />
                  <CardTitle>Priority Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    Get faster responses and dedicated support. Our premium support team is ready to help you succeed.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-bold">Frequently Asked Questions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium">Can I upgrade or downgrade at any time?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will
                    take effect at the end of your billing cycle.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How do the increased earnings work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium plans earn at higher rates for each click. Basic earns 1.5x, Pro earns 2x, and Enterprise
                    earns 3x compared to the free plan.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Is there a refund policy?</h3>
                  <p className="text-sm text-muted-foreground">
                    We offer a 14-day money-back guarantee if you&apos;re not satisfied with your premium plan.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, PayPal, and cryptocurrency payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Complete Your Upgrade</h1>
            <p className="text-muted-foreground">Enter your payment details to continue</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Your subscription will begin immediately after payment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <RadioGroup defaultValue="card" onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  <Separator />

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="rounded-md bg-muted p-4 text-center">
                      <p className="text-sm">You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}

                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>$19.99</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>$1.60</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>$21.59</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Complete Payment"}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setPaymentStep(1)}>
                    Back to Plans
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
