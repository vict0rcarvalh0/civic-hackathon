"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  Wallet,
  Target,
  Activity,
  Award
} from "lucide-react";

// Types
interface SkillDetailProps {
  skill: any;
  isOpen: boolean;
  onClose: () => void;
}

interface InvestmentInfo {
  totalInvested: number;
  investorCount: number;
  averageAPY: number;
  monthlyRevenue: number;
  riskScore: number;
  recentInvestments: Array<{
    investor: string;
    amount: number;
    date: string;
    apy: number;
  }>;
}

export default function SkillDetailDialog({ skill, isOpen, onClose }: SkillDetailProps) {
  const [investmentInfo, setInvestmentInfo] = useState<InvestmentInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && skill) {
      fetchInvestmentInfo();
    }
  }, [isOpen, skill]);

  const fetchInvestmentInfo = async () => {
    if (!skill) return;
    
    setLoading(true);
    try {
      // Fetch real investment data for this skill
      const response = await fetch(`/api/skills/${skill.id}/investments`);
      if (response.ok) {
        const data = await response.json();
        setInvestmentInfo(data.investmentInfo);
      } else {
        // Mock data for now if API doesn't exist
        setInvestmentInfo({
          totalInvested: parseFloat(skill.totalStaked || '0'),
          investorCount: skill.endorsements || 0,
          averageAPY: 25.5,
          monthlyRevenue: 1200,
          riskScore: skill.verified ? 25 : 45,
          recentInvestments: [
            { investor: '0x742d35...', amount: 2500, date: '2 days ago', apy: 28.5 },
            { investor: '0x8ba1f1...', amount: 1800, date: '5 days ago', apy: 32.1 },
            { investor: '0x9fE467...', amount: 3200, date: '1 week ago', apy: 24.8 }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching investment info:', error);
      // Fallback to mock data
      setInvestmentInfo({
        totalInvested: parseFloat(skill.totalStaked || '0'),
        investorCount: skill.endorsements || 0,
        averageAPY: 25.5,
        monthlyRevenue: 1200,
        riskScore: skill.verified ? 25 : 45,
        recentInvestments: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="w-6 h-6 text-purple-400" />
            {skill.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Skill Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {skill.category}
                </Badge>
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
              <p className="text-gray-300 text-sm leading-relaxed">
                {skill.description || "No description available for this skill."}
              </p>
            </div>
          </div>

          {/* Owner Information */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Skill Owner
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {skill.userName || `${skill.walletAddress?.slice(0, 8)}...`}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{((skill.userReputation || 0) / 100).toFixed(1)} reputation</span>
                    <span>•</span>
                    <span>{skill.totalSkills || 0} skills</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Invested</p>
                    <p className="text-xl font-bold text-white">
                      {investmentInfo?.totalInvested.toLocaleString() || '0'} REPR
                    </p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Average APY</p>
                    <p className="text-xl font-bold text-white">
                      {investmentInfo?.averageAPY.toFixed(1) || '0'}%
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Risk Score</p>
                    <p className="text-xl font-bold text-white">
                      {investmentInfo?.riskScore || 50}/100
                    </p>
                  </div>
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Stats */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {investmentInfo?.investorCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    ${investmentInfo?.monthlyRevenue.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {skill.level || 'Intermediate'}
                  </div>
                  <div className="text-sm text-gray-400">Skill Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {skill.endorsements || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Endorsements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Evidence */}
          {skill.evidence && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                  Portfolio & Evidence
                </h3>
                <div className="space-y-2">
                  {typeof skill.evidence === 'string' ? (
                    <a 
                      href={skill.evidence} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Portfolio
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm">No portfolio links available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Investments */}
          {investmentInfo?.recentInvestments && investmentInfo.recentInvestments.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Recent Investments
                </h3>
                <div className="space-y-3">
                  {investmentInfo.recentInvestments.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-purple-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{investment.investor}</p>
                          <p className="text-gray-400 text-sm">{investment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{investment.amount.toLocaleString()} REPR</p>
                        <p className="text-green-400 text-sm">{investment.apy}% APY</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              Close
            </Button>
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                // This could trigger the investment modal
                onClose();
                // Add logic to open investment dialog here
              }}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Invest Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 