"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, TrendingUp, Medal, Loader2 } from "lucide-react";

// Types
interface LeaderboardSkill {
  rank: number;
  skill: string;
  category: string;
  endorsements: number;
  avgRating: number;
  growth: string;
  verified: boolean;
  status?: string;
}

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  skills: number;
  endorsements: number;
  verifiedSkills: number;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-white">#{rank}</span>;
}

export default function LeaderboardPage() {
  const [topSkills, setTopSkills] = useState<LeaderboardSkill[]>([]);
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        setLoading(true);
        
        // Fetch both skills and users data
        const [skillsResponse, usersResponse] = await Promise.all([
          fetch('/api/leaderboard?type=skills&limit=10'),
          fetch('/api/leaderboard?type=users&limit=10')
        ]);

        const skillsData = await skillsResponse.json();
        const usersData = await usersResponse.json();

        if (skillsData.success) {
          setTopSkills(skillsData.skills);
        }

        if (usersData.success) {
          setTopUsers(usersData.users);
        }

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Atmospheric Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-500/12 to-pink-500/12 rounded-full blur-xl animate-float-minimal"></div>
          <div className="absolute top-80 left-10 w-16 h-16 bg-gradient-to-br from-blue-700/15 to-purple-600/15 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-700/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-500/12 to-pink-500/12 rounded-full blur-xl animate-float-minimal"></div>
        <div className="absolute top-80 left-10 w-16 h-16 bg-gradient-to-br from-blue-700/15 to-purple-600/15 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-700/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-60 left-1/2 w-12 h-12 bg-gradient-to-br from-purple-600/18 to-pink-500/18 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-700/20 to-purple-500/20 rounded-full blur-sm animate-float-minimal" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30">
              <Trophy className="w-3 h-3 mr-1" />
              Top Performers
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SkillPass
              </span>
              <br />
              <span className="text-white">Leaderboard</span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Discover the most validated talents in our community. See who's leading in reputation and skill endorsements.
            </p>
          </div>

          {/* Leaderboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 grid grid-cols-2 max-w-md mx-auto">
              <TabsTrigger 
                value="skills" 
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Top Skills
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Top Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="mt-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Star className="w-5 h-5 text-purple-400" />
                    Most Endorsed Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topSkills.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Skills Yet</h3>
                      <p className="text-gray-400">
                        Be the first to add a skill and start building your reputation!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topSkills.map((skill) => (
                        <div key={skill.rank} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                            {getRankIcon(skill.rank)}
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-white">{skill.skill}</h3>
                                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                                  {skill.category}
                                </Badge>
                                {skill.verified ? (
                                  <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                                    Pending
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>{skill.endorsements} endorsements</span>
                                <span>★ {skill.avgRating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-green-400 bg-green-600/20 border-green-500/30">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {skill.growth}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Users Yet</h3>
                      <p className="text-gray-400">
                        Be the first to create a profile and start building your reputation!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topUsers.map((user) => (
                        <div key={user.rank} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                            {getRankIcon(user.rank)}
                            <Avatar className="w-12 h-12">
                              {user.avatar && <AvatarImage src={user.avatar} />}
                              <AvatarFallback className="bg-purple-600/20 text-purple-300">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-white">{user.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>{user.skills} skills</span>
                                <span>{user.endorsements} endorsements</span>
                                {user.verifiedSkills > 0 && (
                                  <span className="text-green-400">{user.verifiedSkills} verified</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-400">★ {user.reputation.toFixed(1)}</div>
                            <div className="text-xs text-gray-400">reputation</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 