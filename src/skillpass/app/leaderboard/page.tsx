"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Star, Users, Code, Palette, Globe } from "lucide-react"

interface LeaderboardSkill {
  id: string
  userId: string
  name: string
  description: string
  category: string
  level: string
  reputationScore: number
  totalStaked: number
  endorsements: any[]
}

export default function LeaderboardPage() {
  const [allSkills, setAllSkills] = useState<LeaderboardSkill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<LeaderboardSkill[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard?limit=50")
        const data = await response.json()
        setAllSkills(data.leaderboard || [])
        setFilteredSkills(data.leaderboard || [])
      } catch (error) {
        console.error("Failed to load leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredSkills(allSkills)
    } else {
      setFilteredSkills(allSkills.filter(skill => 
        skill.category.toLowerCase() === selectedCategory.toLowerCase()
      ))
    }
  }, [selectedCategory, allSkills])

  const categories = [
    { value: "all", label: "All Skills", icon: Globe },
    { value: "development", label: "Development", icon: Code },
    { value: "design", label: "Design", icon: Palette },
    { value: "community", label: "Community", icon: Users },
  ]

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-orange-500" />
      default:
        return <Star className="w-6 h-6 text-gray-300" />
    }
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-gray-600 text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-xl text-gray-400 animate-pulse">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-500/12 to-pink-500/12 rounded-full blur-xl animate-float" style={{ animationDelay: '0s', animationDuration: '14s' }}></div>
        <div className="absolute top-80 left-10 w-16 h-16 bg-gradient-to-br from-blue-700/15 to-purple-600/15 rounded-full blur-lg animate-float" style={{ animationDelay: '2s', animationDuration: '16s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-700/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s', animationDuration: '18s' }}></div>
        <div className="absolute top-60 left-1/2 w-12 h-12 bg-gradient-to-br from-purple-600/18 to-pink-500/18 rounded-full blur-md animate-float" style={{ animationDelay: '1s', animationDuration: '12s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-700/20 to-purple-500/20 rounded-full blur-sm animate-float" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center relative">
          <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30">
            <Trophy className="w-3 h-3 mr-1" />
            Top Performers
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillPass
            </span>
            <br />
            <span className="text-white">Leaderboard</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Discover the most validated talents in our community. See who's leading in reputation and skill endorsements.
          </p>
        </div>
      </section>

      {/* Leaderboard Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 grid grid-cols-4 mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white py-3"
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              {filteredSkills.length === 0 ? (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Skills Yet</h3>
                    <p className="text-gray-400 mb-6">
                      {selectedCategory === "all" 
                        ? "Be the first to add a skill and start building your reputation!"
                        : `No skills in ${selectedCategory} category yet. Be the first to add one!`
                      }
                    </p>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => window.location.href = "/dashboard"}
                    >
                      Add Your Skills
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredSkills.map((skill, index) => (
                    <Card key={skill.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(index)}`}>
                                <span className="text-lg font-bold">#{index + 1}</span>
                              </div>
                              {getRankIcon(index)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                                  {skill.category}
                                </Badge>
                                <Badge className="bg-white/10 text-gray-300">
                                  {skill.level}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-400 mb-2">{skill.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{skill.endorsements?.length || 0} endorsements</span>
                                <span>•</span>
                                <span>${skill.totalStaked?.toFixed(2) || "0.00"} staked</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white mb-1">
                              {skill.reputationScore || 0}
                            </div>
                            <div className="text-sm text-gray-400">reputation</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 