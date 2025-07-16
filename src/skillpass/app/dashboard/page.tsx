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
      <div className="pt-20 pb-8 min-h-screen bg-black flex items-center justify-center">
        <p className="text-xl text-gray-400 animate-pulse">Loading…</p>
      </div>
    )
  }

  const formattedBalance =
    totalUsd > 0
      ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "—"

  return (
    <div className="pt-20 pb-8 min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large bubbles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-500/15 to-purple-600/15 rounded-full blur-xl animate-float" style={{ animationDelay: '0s', animationDuration: '12s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-500/12 to-blue-700/12 rounded-full blur-lg animate-float" style={{ animationDelay: '2s', animationDuration: '15s' }}></div>
        <div className="absolute top-80 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-700/10 to-pink-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s', animationDuration: '18s' }}></div>
        
        {/* Medium bubbles */}
        <div className="absolute top-60 right-1/4 w-12 h-12 bg-gradient-to-br from-pink-600/18 to-purple-500/18 rounded-full blur-md animate-float" style={{ animationDelay: '1s', animationDuration: '14s' }}></div>
        <div className="absolute bottom-40 left-20 w-14 h-14 bg-gradient-to-br from-purple-600/16 to-blue-800/16 rounded-full blur-lg animate-float" style={{ animationDelay: '3s', animationDuration: '16s' }}></div>
        
        {/* Small scattered bubbles */}
        <div className="absolute top-32 left-2/3 w-8 h-8 bg-gradient-to-br from-blue-700/20 to-purple-500/20 rounded-full blur-sm animate-float" style={{ animationDelay: '5s', animationDuration: '11s' }}></div>
        <div className="absolute bottom-60 right-10 w-10 h-10 bg-gradient-to-br from-pink-500/14 to-blue-700/14 rounded-full blur-md animate-float" style={{ animationDelay: '6s', animationDuration: '13s' }}></div>
        <div className="absolute top-96 left-1/4 w-6 h-6 bg-gradient-to-br from-purple-600/22 to-pink-500/22 rounded-full blur-sm animate-float" style={{ animationDelay: '7s', animationDuration: '10s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">SkillPass Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user.name || user.email}! Build your reputation with validated skills.
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="bg-white/5 border border-white/10 grid grid-cols-3 mb-8">
            <TabsTrigger 
              value="overview" 
              className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10"
            >
              My Skills
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10"
            >
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Reputation Score",
                  value: totalReputationScore.toString(),
                  icon: BarChart3,
                  color: "purple",
                },
                {
                  title: "Total Endorsements",
                  value: totalEndorsements.toString(),
                  icon: LinkIcon,
                  color: "pink",
                },
                {
                  title: "Skills Added",
                  value: skills.length.toString(),
                  icon: WalletIcon,
                  color: "blue",
                },
              ].map((stat) => (
                <Card
                  key={stat.title}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
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
                <h2 className="text-2xl font-bold text-white">My Skills</h2>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    // TODO: Add skill modal
                    alert("Add skill functionality coming soon!")
                  }}
                >
                  Add New Skill
                </Button>
              </div>
              
              {skills.length === 0 ? (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-400 mb-4">You haven't added any skills yet.</p>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
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
                    <Card 
                      key={skill.id} 
                      className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-white">{skill.name}</h3>
                            <p className="text-sm text-gray-400">{skill.category}</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full">
                            {skill.level}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-4">{skill.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            {skill.endorsements?.length || 0} endorsements
                          </span>
                          <span className="font-medium text-purple-300">
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