"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  Check,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Info,
  Key,
  Laptop,
  Lock,
  LogOut,
  Moon,
  Paintbrush,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useEnhancedTheme, Theme } from "@/lib/theme-provider-enhanced"

import { motion } from "framer-motion"

export default function SettingsContent() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { theme, setTheme, saveThemePreference } = useEnhancedTheme()

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

  // State for settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      marketing: false,
      security: true,
      updates: true,
    },
    appearance: {
      theme: "system",
      reducedMotion: false,
      fontSize: "medium",
    },
    security: {
      sessionTimeout: 30,
      twoFactorEnabled: false,
    },
    api: {
      apiKeyEnabled: false,
      apiKey: "",
      lastGenerated: "",
    },
  })

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const [isLoadingSessions, setIsLoadingSessions] = useState(true)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false)
  const [isRevokingApiKey, setIsRevokingApiKey] = useState(false)

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)

          // Sync theme with settings
          if (data.appearance?.theme) {
            setTheme(data.appearance.theme)
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchSettings()
    }
  }, [token, setTheme, toast])


  // Calculate password strength
  useEffect(() => {
    const { newPassword } = passwordData
    if (!newPassword) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    let strength = 0
    let feedback = ""

    // Length check
    if (newPassword.length >= 8) {
      strength += 1
    } else {
      feedback = "Password should be at least 8 characters long"
    }

    // Uppercase check
    if (/[A-Z]/.test(newPassword)) {
      strength += 1
    } else if (!feedback) {
      feedback = "Add an uppercase letter"
    }

    // Lowercase check
    if (/[a-z]/.test(newPassword)) {
      strength += 1
    } else if (!feedback) {
      feedback = "Add a lowercase letter"
    }

    // Number check
    if (/[0-9]/.test(newPassword)) {
      strength += 1
    } else if (!feedback) {
      feedback = "Add a number"
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(newPassword)) {
      strength += 1
    } else if (!feedback) {
      feedback = "Add a special character"
    }

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }, [passwordData])

  // Handle notification settings change
  const handleNotificationChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  // Handle appearance settings change
  const handleAppearanceChange = (key: string, value: string | boolean) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    }

    setSettings(newSettings)

    // If theme is changed, update it immediately
    if (key === "theme") {
      setTheme(value as Theme)
    }
  }

  // Handle security settings change
  const handleSecurityChange = (key: any, value: any) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }))
  }

  // Handle password input change
  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })

      // If theme was changed, save it to user preferences
      if (settings.appearance.theme !== theme) {
        await saveThemePreference(settings.appearance.theme as Theme)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Change password
  const changePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 3) {
      toast({
        title: "Error",
        description: "Password is not strong enough. " + passwordFeedback,
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to change password")
      }

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Generate API key
  const generateApiKey = async () => {
    setIsGeneratingApiKey(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/api-key`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate API key")
      }

      const data = await response.json()

      setSettings((prev) => ({
        ...prev,
        api: {
          ...prev.api,
          apiKeyEnabled: true,
          apiKey: data.apiKey,
          lastGenerated: data.lastGenerated,
        },
      }))

      toast({
        title: "API key generated",
        description: "Your new API key has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating API key:", error)
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingApiKey(false)
    }
  }

  // Revoke API key
  const revokeApiKey = async () => {
    setIsRevokingApiKey(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/api-key`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to revoke API key")
      }

      setSettings((prev) => ({
        ...prev,
        api: {
          ...prev.api,
          apiKeyEnabled: false,
          apiKey: "",
        },
      }))

      toast({
        title: "API key revoked",
        description: "Your API key has been revoked successfully.",
      })
    } catch (error) {
      console.error("Error revoking API key:", error)
      toast({
        title: "Error",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRevokingApiKey(false)
    }
  }

  // Copy API key to clipboard
  const copyApiKey = () => {
    navigator.clipboard.writeText(settings.api.apiKey)
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    })
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
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Settings</h2>
          <p className="text-muted-foreground text-lg">Manage your account settings and preferences.</p>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-8">
          <motion.div variants={itemVariants}>
            <TabsList className="bg-background/40 backdrop-blur-lg border border-border/50 p-1 h-12 inline-flex mb-2">
              <TabsTrigger value="general" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 transition-all">
                <Settings className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 transition-all">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 transition-all">
                <Paintbrush className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 transition-all">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 transition-all">
                <Key className="mr-2 h-4 w-4" />
                API
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your basic account settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user?.name || ""} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue={user?.username || ""} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? (
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
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                      <Label htmlFor="email-notifications" className="flex items-center">
                        Email Notifications
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Receive important notifications via email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="security-alerts"
                        checked={settings.notifications.security}
                        onCheckedChange={(checked) => handleNotificationChange("security", checked)}
                      />
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="product-updates"
                        checked={settings.notifications.updates}
                        onCheckedChange={(checked) => handleNotificationChange("updates", checked)}
                      />
                      <Label htmlFor="product-updates">Product Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing-emails"
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                      />
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <RadioGroup defaultValue="immediately">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediately" id="immediately" />
                        <Label htmlFor="immediately">Immediately</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily Digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly Digest</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? (
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
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the application looks and feels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={settings.appearance.theme === "light" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => handleAppearanceChange("theme", "light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => handleAppearanceChange("theme", "dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={settings.appearance.theme === "system" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => handleAppearanceChange("theme", "system")}
                      >
                        <Laptop className="mr-2 h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <RadioGroup
                      value={settings.appearance.fontSize}
                      onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large">Large</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reduced-motion"
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                    />
                    <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? (
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
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="bg-background/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="bg-background/50"
                      />
                    </div>
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Password strength:</span>
                          <span className="text-sm font-medium">
                            {passwordStrength === 0 && "Very Weak"}
                            {passwordStrength === 1 && "Weak"}
                            {passwordStrength === 2 && "Fair"}
                            {passwordStrength === 3 && "Good"}
                            {passwordStrength === 4 && "Strong"}
                            {passwordStrength === 5 && "Very Strong"}
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${passwordStrength === 0 ? "bg-destructive/50" : ""} ${passwordStrength === 1 ? "w-1/5 bg-destructive" : ""
                              } ${passwordStrength === 2 ? "w-2/5 bg-orange-500" : ""} ${passwordStrength === 3 ? "w-3/5 bg-yellow-500" : ""
                              } ${passwordStrength === 4 ? "w-4/5 bg-green-500" : ""} ${passwordStrength === 5 ? "w-full bg-green-500" : ""
                              }`}
                          />
                        </div>
                        {passwordFeedback && <p className="mt-1 text-xs text-muted-foreground">{passwordFeedback}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="bg-background/50"
                      />
                    </div>
                    {passwordData.newPassword && passwordData.confirmPassword && (
                      <div className="mt-1 flex items-center gap-2">
                        {passwordData.newPassword === passwordData.confirmPassword ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {passwordData.newPassword === passwordData.confirmPassword
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-primary/5 border-t border-border/50">
                  <Button onClick={changePassword} disabled={isChangingPassword} className="w-full">
                    {isChangingPassword ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden mt-8">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="space-y-0.5">
                      <div className="font-semibold">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Protect your account with an additional verification step.
                      </div>
                    </div>
                    <div>
                      {settings.security.twoFactorEnabled ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted/50 text-muted-foreground shadow-none">
                          Disabled
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary">Coming Soon</AlertTitle>
                    <AlertDescription>Two-factor authentication will be available in a future update.</AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Setup Two-Factor Authentication
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-xl shadow-xl overflow-hidden mt-8">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Delete Account</AlertTitle>
                    <AlertDescription>
                      This action is irreversible. All your data will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="bg-destructive/10 border-t border-destructive/20">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/90 backdrop-blur-2xl border-border/50">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-lg">
                          This action cannot be undone. This will permanently delete your account and remove your data
                          from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2 text-center">
                          <Label htmlFor="confirm-delete" className="text-foreground/70">Type <span className="font-bold text-destructive">DELETE</span> to confirm</Label>
                          <Input id="confirm-delete" placeholder="DELETE" className="text-center h-12 uppercase" />
                        </div>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" className="flex-1">Cancel</Button>
                        <Button variant="destructive" disabled className="flex-1">
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>Manage your API keys and access to the API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="space-y-0.5">
                      <div className="font-semibold">API Access Status</div>
                      <div className="text-sm text-muted-foreground">Enable or disable API access for your account.</div>
                    </div>
                    <div>
                      {settings.api.apiKeyEnabled ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted/50 text-muted-foreground shadow-none">
                          Disabled
                        </Badge>
                      )}
                    </div>
                  </div>
                  {settings.api.apiKeyEnabled && settings.api.apiKey && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold ml-1">Your API Key</Label>
                      <div className="flex items-center space-x-2">
                        <Input value={settings.api.apiKey} readOnly type="password" className="font-mono bg-background/50 h-11" />
                        <Button variant="outline" size="icon" onClick={copyApiKey} className="h-11 w-11 hover:bg-primary/10">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground ml-1">
                        Last generated: {new Date(settings.api.lastGenerated).toLocaleString()}
                      </p>
                    </motion.div>
                  )}
                  <Alert className="bg-blue-500/5 border-blue-500/20">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-500">API Documentation</AlertTitle>
                    <AlertDescription className="text-blue-500/80">
                      View our API documentation to learn how to integrate with our services and build amazing tools.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between bg-primary/5 border-t border-border/50 p-6">
                  {settings.api.apiKeyEnabled ? (
                    <>
                      <Button variant="outline" onClick={revokeApiKey} disabled={isRevokingApiKey} className="border-destructive/20 text-destructive hover:bg-destructive/10">
                        {isRevokingApiKey ? (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                            Revoking...
                          </>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Revoke Key
                          </>
                        )}
                      </Button>
                      <Button onClick={generateApiKey} disabled={isGeneratingApiKey} className="bg-primary/80 hover:bg-primary">
                        {isGeneratingApiKey ? (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Regenerate Key
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={generateApiKey} disabled={isGeneratingApiKey} className="w-full bg-primary/80 hover:bg-primary">
                      {isGeneratingApiKey ? (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Generate API Key
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden mt-8">
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                  <CardDescription>Monitor your API usage and rate limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Requests this month</Label>
                        <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/20">0 / 1,000</Badge>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "0%" }}
                          className="h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Your plan includes 1,000 API requests per month.</p>
                    </div>
                    <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Rate limit</Label>
                        <span className="font-mono text-sm">60 req/min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 bg-primary/5">
                  <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Plan for More Access
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div >
  )
}
