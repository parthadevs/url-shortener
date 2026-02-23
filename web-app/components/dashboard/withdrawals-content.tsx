"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ArrowDown, ArrowUp, Calendar, CreditCard, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function WithdrawalsContent() {
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Withdrawals</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Your current available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{balance ? Number(balance).toFixed(2) : "0.00"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Withdraw your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {!profileComplete && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Incomplete Profile</AlertTitle>
                <AlertDescription>
                  Please complete your profile before requesting a withdrawal.
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {missingFields.name && <li>Full Name</li>}
                    {missingFields.address && <li>Address</li>}
                    {missingFields.city && <li>City</li>}
                    {missingFields.country && <li>Country</li>}
                    {missingFields.zipCode && <li>ZIP/Postal Code</li>}
                    {missingFields.paymentEmail && <li>Payment Email</li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <div className="text-sm text-muted-foreground">Minimum withdrawal amount: $10.00</div>
            {!profileComplete ? (
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/profile")}>
                Complete Profile
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={
                  isLoading || !amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > balance
                }
              >
                {isLoading ? "Processing..." : "Request Withdrawal"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>View your withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length > 0 ? (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {withdrawal.status === "approved" ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : withdrawal.status === "rejected" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">${withdrawal.amount ? Number(withdrawal.amount).toFixed(2) : "0.00"}</span>

                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium capitalize ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{withdrawal.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(withdrawal.createdAt)}</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No withdrawals yet</h3>
              <p className="text-sm text-muted-foreground">
                Your withdrawal history will appear here once you make a request.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
