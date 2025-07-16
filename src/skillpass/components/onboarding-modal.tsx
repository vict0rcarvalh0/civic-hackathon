"use client"

import { useState } from "react"
import { X, Mail, Globe, Twitter, Github, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  type: "login" | "register"
}

export default function OnboardingModal({ isOpen, onClose, type }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    country: "",
    twitter: "",
    github: "",
    linkedin: "",
    instagram: "",
    website: "",
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl mx-4 bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {type === "login" ? "Welcome Back" : "Join Authora"}
            </CardTitle>
            <p className="text-gray-600">
              {type === "login" ? "Sign in to your Web3 creator account" : "Start your Web3 journey in minutes"}
            </p>
          </div>

          {/* Progress Indicator for Registration */}
          {type === "register" && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${i <= step ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8">
          {type === "login" ? (
            // Login Form
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                Sign In with Civic Auth
              </Button>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Sign up here</button>
                </p>
              </div>
            </div>
          ) : (
            // Registration Form
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h3>
                    <p className="text-gray-600">Let's start with the essentials</p>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    disabled={!formData.name || !formData.email}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Details</h3>
                    <p className="text-gray-600">Help us verify your identity</p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-gray-700 font-medium">
                      Country
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="sg">Singapore</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Profiles</h3>
                    <p className="text-gray-600">Connect your social media (optional)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium flex items-center">
                        <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                        Twitter
                      </Label>
                      <Input
                        placeholder="@username"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium flex items-center">
                        <Github className="w-4 h-4 mr-2 text-gray-700" />
                        GitHub
                      </Label>
                      <Input
                        placeholder="username"
                        value={formData.github}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium flex items-center">
                        <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                        LinkedIn
                      </Label>
                      <Input
                        placeholder="username"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium flex items-center">
                        <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                        Instagram
                      </Label>
                      <Input
                        placeholder="@username"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange("instagram", e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-green-500" />
                      Website
                    </Label>
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Almost Done!</p>
                        <p className="text-sm text-blue-700">
                          We'll send you a verification email to complete your Civic Auth setup.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
