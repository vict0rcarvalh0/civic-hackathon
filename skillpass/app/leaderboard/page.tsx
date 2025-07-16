import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Star, TrendingUp, Medal } from "lucide-react";

// Mock data for leaderboards
const topSkills = [
  { rank: 1, skill: "React Development", endorsements: 324, avgRating: 9.4, growth: "+12%" },
  { rank: 2, skill: "Machine Learning", endorsements: 298, avgRating: 9.2, growth: "+18%" },
  { rank: 3, skill: "UI/UX Design", endorsements: 276, avgRating: 9.1, growth: "+8%" },
  { rank: 4, skill: "Python", endorsements: 251, avgRating: 9.0, growth: "+15%" },
  { rank: 5, skill: "Data Science", endorsements: 234, avgRating: 8.9, growth: "+22%" },
];

const topUsers = [
  { rank: 1, name: "Sarah Chen", reputation: 9.8, skills: 15, endorsements: 147 },
  { rank: 2, name: "Mike Johnson", reputation: 9.6, skills: 12, endorsements: 134 },
  { rank: 3, name: "Emma Wilson", reputation: 9.4, skills: 18, endorsements: 128 },
  { rank: 4, name: "David Kim", reputation: 9.3, skills: 14, endorsements: 119 },
  { rank: 5, name: "Lisa Rodriguez", reputation: 9.1, skills: 16, endorsements: 115 },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-xl text-muted-foreground">
            Discover the most validated skills and top contributors
          </p>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="skills">Top Skills</TabsTrigger>
            <TabsTrigger value="users">Top Users</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Most Endorsed Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSkills.map((skill) => (
                    <div key={skill.rank} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getRankIcon(skill.rank)}
                        <div>
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{skill.endorsements} endorsements</span>
                            <span>★ {skill.avgRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {skill.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getRankIcon(user.rank)}
                        <Avatar>
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{user.skills} skills</span>
                            <span>{user.endorsements} endorsements</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">★ {user.reputation}</div>
                        <div className="text-xs text-muted-foreground">reputation</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 