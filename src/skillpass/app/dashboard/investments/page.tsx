"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";
import { getConnectedAddress } from "@/lib/web3";
import { 
  TrendingUp, 
  DollarSign, 
  Wallet,
  PieChart,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  Shield,
  Activity
} from "lucide-react";

// Types
interface Investment {
  skillId: string;
  skillName: string;
  skillOwner: string;
  invested: number;
  investedUSD: number;
  currentValue: number;
  totalEarned: number;
  monthlyYield: number;
  apy: number;
  investmentDate: Date;
  pendingYield: number;
  jobsCompleted: number;
  monthlyJobRevenue: number;
  riskScore: number;
  status: string;
}

interface Portfolio {
  totalInvested: number;
  totalCurrentValue: number;
  totalEarned: number;
  totalPendingYield: number;
  portfolioGain: number;
  portfolioGainPercentage: number;
  averageAPY: number;
  totalMonthlyYield: number;
  riskScore: number;
  diversificationScore: number;
  investments: Investment[];
  performanceHistory: Array<{
    month: string;
    value: number;
    yield: number;
  }>;
}

export default function InvestmentsPage() {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const address = await getConnectedAddress();
        setWalletAddress(address);
        
        if (address) {
          await loadPortfolio(address);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const loadPortfolio = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/investments/portfolio?walletAddress=${address}`);
      const result = await response.json();
      
      if (result.success) {
        setPortfolio(result.portfolio);
      } else {
        toast.error("Failed to load portfolio");
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimYield = async () => {
    if (!walletAddress || !portfolio) return;
    
    setClaiming(true);
    try {
      const skillIds = portfolio.investments.map(inv => inv.skillId);
      
      const response = await fetch('/api/investments/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletAddress,
          skillIds: skillIds
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Claimed ${result.totalClaimed} REPR tokens in yield!`);
        await loadPortfolio(walletAddress); // Refresh data
      } else {
        toast.error("Failed to claim yield");
      }
    } catch (error) {
      console.error('Error claiming yield:', error);
      toast.error("Failed to claim yield");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your investment portfolio...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Investments Yet</h2>
            <p className="text-gray-400 mb-6">Start investing in skills to earn passive income!</p>
            <Button 
              onClick={() => window.location.href = '/dashboard/invest'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Browse Skills to Invest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-gray-400">Track your skill investments and earnings</p>
          </div>
          <Button 
            onClick={handleClaimYield}
            disabled={claiming || portfolio.totalPendingYield === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {claiming ? "Claiming..." : `Claim ${portfolio.totalPendingYield.toFixed(0)} REPR Yield`}
          </Button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-2xl font-bold">{portfolio.totalInvested.toLocaleString()} REPR</p>
                  <p className="text-xs text-gray-500">${(portfolio.totalInvested * 0.1).toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold">{portfolio.totalCurrentValue.toLocaleString()} REPR</p>
                  <div className="flex items-center gap-1">
                    {portfolio.portfolioGainPercentage >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <p className={`text-xs ${portfolio.portfolioGainPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {portfolio.portfolioGainPercentage >= 0 ? '+' : ''}{portfolio.portfolioGainPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Earned</p>
                  <p className="text-2xl font-bold text-green-400">{portfolio.totalEarned.toLocaleString()} REPR</p>
                  <p className="text-xs text-gray-500">${(portfolio.totalEarned * 0.1).toFixed(0)} earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average APY</p>
                  <p className="text-2xl font-bold text-orange-400">{portfolio.averageAPY.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">${portfolio.totalMonthlyYield.toFixed(0)}/month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Portfolio Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Risk Score</span>
                    <span className="text-sm font-medium">
                      {portfolio.riskScore}/100 {portfolio.riskScore < 30 ? '(Low)' : portfolio.riskScore < 60 ? '(Medium)' : '(High)'}
                    </span>
                  </div>
                  <Progress value={portfolio.riskScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Diversification</span>
                    <span className="text-sm font-medium">{portfolio.diversificationScore}/100</span>
                  </div>
                  <Progress value={portfolio.diversificationScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-green-400">
                    {((portfolio.totalEarned / portfolio.totalInvested) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">Total Return</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-blue-400">{portfolio.investments.length}</p>
                  <p className="text-xs text-gray-400">Active Investments</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-purple-400">
                    {portfolio.investments.reduce((sum, inv) => sum + inv.jobsCompleted, 0)}
                  </p>
                  <p className="text-xs text-gray-400">Jobs Completed</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-orange-400">
                    ${portfolio.investments.reduce((sum, inv) => sum + inv.monthlyJobRevenue, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Investments */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.investments.map((investment) => (
                <div
                  key={investment.skillId}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{investment.skillName}</h3>
                      <p className="text-sm text-gray-400">by {investment.skillOwner}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{investment.apy.toFixed(1)}% APY</p>
                      <p className="text-sm text-gray-400">{investment.monthlyYield.toFixed(0)} REPR/month</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Invested</p>
                      <p className="font-medium">{investment.invested.toLocaleString()} REPR</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Current Value</p>
                      <p className="font-medium">{investment.currentValue.toLocaleString()} REPR</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Earned</p>
                      <p className="font-medium text-green-400">+{investment.totalEarned.toFixed(0)} REPR</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pending Yield</p>
                      <p className="font-medium text-orange-400">{investment.pendingYield.toFixed(0)} REPR</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{investment.jobsCompleted} jobs completed</span>
                      <span>${investment.monthlyJobRevenue.toLocaleString()}/month revenue</span>
                      <Badge variant={investment.riskScore < 30 ? "default" : investment.riskScore < 60 ? "secondary" : "destructive"}>
                        Risk: {investment.riskScore < 30 ? 'Low' : investment.riskScore < 60 ? 'Medium' : 'High'}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement individual yield claim
                        toast.info("Individual yield claiming coming soon!");
                      }}
                    >
                      Claim {investment.pendingYield.toFixed(0)} REPR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 