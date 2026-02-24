"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AtSign, Building, Check, Globe, Info, MapPin, RotateCcw, Save, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../auth-context"

// List of countries for the dropdown
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "bd", label: "Bangladesh" },
  { value: "cn", label: "China" },
  { value: "ru", label: "Russia" },
  { value: "za", label: "South Africa" },
  { value: "mx", label: "Mexico" },
  { value: "sg", label: "Singapore" },
  // Add more countries as needed
]

export default function ProfileContent() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileComplete, setProfileComplete] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    paymentEmail: "",
    paymentMethod: "paypal",
  })

  const { theme, setTheme } = { theme: 'dark', setTheme: (t: string) => { } }; // Temporary if needed, or assume useEnhancedTheme is available if I want to sync

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          zipCode: data.zipCode || "",
          paymentEmail: data.paymentEmail || "",
          paymentMethod: data.paymentMethod || "paypal",
        })

        // Check if profile is complete for withdrawals
        const isComplete = !!(
          data.name &&
          data.address &&
          data.city &&
          data.country &&
          data.zipCode &&
          data.paymentEmail
        )
        setProfileComplete(isComplete)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token, toast])

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: any) => {
    setProfileData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleCountryChange = (value: any) => {
    setProfileData((prev) => ({ ...prev, country: value }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })


      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }


      // Check if profile is now complete
      const isComplete = !!(
        profileData.name &&
        profileData.address &&
        profileData.city &&
        profileData.country &&
        profileData.zipCode &&
        profileData.paymentEmail
      )
      setProfileComplete(isComplete)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
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
  console.log(profileData)
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
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Profile Settings</h2>
          <p className="text-muted-foreground text-lg">Manage your personal information and payment details.</p>
        </motion.div>

        {!profileComplete && (
          <motion.div variants={itemVariants}>
            <Alert
              variant="destructive"
              className="bg-destructive/5 border-destructive/20 backdrop-blur-xl"
            >
              <Info className="h-4 w-4" />
              <AlertTitle className="text-lg font-bold">Complete your profile</AlertTitle>
              <AlertDescription className="text-muted-foreground italic">
                Please complete your profile information to enable withdrawals. We need your full address and payment
                details for verification purposes.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                <CardTitle className="text-xl font-bold">Account Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <CardContent className="space-y-6 pt-6 flex-grow">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground">@</span>
                      <Input
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3   h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        ZIP/Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Select value={profileData.country} onValueChange={handleCountryChange} required>
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="bg-primary/5 border-t border-border/50 mt-auto p-6">
                  <Button type="submit" disabled={isLoading} className="w-full bg-primary/80 hover:bg-primary transition-all duration-300">
                    {isLoading ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden h-full">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                <CardTitle className="text-xl font-bold">Payment Settings</CardTitle>
                <CardDescription>Configure how you want to receive your earnings</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <CardContent className="space-y-6 pt-6 flex-grow">
                  <div className="space-y-2">
                    <Label>
                      Payment Method <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={profileData.paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      className="flex flex-col space-y-1"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="font-normal">
                          PayPal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="font-normal">
                          Bank Transfer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="crypto" id="crypto" />
                        <Label htmlFor="crypto" className="font-normal">
                          Cryptocurrency
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentEmail">
                      Payment Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-[14px] h-4 w-4 text-muted-foreground" />
                      <Input
                        id="paymentEmail"
                        name="paymentEmail"
                        value={profileData.paymentEmail}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="payment@example.com"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {profileData.paymentMethod === "paypal"
                        ? "Your PayPal email address"
                        : profileData.paymentMethod === "bank"
                          ? "Your email for bank transfer details"
                          : "Your email for cryptocurrency wallet details"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium text-sm">Withdrawal Requirements</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center ${profileData.name ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {profileData.name && <Check className="h-3 w-3" />}
                        </div>
                        Full Name
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center ${profileData.address && profileData.city ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {profileData.address && profileData.city && <Check className="h-3 w-3" />}
                        </div>
                        Address and City
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center ${profileData.country ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {profileData.country && <Check className="h-3 w-3" />}
                        </div>
                        Country
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center ${profileData.zipCode ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {profileData.zipCode && <Check className="h-3 w-3" />}
                        </div>
                        ZIP/Postal Code
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center ${profileData.paymentEmail ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {profileData.paymentEmail && <Check className="h-3 w-3" />}
                        </div>
                        Payment Email
                      </li>
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      All fields marked with <span className="text-red-500">*</span> are required for withdrawals.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-primary/5 border-t border-border/50 mt-auto p-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Button type="submit" className="w-full bg-primary/80 hover:bg-primary transition-all duration-300" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Payment Settings
                              </>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background/90 backdrop-blur-lg border-border/50">
                        <p>Complete your profile to enable withdrawals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="text-xl font-bold">Account Verification</CardTitle>
              <CardDescription>Verify your account to unlock additional features</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Identity Verification</h3>
                      <p className="text-sm text-muted-foreground">Verify your identity to increase withdrawal limits</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">Verify</Button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Address Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Verify your address with a utility bill or bank statement
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">Verify</Button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Domain Verification</h3>
                      <p className="text-sm text-muted-foreground">Verify domain ownership for branded short URLs</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">Verify</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
