"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Star, 
  TrendingUp, 
  Award, 
  Users, 
  Plus,
  Eye,
  ThumbsUp,
  Loader2
} from "lucide-react";

// Types
interface DashboardStats {
  totalSkills: number;
  endorsements: number;
  reputation: number;
  rank: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  endorsements: number;
  verified: boolean;
  status?: string;
}

interface RecentEndorsement {
  skill: string;
  endorser: string;
  reputation: number;
  timestamp: string;
  evidence?: string;
}

interface DashboardData {
  stats: DashboardStats;
  skills: Skill[];
  recentEndorsements: RecentEndorsement[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for adding new skill
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    description: "",
    evidence: ""
  });

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        
        if (result.success) {
          setData(result);
        } else {
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.category || !newSkill.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsAddingSkill(true);

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSkill),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: "Skill added successfully",
        });
        
        // Reset form and close dialog
        setNewSkill({ name: "", category: "", description: "", evidence: "" });
        setIsDialogOpen(false);
        
        // Refresh dashboard data
        const dashResponse = await fetch('/api/dashboard');
        const dashResult = await dashResponse.json();
        if (dashResult.success) {
          setData(dashResult);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add skill",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setIsAddingSkill(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-60 h-60 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float-minimal"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-800/20 to-purple-600/15 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-600/10 to-blue-800/10 rounded-full blur-3xl animate-float-minimal" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-10 left-10 w-70 h-70 bg-gradient-to-br from-blue-800/15 to-purple-600/15 rounded-full blur-3xl animate-float-minimal" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-50 h-50 bg-gradient-to-br from-purple-600/15 to-pink-500/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-50 h-50 bg-gradient-to-br from-pink-500/15 to-purple-500/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="relative z-10 p-6 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Skills Dashboard</h1>
              <p className="text-gray-400">Manage and showcase your professional skills</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Skill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Skill Name</Label>
                    <Input
                      id="name"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="e.g., React Development"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <Select onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Describe your expertise in this skill..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="evidence" className="text-white">Evidence (Optional)</Label>
                    <Input
                      id="evidence"
                      value={newSkill.evidence}
                      onChange={(e) => setNewSkill({ ...newSkill, evidence: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Links to portfolio, certificates, etc."
                    />
                  </div>
                  <Button 
                    onClick={handleAddSkill} 
                    disabled={isAddingSkill}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isAddingSkill ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Skill...
                      </>
                    ) : (
                      'Add Skill'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Skills</p>
                    <p className="text-2xl font-bold text-white">{data.stats.totalSkills}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Endorsements</p>
                    <p className="text-2xl font-bold text-white">{data.stats.endorsements}</p>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Reputation</p>
                    <p className="text-2xl font-bold text-white">{data.stats.reputation}</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Global Rank</p>
                    <p className="text-2xl font-bold text-white">#{data.stats.rank}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skills List */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Your Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.skills.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Skills Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Start building your reputation by adding your first skill!
                      </p>
                      <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Skill
                      </Button>
                    </div>
                  ) : (
                    data.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{skill.name}</h3>
                            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
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
                            <span>Level: {skill.level}</span>
                            <span>{skill.endorsements} endorsements</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Endorsements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.recentEndorsements.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No endorsements yet</p>
                    </div>
                  ) : (
                    data.recentEndorsements.map((endorsement, index) => (
                      <div key={index} className="p-4 border border-white/10 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm text-white">{endorsement.skill}</p>
                            <p className="text-xs text-gray-400">by {endorsement.endorser}</p>
                          </div>
                          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                            {endorsement.reputation}★
                          </Badge>
                        </div>
                        {endorsement.evidence && (
                          <p className="text-xs text-gray-400 mb-2 italic">"{endorsement.evidence}"</p>
                        )}
                        <p className="text-xs text-gray-500">{endorsement.timestamp}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}