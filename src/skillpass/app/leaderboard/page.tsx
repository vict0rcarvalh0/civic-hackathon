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
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-xl text-gray-600 animate-pulse">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
            <Trophy className="w-3 h-3 mr-1" />
            Top Performers
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              SkillPass
            </span>
            <br />
            <span className="text-gray-900">Leaderboard</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Discover the most validated talents in our community. See who's leading in reputation and skill endorsements.
          </p>
        </div>
      </section>

      {/* Leaderboard Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 py-3"
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              {filteredSkills.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skills Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {selectedCategory === "all" 
                        ? "Be the first to add a skill and start building your reputation!"
                        : `No skills in ${selectedCategory} category yet. Be the first to add one!`
                      }
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      onClick={() => window.location.href = "/dashboard"}
                    >
                      Add Your Skills
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredSkills.map((skill, index) => (
                    <Card key={skill.id} className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-shadow">
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
                                <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                                <Badge variant="outline" className="border-blue-200 text-blue-700">
                                  {skill.category}
                                </Badge>
                                <Badge variant="secondary">
                                  {skill.level}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-2">{skill.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{skill.endorsements?.length || 0} endorsements</span>
                                <span>•</span>
                                <span>${skill.totalStaked?.toFixed(2) || "0.00"} staked</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {skill.reputationScore || 0}
                            </div>
                            <div className="text-sm text-gray-500">reputation</div>
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