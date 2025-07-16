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
        return <DollarSign className="w-4 h-4 text-green-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  /* ---------- UI ---------- */
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Authora
            </span>
            {user && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
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
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
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
                      className="relative text-gray-700 hover:text-purple-600"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {unreadCount}
                          </span>
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !n.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(n.type)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{n.title}</p>
                              <p className="text-sm text-gray-600">
                                {n.message}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3" />
                                {n.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                          {user.name?.charAt(0)?.toUpperCase() ||
                            user.email?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {user.name || user.email}
                        </p>
                        <div className="flex items-center">
                          <Shield className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">
                            Verified
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => signOut()}>
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
              className="text-gray-700"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && user && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Leaderboard</span>
              </Link>
              <div className="pt-4 flex items-center space-x-4">
                <ChainSelector />
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}