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
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                How It Works
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Leaderboard
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Dashboard
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
                className="text-gray-300 hover:text-white hover:bg-white/5"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/5">
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/features"
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Features
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="/leaderboard"
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
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