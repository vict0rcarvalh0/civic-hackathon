"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Key,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  Trash2,
  Download,
} from "lucide-react"

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro",
      location: "New York, NY",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 15 Pro",
      location: "New York, NY",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Windows",
      location: "Los Angeles, CA",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  const loginHistory = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30",
      location: "New York, NY",
      device: "MacBook Pro",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-01-15 09:15",
      location: "New York, NY",
      device: "iPhone 15 Pro",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2024-01-14 22:45",
      location: "Unknown Location",
      device: "Chrome Browser",
      status: "failed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Security Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account security and privacy settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Security Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Password */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special
                    characters.
                  </AlertDescription>
                </Alert>

                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-gray-500">Use an authenticator app to generate verification codes</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>

                {!twoFactorEnabled && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Your account is not protected by two-factor authentication. Enable 2FA to secure your account.
                    </AlertDescription>
                  </Alert>
                )}

                {twoFactorEnabled && (
                  <div className="space-y-3">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Two-factor authentication is enabled and protecting your account.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Recovery Codes
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate Codes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-600" />
                  Active Sessions
                </CardTitle>
                <CardDescription>Manage devices that are currently signed in to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.current && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Login History */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Recent Login Activity
                </CardTitle>
                <CardDescription>Review recent sign-in attempts to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${login.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="font-medium text-sm">{login.device}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{login.timestamp}</span>
                          <span>{login.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={login.status === "success" ? "default" : "destructive"} className="text-xs">
                      {login.status === "success" ? "Success" : "Failed"}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Export Login History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Sidebar */}
          <div className="space-y-6">
            {/* Security Score */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">75%</div>
                  <p className="text-sm text-gray-600 mb-4">Good security level</p>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-sm">
                      <span>Strong password</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Email verified</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>2FA enabled</span>
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Preferences */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Login Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
                  </div>
                  <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Actions */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Emergency Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                  Sign Out All Devices
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                  Reset All Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
