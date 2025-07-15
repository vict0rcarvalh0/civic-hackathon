"use client"

import { UserButton } from "@civic/auth-web3/react";

export default function CivicAuthDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Civic Auth Web3 Demo</h1>
          <p className="text-gray-600">
            Comprehensive demonstration of Civic Auth Web3 features using @civic/auth-web3/nextjs
          </p>
        </div>
        <div className="flex justify-center my-8">
          <UserButton />
        </div>
      </div>
    </div>
  )
}
