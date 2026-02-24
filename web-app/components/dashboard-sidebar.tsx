"use client"

import type React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  Home,
  LinkIcon,
  LogOut,
  Settings,
  Star,
  User,
  Zap,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { useAnalytics } from "@/hooks/use-analytics"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isPremium = user?.role === "PREMIUM"
  const { overview } = useAnalytics("30d")



  return (
    <SidebarProvider>
      <div className="grid min-h-screen  w-full md:grid-cols-[auto_1fr]">

        <Sidebar>
          <div className="absolute -top-40 right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
          <SidebarHeader className="flex h-14 border-b py-4 px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <LinkIcon className="h-5 w-5 text-primary" />
              <span>ShortCash</span>
              {isPremium && (
                <span className="ml-2 rounded bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">
                  PREMIUM
                </span>
              )}
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4 py-4">
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/urls"}>
                  <Link href="/dashboard/urls">
                    <LinkIcon className="h-4 w-4" />
                    <span>My URLs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/analytics"}>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/withdrawals"}>
                  <Link href="/dashboard/withdrawals">
                    <CreditCard className="h-4 w-4" />
                    <span>Withdrawals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"}>
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* {isPremium ? (
                <SidebarMenuItem >
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard/premium-tools"} >
                    <Link href="/dashboard/premium-tools" >
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Premium Tools</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/upgrade" className="font-bold">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500">Upgrade to Premium</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )} */}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <Button variant="outline" className="bg-destructive text-white w-full justify-center" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className=" flex flex-col">
          <header className="bg-muted/40 backdrop-blur-md sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 md:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:bg-muted/30 hover:text-primary"
              >
                <Link href="/dashboard/withdrawals">
                  Balance: ${overview?.balance ? Number(overview.balance).toFixed(2) : "0.00"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 rounded-full">
                <Link href="/dashboard/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={"/user.png"}
                      alt={user?.name || "user"}
                    />
                  </Avatar>
                </Link>
                <span className="sr-only">User menu</span>
              </Button>

            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 relative overflow-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
