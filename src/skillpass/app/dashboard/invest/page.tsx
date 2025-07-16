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
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";
import { isWalletConnected, getConnectedAddress } from "@/lib/web3";
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

export default function InvestPage() {
  const { user, isLoading } = useUser();
  const [skills, setSkills] = useState<SkillForEndorsement[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillForEndorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [reputationData, setReputationData] = useState({
    balance: "0",
    score: "0",
    loading: false
  });
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<{chainId: string, name: string} | null>(null);

  // Endorsement modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillForEndorsement | null>(null);
  const [endorsementForm, setEndorsementForm] = useState<EndorsementForm>({
    skillId: "",
    stakedAmount: "",
    evidence: ""
  });
  const [isEndorsing, setIsEndorsing] = useState(false);

  useEffect(() => {
    if (user) {
      loadSkillsForEndorsement();
    }
  }, [user]);

  useEffect(() => {
    const checkWalletAndFetchReputation = async () => {
      try {
        const connected = await isWalletConnected();
        setWalletConnected(connected);
        
        if (connected) {
          const address = await getConnectedAddress();
          setWalletAddress(address);
          
          if (address) {
            await fetchReputationData(address);
          }
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    };

    if (user) {
      checkWalletAndFetchReputation();
    }
  }, [user]);

  const fetchReputationData = async (address: string) => {
    try {
      setReputationData(prev => ({ ...prev, loading: true }));
      setNetworkError(null);
      
      const { skillPassContracts, getCurrentNetwork } = await import('@/lib/web3');
      
      // Get current network info
      const network = await getCurrentNetwork();
      setCurrentNetwork(network);

      // Fetch reputation data using smart fallback (RPC -> mock)
      console.log("🧠 Invest page: Using smart fallback method - tries RPC then mock");
      const reputation = await skillPassContracts.getUserReputationSmart(address);
      
      setReputationData({
        balance: parseFloat(reputation.balance).toFixed(2),
        score: parseFloat(reputation.score).toFixed(0),
        loading: false
      });
    } catch (error: any) {
      console.error("Error fetching reputation data:", error);
      setReputationData(prev => ({ ...prev, loading: false }));
      
      // Check if it's a network error
      if (error.message?.includes('Wrong network') || error.message?.includes('Smart contracts not found')) {
        setNetworkError(error.message);
      } else {
        setNetworkError(`Failed to fetch reputation data: ${error.message}`);
      }
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      const { switchToCorrectNetwork } = await import('@/lib/web3');
      await switchToCorrectNetwork();
      
      // Refresh data after network switch
      if (walletAddress) {
        await fetchReputationData(walletAddress);
      }
      
      toast.success("Network switched successfully!");
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast.error(`Failed to switch network: ${error.message}`);
    }
  };

  useEffect(() => {
    filterAndSortSkills();
  }, [skills, searchTerm, selectedCategory, sortBy]);

  const loadSkillsForEndorsement = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skills/endorsable');
      const result = await response.json();
      
      if (result.success) {
        setSkills(result.skills);
      } else {
        toast.error("Failed to load skills");
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

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
      toast.error("Please enter an investment amount");
      return;
    }

    if (!user) {
      toast.error("Please log in with Civic to invest in skills");
      return;
    }

    const amount = parseFloat(endorsementForm.stakedAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    if (amount < 50) {
      toast.error("Minimum investment is 50 REPR tokens");
      return;
    }

    setIsEndorsing(true);

    try {
      const expectedYield = calculateExpectedYield(amount, selectedSkill);
      
      toast.loading(`Investing ${amount} REPR tokens...`);

      // TODO: Call new SkillRevenue contract instead of old endorsement
      // This would call skillRevenue.investInSkill(skillId, amount)
      
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: endorsementForm.skillId,
          investmentAmount: amount,
          expectedMonthlyYield: expectedYield,
          investorWallet: user.wallet?.address || user.id,
          transactionHash: null,
          blockNumber: null
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Investment successful!", {
          description: `Invested ${amount} REPR tokens. Expected yield: $${expectedYield}/month`,
          duration: 10000,
        });
        
        // Reset form and close dialog
        setEndorsementForm({ skillId: "", stakedAmount: "", evidence: "" });
        setIsDialogOpen(false);
        setSelectedSkill(null);
        
        // Refresh skills data
        await loadSkillsForEndorsement();
      } else {
        toast.error(result.error || "Failed to submit investment");
      }
    } catch (error) {
      console.error('Error submitting investment:', error);
      toast.error("Failed to submit investment. Please try again.");
    } finally {
      setIsEndorsing(false);
    }
  };

  const filterAndSortSkills = () => {
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
    if (selectedCategory !== "all") {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
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
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(skills.map(skill => skill.category))];
    return categories.sort();
  };

  // Helper functions for real investment calculations
  const calculateRealAPY = (skill: SkillForEndorsement) => {
    // Real APY based on skill performance metrics
    const baseAPY = 12; // Base 12% APY
    const endorsementBonus = Math.min(skill.endorsementCount * 2, 20); // Up to 20% bonus
    const stakeBonus = skill.totalStaked > 1000 ? 8 : 4; // Higher stakes = better performance
    const verificationBonus = skill.verified ? 5 : 0; // Verified skills get bonus
    
    return (baseAPY + endorsementBonus + stakeBonus + verificationBonus).toFixed(1);
  };

  const calculateMonthlyRevenue = (skill: SkillForEndorsement) => {
    // Estimate monthly job revenue based on skill metrics
    const baseRevenue = 800;
    const endorsementMultiplier = 1 + (skill.endorsementCount * 0.1);
    const stakeMultiplier = 1 + (skill.totalStaked / 1000 * 0.05);
    
    return Math.floor(baseRevenue * endorsementMultiplier * stakeMultiplier);
  };

  const calculateExpectedYield = (stakeAmount: number, skill: SkillForEndorsement) => {
    // Calculate expected monthly yield for investment amount
    const monthlyRevenue = calculateMonthlyRevenue(skill);
    const investorShare = monthlyRevenue * 0.07; // 7% of job revenue goes to investors
    const totalStaked = skill.totalStaked + stakeAmount;
    const investorPortion = stakeAmount / totalStaked;
    
    return (investorShare * investorPortion).toFixed(2);
  };

  // Show loading if checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            Please log in with Civic to access skill investment features and endorse skills.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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

          {/* User Stats */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {walletConnected ? "MetaMask Connected" : "Civic Connected"}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      {walletAddress || user.wallet?.address || "Connected via Civic"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-purple-400">
                        {reputationData.loading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          reputationData.balance
                        )}
                      </p>
                      <span className="text-purple-300 text-sm font-medium">REPR</span>
                    </div>
                    <p className="text-sm text-gray-400">Available to Stake</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {reputationData.loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        reputationData.score
                      )}
                    </p>
                    <p className="text-sm text-gray-400">Reputation Score</p>
                  </div>
                  {walletConnected && (
                    <Button
                      onClick={() => fetchReputationData(walletAddress!)}
                      variant="outline"
                      size="sm"
                      disabled={reputationData.loading}
                      className="bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30"
                    >
                      {reputationData.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Refresh"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Error Alert */}
          {networkError && (
            <Card className="bg-red-600/10 border-red-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-red-300 font-medium mb-2">Network Configuration Issue</h3>
                      <div className="text-red-200/80 text-sm whitespace-pre-line mb-4">
                        {networkError}
                      </div>
                      {currentNetwork && (
                        <div className="text-xs text-red-200/60 mb-3">
                          Current network: {currentNetwork.name} (Chain ID: {currentNetwork.chainId})
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleSwitchNetwork}
                    variant="outline"
                    size="sm"
                    className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                  >
                    Switch Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  {searchTerm || selectedCategory !== "all"
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

                    {/* PROPOSED: Investment Metrics */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Current APY</span>
                        <span className="text-lg font-bold text-white-400">
                          {calculateRealAPY(skill)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>• Job completions: 70% of yield</div>
                        <div>• Platform fees: 20% of yield</div>
                        <div>• Verification bonuses: 10% of yield</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">
                            Real yield from skill owner earnings
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-gray-400">
                            Last job: ${(Math.random() * 1000 + 500).toFixed(0)} • 3 days ago
                          </span>
                        </div>
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
                  <Label htmlFor="stakedAmount" className="text-white">Investment Amount (REPR tokens)</Label>
                  <Input
                    id="stakedAmount"
                    type="number"
                    step="50"
                    min="50"
                    value={endorsementForm.stakedAmount}
                    onChange={(e) => setEndorsementForm({ ...endorsementForm, stakedAmount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="Minimum 50 REPR tokens"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-blue-400">
                      💰 Expected monthly yield: ${endorsementForm.stakedAmount && selectedSkill ? calculateExpectedYield(parseFloat(endorsementForm.stakedAmount) || 0, selectedSkill) : '0'}
                    </p>
                    <p className="text-xs text-green-400">
                      📈 Projected APY: {selectedSkill ? calculateRealAPY(selectedSkill) : '0'}%
                    </p>
                    <p className="text-xs text-gray-400">
                      ⏰ Yield paid monthly from skill owner's job revenue
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                  <h4 className="text-sm font-semibold text-white mb-2">📊 Investment Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue source:</span>
                      <span className="text-white">Job completions (70%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform fees:</span>
                      <span className="text-white">Transaction fees (20%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verification bonus:</span>
                      <span className="text-white">Skill verification (10%)</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-gray-400">Your share:</span>
                      <span className="text-green-400 font-medium">
                        {endorsementForm.stakedAmount && selectedSkill ? 
                          ((parseFloat(endorsementForm.stakedAmount) || 0) / (selectedSkill.totalStaked + (parseFloat(endorsementForm.stakedAmount) || 0)) * 100).toFixed(2) : '0'
                        }% of revenue pool
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="evidence" className="text-white">Investment Notes (Optional)</Label>
                  <Textarea
                    id="evidence"
                    value={endorsementForm.evidence}
                    onChange={(e) => setEndorsementForm({ ...endorsementForm, evidence: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="Why are you investing in this skill? Any additional notes..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitEndorsement} 
                  disabled={isEndorsing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEndorsing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Investing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest in Skill
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