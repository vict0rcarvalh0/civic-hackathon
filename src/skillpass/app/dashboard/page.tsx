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
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";
import { getNetworkConfig } from "@/lib/contracts";
import { isWalletConnected, getConnectedAddress } from "@/lib/web3";
import { 
  Star, 
  TrendingUp, 
  Award, 
  Users, 
  Plus,
  Eye,
  ThumbsUp,
  Loader2,
  Wallet,
  AlertCircle,
  Heart,
  DollarSign
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

interface NewSkill {
  name: string;
  category: string;
  description: string;
  evidence: string;
}

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const [data, setData] = useState<DashboardData>({
    stats: { totalSkills: 0, endorsements: 0, reputation: 0, rank: 0 },
    skills: [],
    recentEndorsements: []
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isEndorseDialogOpen, setIsEndorseDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [endorsementData, setEndorsementData] = useState({
    stakeAmount: "",
    evidence: ""
  });
  const [newSkill, setNewSkill] = useState<NewSkill>({
    name: "",
    category: "",
    description: "",
    evidence: ""
  });

  // Check MetaMask connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await isWalletConnected();
        setWalletConnected(connected);
        
        if (connected) {
          const address = await getConnectedAddress();
          setWalletAddress(address);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setWalletConnected(accounts.length > 0);
        setWalletAddress(accounts.length > 0 ? accounts[0] : null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const connectMetaMask = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask extension.");
        return;
      }

      const loadingToast = toast.loading("Connecting to MetaMask...");
      
      // Use the working bypass connection method
      const { connectWallet } = await import('@/lib/web3');
      const address = await connectWallet();
      
      setWalletConnected(true);
      setWalletAddress(address);
      
      toast.dismiss(loadingToast);
      toast.success("MetaMask connected successfully!");
    } catch (error: any) {
      console.error('Error connecting MetaMask:', error);
      
      toast.dismiss(); // Dismiss loading toast
      
      if (error.message?.includes("rejected") || error.code === 4001) {
        toast.error("Connection cancelled by user");
      } else if (error.code === -32002) {
        toast.error("MetaMask connection request already pending. Please check MetaMask.");
      } else if (error.message?.includes("not installed")) {
        toast.error("MetaMask is not installed. Please install MetaMask extension.");
      } else {
        toast.error(`Failed to connect MetaMask: ${error.message}`);
      }
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.category || !newSkill.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("Please log in with Civic to create skills");
      return;
    }

    if (!walletConnected) {
      toast.error("Please connect your MetaMask wallet to mint NFTs");
      return;
    }

    setIsAddingSkill(true);

    try {
      toast.loading("Creating skill and minting NFT...");

      const networkConfig = getNetworkConfig();

      // First, mint the NFT on blockchain using MetaMask
      const { skillPassContracts } = await import('@/lib/web3');

      // Create metadata
      const metadata = {
        name: newSkill.name,
        description: newSkill.description,
        category: newSkill.category,
        image: "https://skillpass.app/placeholder-skill.png"
      }
      const metadataUri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`

      const receipt = await skillPassContracts.mintSkill(
        newSkill.category, 
        newSkill.name, 
        newSkill.description, 
        metadataUri
      );

      // Extract token ID from transaction logs
      let tokenId = null
      if (receipt.logs && receipt.logs.length > 0) {
        const mintEvent = receipt.logs.find((log: any) => log.topics && log.topics.length > 0)
        if (mintEvent && mintEvent.topics && mintEvent.topics.length >= 2) {
          tokenId = parseInt(mintEvent.topics[1], 16).toString()
        }
      }

      // Now send to API with blockchain transaction details
      const payload = {
        ...newSkill,
        walletAddress: walletAddress,
        tokenId: tokenId,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        contractAddress: networkConfig.SkillNFT
      }
      
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Show success toast with transaction link
        toast.success("Skill created and NFT minted successfully!", {
          description: `NFT minted! Token ID: ${tokenId}. Transaction: ${receipt.hash}`,
          duration: 10000,
        });
        
        // Reset form and close dialog
        setNewSkill({ name: "", category: "", description: "", evidence: "" });
        setIsDialogOpen(false);
        
        // Refresh dashboard data
        await loadDashboardData();
      } else {
        toast.error(result.error || "Failed to save skill to database");
      }
    } catch (error: any) {
      console.error('Error adding skill:', error);
      
      if (error.message?.includes("MetaMask is not installed")) {
        toast.error("Please install MetaMask extension");
      } else if (error.message?.includes("User rejected")) {
        toast.error("Transaction cancelled by user");
      } else {
        toast.error("Failed to create skill. Please try again.");
      }
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleEndorseSkill = async () => {
    if (!endorsementData.stakeAmount || !endorsementData.evidence) {
      toast.error("Please fill in stake amount and evidence");
      return;
    }

    if (!user) {
      toast.error("Please log in with Civic to endorse skills");
      return;
    }

    if (!walletConnected) {
      toast.error("Please connect your MetaMask wallet to sign transactions");
      return;
    }

    if (!selectedSkill) {
      toast.error("No skill selected for endorsement");
      return;
    }

    const stakeAmount = parseFloat(endorsementData.stakeAmount);
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    setIsEndorsing(true);

    try {
      const loadingToast = toast.loading("Endorsing skill and staking reputation...");

      // Import skillPassContracts for transaction signing
      const { skillPassContracts } = await import('@/lib/web3');

      // Sign endorsement transaction with MetaMask
      const receipt = await skillPassContracts.endorseSkill(
        selectedSkill.id,
        endorsementData.stakeAmount,
        endorsementData.evidence
      );

      // Send endorsement data to API
      const payload = {
        skillId: selectedSkill.id,
        stakeAmount: endorsementData.stakeAmount,
        evidence: endorsementData.evidence,
        endorserAddress: walletAddress,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };

      const response = await fetch('/api/endorsements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Skill endorsed successfully!", {
          description: `Staked ${endorsementData.stakeAmount} REPR tokens. Transaction: ${receipt.hash}`,
          duration: 10000,
        });
        
        // Reset form and close dialog
        setEndorsementData({ stakeAmount: "", evidence: "" });
        setSelectedSkill(null);
        setIsEndorseDialogOpen(false);
        
        // Refresh dashboard data
        await loadDashboardData();
      } else {
        toast.error(result.error || "Failed to save endorsement to database");
      }
    } catch (error: any) {
      console.error('Error endorsing skill:', error);
      
      toast.dismiss();
      
      if (error.message?.includes("User rejected")) {
        toast.error("Transaction cancelled by user");
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient REPR tokens for staking");
      } else if (error.message?.includes("allowance")) {
        toast.error("Token approval failed. Please try again.");
      } else {
        toast.error(`Failed to endorse skill: ${error.message}`);
      }
    } finally {
      setIsEndorsing(false);
    }
  };

  const openEndorseDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEndorseDialogOpen(true);
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
            Please log in with Civic to access your dashboard and manage your skills.
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
                <Button 
                  disabled={!walletConnected || isAddingSkill}
                  className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
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
                    disabled={isAddingSkill || !walletConnected}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
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

          {/* MetaMask Wallet Status */}
          {!walletConnected ? (
            <Card className="bg-yellow-600/10 border-yellow-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-yellow-300 font-medium">MetaMask Required</p>
                      <p className="text-yellow-200/80 text-sm">
                        Connect your MetaMask wallet to mint skills and sign transactions
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={connectMetaMask}
                    variant="outline"
                    size="sm"
                    className="bg-yellow-600/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/30"
                  >
                    Connect MetaMask
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-600/10 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 font-medium">MetaMask Connected</p>
                      <p className="text-green-200/80 text-sm font-mono">
                        {walletAddress}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

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
                        disabled={!walletConnected}
                        className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-purple-400 hover:text-purple-300"
                            onClick={() => openEndorseDialog(skill)}
                            disabled={!walletConnected}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Endorse
                          </Button>
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

      {/* Endorsement Dialog */}
      <Dialog open={isEndorseDialogOpen} onOpenChange={setIsEndorseDialogOpen}>
        <DialogContent className="bg-black border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              Endorse Skill: {selectedSkill?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSkill && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium">{selectedSkill.name}</h4>
                <p className="text-gray-400 text-sm">{selectedSkill.category}</p>
                <p className="text-gray-500 text-xs mt-1">Current endorsements: {selectedSkill.endorsements}</p>
              </div>
            )}
            <div>
              <Label htmlFor="stakeAmount" className="text-white">Stake Amount (REPR tokens)</Label>
              <Input
                id="stakeAmount"
                type="number"
                step="0.1"
                min="0.1"
                value={endorsementData.stakeAmount}
                onChange={(e) => setEndorsementData({ ...endorsementData, stakeAmount: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                placeholder="e.g., 10"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum stake: 0.1 REPR</p>
            </div>
            <div>
              <Label htmlFor="evidence" className="text-white">Evidence</Label>
              <Textarea
                id="evidence"
                value={endorsementData.evidence}
                onChange={(e) => setEndorsementData({ ...endorsementData, evidence: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                placeholder="Why are you endorsing this skill? Provide evidence or reasoning..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsEndorseDialogOpen(false)}
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEndorseSkill} 
                disabled={isEndorsing || !walletConnected || !endorsementData.stakeAmount || !endorsementData.evidence}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isEndorsing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Endorsing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Stake & Endorse
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}