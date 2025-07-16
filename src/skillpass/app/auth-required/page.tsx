"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export default function AuthRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float" style={{ animationDelay: '0s', animationDuration: '14s' }}></div>
        <div className="absolute bottom-40 left-10 w-16 h-16 bg-gradient-to-br from-blue-700/12 to-purple-600/12 rounded-full blur-lg animate-float" style={{ animationDelay: '2s', animationDuration: '16s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-700/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s', animationDuration: '18s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-gradient-to-br from-purple-600/18 to-pink-500/18 rounded-full blur-md animate-float" style={{ animationDelay: '1s', animationDuration: '12s' }}></div>
        <div className="absolute top-80 left-2/3 w-8 h-8 bg-gradient-to-br from-blue-700/20 to-purple-500/20 rounded-full blur-sm animate-float" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
      </div>

      <div className="max-w-md text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 relative">
        <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-white">
          Login Required
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          You need to be signed in with Civic to access the SkillPass dashboard. Please log in to continue building your professional reputation.
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Go to Home & Login
            </Button>
          </Link>
          
          <Link href="/how-it-works">
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
              Learn How SkillPass Works
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}