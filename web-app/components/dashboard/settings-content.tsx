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

export default function SettingsContent() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { theme, setTheme, saveThemePreference } = useEnhancedTheme()

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Paintbrush className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
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
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
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
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
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
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
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
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
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
                  />
                </div>
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password strength:</span>
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
                        className={`h-2 rounded-full ${passwordStrength === 0 ? "bg-destructive/50" : ""} ${passwordStrength === 1 ? "w-1/5 bg-destructive" : ""
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
                  />
                </div>
                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div className="mt-1 flex items-center">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <Check className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <X className="mr-1 h-4 w-4 text-destructive" />
                    )}
                    <span className="text-xs">
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={changePassword} disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
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

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Protect your account with an additional verification step.
                  </div>
                </div>
                <div>
                  {settings.security.twoFactorEnabled ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Disabled
                    </Badge>
                  )}
                </div>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Not yet available</AlertTitle>
                <AlertDescription>Two-factor authentication will be available in a future update.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                <Shield className="mr-2 h-4 w-4" />
                Setup Two-Factor Authentication
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Delete Account</AlertTitle>
                <AlertDescription>
                  This action is irreversible. All your data will be permanently deleted.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data
                      from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
                      <Input id="confirm-delete" placeholder="DELETE" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys and access to the API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">API Access</div>
                  <div className="text-sm text-muted-foreground">Enable or disable API access for your account.</div>
                </div>
                <div>
                  {settings.api.apiKeyEnabled ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Disabled
                    </Badge>
                  )}
                </div>
              </div>
              {settings.api.apiKeyEnabled && settings.api.apiKey && (
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={settings.api.apiKey} readOnly type="password" className="font-mono" />
                    <Button variant="outline" size="icon" onClick={copyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last generated: {new Date(settings.api.lastGenerated).toLocaleString()}
                  </p>
                </div>
              )}
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>API Documentation</AlertTitle>
                <AlertDescription>
                  View our API documentation to learn how to integrate with our services.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              {settings.api.apiKeyEnabled ? (
                <>
                  <Button variant="outline" onClick={revokeApiKey} disabled={isRevokingApiKey}>
                    {isRevokingApiKey ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Revoking...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Revoke API Key
                      </>
                    )}
                  </Button>
                  <Button onClick={generateApiKey} disabled={isGeneratingApiKey}>
                    {isGeneratingApiKey ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Regenerate API Key
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={generateApiKey} disabled={isGeneratingApiKey}>
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

          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Monitor your API usage and rate limits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Requests this month</Label>
                    <span className="font-medium">0 / 1,000</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-0 rounded-full bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Your plan includes 1,000 API requests per month.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Rate limit</Label>
                    <span className="font-medium">60 requests per minute</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
