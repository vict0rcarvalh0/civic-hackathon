"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Wallet, 
  Search, 
  Filter,
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  ThumbsUp,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Types
interface SkillForEndorsement {
  id: string;
  name: string;
  category: string;
  description: string;
  userName: string;
  userReputation: number;
  endorsementCount: number;
  totalStaked: number;
  verified: boolean;
  status: string;
  evidence?: any;
  createdAt: string;
}

interface EndorsementForm {
  skillId: string;
  stakedAmount: string;
  evidence: string;
}

export default function WalletPage() {
  const [skills, setSkills] = useState<SkillForEndorsement[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillForEndorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillForEndorsement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("endorsements");
  
  // Endorsement form state
  const [endorsementForm, setEndorsementForm] = useState<EndorsementForm>({
    skillId: "",
    stakedAmount: "",
    evidence: ""
  });

  // Fetch skills available for endorsement
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        const response = await fetch('/api/skills/endorsable');
        const result = await response.json();
        
        if (result.success) {
          setSkills(result.skills);
          setFilteredSkills(result.skills);
        } else {
          toast({
            title: "Error",
            description: "Failed to load skills",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = skills;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(skill => skill.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(skill => skill.verified);
      } else if (statusFilter === "pending") {
        filtered = filtered.filter(skill => !skill.verified);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "endorsements":
          return b.endorsementCount - a.endorsementCount;
        case "reputation":
          return b.userReputation - a.userReputation;
        case "staked":
          return b.totalStaked - a.totalStaked;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredSkills(filtered);
  }, [skills, searchTerm, categoryFilter, statusFilter, sortBy]);

  const handleEndorseClick = (skill: SkillForEndorsement) => {
    setSelectedSkill(skill);
    setEndorsementForm({
      skillId: skill.id,
      stakedAmount: "",
      evidence: ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmitEndorsement = async () => {
    if (!endorsementForm.stakedAmount || !selectedSkill) {
      toast({
        title: "Error",
        description: "Please enter a stake amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(endorsementForm.stakedAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      });
      return;
    }

    setIsEndorsing(true);

    try {
      const response = await fetch('/api/endorsements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: endorsementForm.skillId,
          stakedAmount: amount,
          evidence: endorsementForm.evidence
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: "Endorsement submitted successfully",
        });
        
        // Reset form and close dialog
        setEndorsementForm({ skillId: "", stakedAmount: "", evidence: "" });
        setIsDialogOpen(false);
        setSelectedSkill(null);
        
        // Refresh skills data
        const refreshResponse = await fetch('/api/skills/endorsable');
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setSkills(refreshResult.skills);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit endorsement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting endorsement:', error);
      toast({
        title: "Error",
        description: "Failed to submit endorsement",
        variant: "destructive",
      });
    } finally {
      setIsEndorsing(false);
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(skills.map(skill => skill.category))];
    return categories.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading skills...</p>
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
          <div className="text-center space-y-4">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30">
              <Wallet className="w-3 h-3 mr-1" />
              Skill Investment
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Invest on Skills
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Discover and endorse skills from talented individuals. Stake your reputation to validate expertise.
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <Label className="text-white mb-2 block">Search Skills</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search skills, users, descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Label className="text-white mb-2 block">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-white mb-2 block">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <Label className="text-white mb-2 block">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="endorsements">Most Endorsed</SelectItem>
                      <SelectItem value="reputation">Highest Reputation</SelectItem>
                      <SelectItem value="staked">Most Staked</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Skills Found</h3>
                <p className="text-gray-400">
                  {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No skills available for endorsement at the moment."}
                </p>
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <Card key={skill.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                  <CardContent className="p-6">
                    {/* Skill Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white text-lg">{skill.name}</h3>
                          {skill.verified ? (
                            <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300 mb-3">
                          {skill.category}
                        </Badge>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{skill.userName}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-sm text-gray-400">{(skill.userReputation / 100).toFixed(1)} reputation</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {skill.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <ThumbsUp className="w-4 h-4 text-blue-400" />
                          <span className="text-lg font-bold text-white">{skill.endorsementCount}</span>
                        </div>
                        <p className="text-xs text-gray-400">Endorsements</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-lg font-bold text-white">{skill.totalStaked}</span>
                        </div>
                        <p className="text-xs text-gray-400">Total Staked</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEndorseClick(skill)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Endorse
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Endorsement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              Endorse Skill
            </DialogTitle>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="space-y-6">
              {/* Skill Info */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="font-semibold text-white mb-1">{selectedSkill.name}</h3>
                <p className="text-sm text-gray-400 mb-2">by {selectedSkill.userName}</p>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {selectedSkill.category}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stakedAmount" className="text-white">Stake Amount (tokens)</Label>
                  <Input
                    id="stakedAmount"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={endorsementForm.stakedAmount}
                    onChange={(e) => setEndorsementForm({ ...endorsementForm, stakedAmount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="Enter amount to stake"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your tokens will be staked to validate this skill. You'll earn rewards if the skill proves valuable.
                  </p>
                </div>

                <div>
                  <Label htmlFor="evidence" className="text-white">Evidence (Optional)</Label>
                  <Textarea
                    id="evidence"
                    value={endorsementForm.evidence}
                    onChange={(e) => setEndorsementForm({ ...endorsementForm, evidence: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="Why are you endorsing this skill? Share your experience..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitEndorsement} 
                  disabled={isEndorsing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEndorsing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Endorsement...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Submit Endorsement
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}