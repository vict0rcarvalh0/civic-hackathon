"use client"

import { useState, useEffect } from "react"
interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  time: string
}
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  ChevronDown,
  Menu,
  X,
  Home,
  Wallet,
  LinkIcon,
  BarChart3,
  DollarSign,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import ChainSelector from "./chain-selector"
import AuthButton from "./AuthButton"
import { useUser } from "@civic/auth-web3/react"

export default function DashboardNavigation() {
  const { user, signOut } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  /* ---------- Fetch notifications ---------- */
  useEffect(() => {
    async function load() {
      if (!user) {
        setNotifications([])
        return
      }
      try {
        const res = await fetch("/api/notifications", {
          headers: { "x-user-id": user.id || user.email || "" },
        })
        const json = await res.json()
        setNotifications(json.notifications || [])
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      }
    }
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  /* ---------- Helpers ---------- */
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-400" />
      default:
        return <Bell className="w-4 h-4 text-gray-400" />
    }
  }

  /* ---------- UI ---------- */
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              SkillPass
            </span>
            {user && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-600/20 text-purple-300 border-purple-500/30"
              >
                Dashboard
              </Badge>
            )}
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </Link>
              <Link
                href="/dashboard/invest"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <DollarSign className="w-4 h-4" />
                <span>Invest</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ChainSelector />
            {user ? (
              <>
                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/90 border-white/10 backdrop-blur-xl" align="end">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Notifications</h4>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-400">No notifications yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map((notif) => (
                        <div
                              key={notif.id}
                              className={`p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors ${
                                notif.read
                                  ? "bg-white/[0.02] border-white/5"
                                  : "bg-purple-600/10 border-purple-500/20"
                          }`}
                              onClick={() => markAsRead(notif.id)}
                        >
                              <div className="flex items-start space-x-3">
                                {getNotificationIcon(notif.type)}
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-white truncate">
                                    {notif.title}
                                  </h5>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.message}
                              </p>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {notif.time}
                                  </div>
                            </div>
                          </div>
                        </div>
                      ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/5">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-600 text-white">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 backdrop-blur-xl">
                    <DropdownMenuLabel className="text-white">
                      {user.name || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="text-gray-300 hover:text-white focus:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/security" className="text-gray-300 hover:text-white focus:text-white">
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onSelect={signOut}
                      className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <AuthButton />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white hover:bg-white/5"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && user && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/5">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4">
                <ChainSelector />
                  {!user && <AuthButton />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}