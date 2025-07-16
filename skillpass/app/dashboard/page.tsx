"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  TrendingUp, 
  Award, 
  Users, 
  Plus,
  Eye,
  ThumbsUp
} from "lucide-react";

// Mock data
const userStats = {
  totalSkills: 12,
  endorsements: 47,
  reputation: 8.4,
  rank: 23
};

const skills = [
  { id: 1, name: "React Development", level: "Expert", endorsements: 15, category: "Frontend" },
  { id: 2, name: "TypeScript", level: "Advanced", endorsements: 12, category: "Programming" },
  { id: 3, name: "UI/UX Design", level: "Intermediate", endorsements: 8, category: "Design" },
  { id: 4, name: "Node.js", level: "Advanced", endorsements: 10, category: "Backend" },
];

const recentEndorsements = [
  { skill: "React Development", endorser: "Sarah Chen", reputation: 9.2, timestamp: "2 hours ago" },
  { skill: "TypeScript", endorser: "Mike Johnson", reputation: 8.7, timestamp: "1 day ago" },
  { skill: "UI/UX Design", endorser: "Emma Wilson", reputation: 9.0, timestamp: "2 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Skills Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage and showcase your professional skills</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Skill
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                  <p className="text-2xl font-bold">{userStats.totalSkills}</p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Endorsements</p>
                  <p className="text-2xl font-bold">{userStats.endorsements}</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reputation</p>
                  <p className="text-2xl font-bold">{userStats.reputation}</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                  <p className="text-2xl font-bold">#{userStats.rank}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{skill.name}</h3>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Level: {skill.level}</span>
                        <span>{skill.endorsements} endorsements</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Endorsements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEndorsements.map((endorsement, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{endorsement.skill}</p>
                        <p className="text-xs text-muted-foreground">by {endorsement.endorser}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {endorsement.reputation}★
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{endorsement.timestamp}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 