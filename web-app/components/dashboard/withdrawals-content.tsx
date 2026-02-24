"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ArrowDown, ArrowUp, Calendar, CreditCard, DollarSign, RotateCcw } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function WithdrawalsContent() {
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

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
  const [isLoading, setIsLoading] = useState(false)
  const [withdrawals, setWithdrawals] = useState<{ id: string; amount: number; status: string; paymentMethod: string; createdAt: string }[]>([])
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [profileComplete, setProfileComplete] = useState(true)
  const [missingFields, setMissingFields] = useState<{
    name?: boolean
    address?: boolean
    city?: boolean
    country?: boolean
    zipCode?: boolean
    paymentEmail?: boolean
  }>({})

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/withdrawals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setWithdrawals(data)
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
      }
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setBalance(data.balance || 0)

          // Check if profile is complete
          const isComplete = !!(
            data.name &&
            data.address &&
            data.city &&
            data.country &&
            data.zipCode &&
            data.paymentEmail
          )

          setProfileComplete(isComplete)

          // Set missing fields
          setMissingFields({
            name: !data.name,
            address: !data.address,
            city: !data.city,
            country: !data.country,
            zipCode: !data.zipCode,
            paymentEmail: !data.paymentEmail,
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    if (token) {
      fetchWithdrawals()
      fetchProfile()
    }
  }, [token])

  const handleWithdraw = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
        }),
      })


      if (!response.ok) {
        const data = await response.json()

        // Handle incomplete profile error
        if (data.error === "Incomplete profile") {
          setProfileComplete(false)
          setMissingFields(data.missingFields || {})
          throw new Error("Please complete your profile before withdrawing.")
        }

        throw new Error(data.error || "Failed to create withdrawal")
      }

      const data = await response.json()

      // Update withdrawals list and balance
      setWithdrawals([data, ...withdrawals])
      setBalance(balance - Number.parseFloat(amount))
      setAmount("")

      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500"
      case "rejected":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 relative z-10"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Withdrawals</h2>
          <p className="text-muted-foreground text-lg">Manage and track your earnings withdrawals.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Available Balance
                </CardTitle>
                <CardDescription>Your current earnings ready for withdrawal</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 pb-10 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-primary tracking-tighter mb-2">
                  ${balance ? Number(balance).toFixed(2) : "0.00"}
                </div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">USD Balance</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                <CardTitle className="text-xl font-bold">Request Withdrawal</CardTitle>
                <CardDescription>Withdraw your earnings to your preferred method</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!profileComplete && (
                  <Alert variant="destructive" className="mb-6 bg-destructive/5 border-destructive/20 backdrop-blur-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Incomplete Profile</AlertTitle>
                    <AlertDescription className="mt-2 text-sm italic">
                      Please complete your profile before requesting a withdrawal.
                      <div className="mt-3 flex flex-wrap gap-2">
                        {missingFields.name && <Badge variant="outline" className="bg-destructive/10">Full Name</Badge>}
                        {missingFields.address && <Badge variant="outline" className="bg-destructive/10">Address</Badge>}
                        {missingFields.city && <Badge variant="outline" className="bg-destructive/10">City</Badge>}
                        {missingFields.country && <Badge variant="outline" className="bg-destructive/10">Country</Badge>}
                        {missingFields.zipCode && <Badge variant="outline" className="bg-destructive/10">ZIP Code</Badge>}
                        {missingFields.paymentEmail && <Badge variant="outline" className="bg-destructive/10">Payment Email</Badge>}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-semibold ml-1">Amount to Withdraw</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 bg-primary/5 border-t border-border/50 p-6">
                <div className="text-xs text-muted-foreground italic font-medium">Minimum withdrawal: <span className="text-primary">$10.00</span></div>
                {!profileComplete ? (
                  <Button variant="outline" className="w-full h-11 border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300 font-bold" onClick={() => router.push("/dashboard/profile")}>
                    Complete Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full h-11 bg-primary/80 hover:bg-primary transition-all duration-300 font-bold"
                    onClick={handleWithdraw}
                    disabled={
                      isLoading || !amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > balance
                    }
                  >
                    {isLoading ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Withdrawal History
              </CardTitle>
              <CardDescription>View and track your previous withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <motion.div
                      key={withdrawal.id}
                      className="group p-4 rounded-xl border border-border/50 bg-background/30 hover:bg-primary/5 transition-all duration-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${withdrawal.status === "approved" ? "bg-green-500/10" :
                            withdrawal.status === "rejected" ? "bg-red-500/10" : "bg-yellow-500/10"
                            }`}>
                            {withdrawal.status === "approved" ? (
                              <ArrowUp className="h-4 w-4 text-green-500" />
                            ) : withdrawal.status === "rejected" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-lg">${Number(withdrawal.amount).toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(withdrawal.createdAt)}</div>
                          </div>
                        </div>
                        <Badge className={`px-3 py-1 font-bold ${withdrawal.status === "approved" ? "bg-green-500/20 text-green-500 border-green-500/50" :
                          withdrawal.status === "rejected" ? "bg-red-500/20 text-red-500 border-red-500/50" :
                            "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                          }`}>
                          {withdrawal.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2 bg-background/50 px-3 py-1 rounded-full border border-border/30">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span className="font-medium">{withdrawal.paymentMethod}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-background/50 px-3 py-1 rounded-full border border-border/30">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium text-[11px] truncate">{withdrawal.id}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No withdrawals yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                    Your withdrawal history will appear here once you make a request.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
