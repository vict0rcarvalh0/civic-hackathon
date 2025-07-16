"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"
import AuthButton from "./AuthButton"
import ChainSelector from "./chain-selector"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SkillPass
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Leaderboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <ChainSelector />
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl">
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/features"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Features
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
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
    </>
  )
}