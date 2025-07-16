"use client"

import { useEffect, useMemo, useState } from "react"
import { useUser } from "@civic/auth-web3/react"
import {
  Wallet as WalletIcon,
  LinkIcon,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import WalletOverview from "@/components/dashboard/wallet-overview"
import SkillsOverview from "@/components/dashboard/payment-links-overview"

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const { totalUsd } = useWalletBalances()

  const [skills, setSkills] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      
      // Load skills
      const skillsRes = await fetch("/api/links", {
        headers: { "x-user-id": user.id || user.email || "" },
      })
      const skillsJson = await skillsRes.json()
      setSkills(skillsJson.skills || [])
      
      // Load or create profile
      try {
        const profileRes = await fetch("/api/profile", {
          headers: { "x-user-id": user.id || user.email || "" },
        })
        if (profileRes.ok) {
          const profileJson = await profileRes.json()
          setProfile(profileJson.profile)
        }
      } catch (error) {
        console.log("No profile found yet")
      }
    }
    loadData()
  }, [user])

  const totalReputationScore = useMemo(
    () => skills.reduce((s, skill) => s + (skill.reputationScore || 0), 0),
    [skills],
  )

  const totalEndorsements = useMemo(
    () => skills.reduce((s, skill) => s + (skill.endorsements?.length || 0), 0),
    [skills],
  )

  if (isLoading || !user) {
    return (
      <div className="pt-20 pb-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading…</p>
      </div>
    )
  }

  const formattedBalance =
    totalUsd > 0
      ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "—"

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">SkillPass Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name || user.email}! Build your reputation with validated skills.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 bg-white/50 backdrop-blur-sm mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Reputation Score",
                  value: totalReputationScore.toString(),
                  icon: BarChart3,
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  title: "Total Endorsements",
                  value: totalEndorsements.toString(),
                  icon: LinkIcon,
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Skills Added",
                  value: skills.length.toString(),
                  icon: WalletIcon,
                  gradient: "from-green-500 to-teal-500",
                },
              ].map((stat) => (
                <Card
                  key={stat.title}
                  className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <WalletOverview compact />
              <SkillsOverview compact />
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Skills</h2>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    // TODO: Add skill modal
                    alert("Add skill functionality coming soon!")
                  }}
                >
                  Add New Skill
                </Button>
              </div>
              
              {skills.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't added any skills yet.</p>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => {
                        // TODO: Add skill modal
                        alert("Add skill functionality coming soon!")
                      }}
                    >
                      Add Your First Skill
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill) => (
                    <Card key={skill.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                            <p className="text-sm text-gray-600">{skill.category}</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {skill.level}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-4">{skill.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {skill.endorsements?.length || 0} endorsements
                          </span>
                          <span className="font-medium text-gray-900">
                            {skill.reputationScore || 0} pts
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <WalletOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}