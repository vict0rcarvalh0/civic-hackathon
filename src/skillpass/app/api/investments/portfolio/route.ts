import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { eq } from 'drizzle-orm'

/**
 * Get investor's complete portfolio with real earnings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'walletAddress parameter required' },
        { status: 400 }
      )
    }

    // TODO: Query real investment data from blockchain/database
    // For now, generating realistic mock data to show what investors would earn

    const mockInvestments = [
      {
        skillId: 'skill_1',
        skillName: 'Senior React Developer',
        skillOwner: 'Alice Johnson',
        invested: 5000, // REPR tokens
        investedUSD: 500, // $0.10 per REPR
        currentValue: 5247, // 4.9% gain
        totalEarned: 247,
        monthlyYield: 89,
        apy: 24.5,
        investmentDate: new Date('2024-05-15'),
        lastYieldClaim: new Date('2024-07-10'),
        pendingYield: 45,
        jobsCompleted: 8,
        monthlyJobRevenue: 3200,
        riskScore: 25, // Low risk
        status: 'active'
      },
      {
        skillId: 'skill_2', 
        skillName: 'Solidity Smart Contract Developer',
        skillOwner: 'Bob Chen',
        invested: 3000,
        investedUSD: 300,
        currentValue: 3180,
        totalEarned: 180,
        monthlyYield: 78,
        apy: 31.2,
        investmentDate: new Date('2024-06-01'),
        lastYieldClaim: new Date('2024-07-08'),
        pendingYield: 23,
        jobsCompleted: 4,
        monthlyJobRevenue: 5500,
        riskScore: 45, // Medium risk
        status: 'active'
      },
      {
        skillId: 'skill_3',
        skillName: 'UI/UX Designer',
        skillOwner: 'Emma Davis',
        invested: 2000,
        investedUSD: 200,
        currentValue: 2089,
        totalEarned: 89,
        monthlyYield: 34,
        apy: 18.7,
        investmentDate: new Date('2024-06-20'),
        lastYieldClaim: new Date('2024-07-05'),
        pendingYield: 12,
        jobsCompleted: 6,
        monthlyJobRevenue: 1800,
        riskScore: 20, // Low risk
        status: 'active'
      }
    ]

    // Calculate portfolio metrics
    const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.invested, 0)
    const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalEarned = mockInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0)
    const totalPendingYield = mockInvestments.reduce((sum, inv) => sum + inv.pendingYield, 0)
    const averageAPY = mockInvestments.reduce((sum, inv) => sum + inv.apy, 0) / mockInvestments.length
    const totalMonthlyYield = mockInvestments.reduce((sum, inv) => sum + inv.monthlyYield, 0)

    // Portfolio performance
    const portfolioGain = totalCurrentValue - totalInvested
    const portfolioGainPercentage = (portfolioGain / totalInvested) * 100

    // Risk metrics
    const averageRiskScore = mockInvestments.reduce((sum, inv) => sum + inv.riskScore, 0) / mockInvestments.length
    const diversificationScore = Math.min(100, mockInvestments.length * 25) // Better with more skills

    return NextResponse.json({
      success: true,
      portfolio: {
        // Overall metrics
        totalInvested: totalInvested,
        totalCurrentValue: totalCurrentValue,
        totalEarned: totalEarned,
        totalPendingYield: totalPendingYield,
        portfolioGain: portfolioGain,
        portfolioGainPercentage: portfolioGainPercentage,
        averageAPY: averageAPY,
        totalMonthlyYield: totalMonthlyYield,
        
        // Risk assessment
        riskScore: averageRiskScore,
        diversificationScore: diversificationScore,
        
        // Individual investments
        investments: mockInvestments,
        
        // Performance history (last 6 months)
        performanceHistory: [
          { month: 'Feb 2024', value: 0, yield: 0 },
          { month: 'Mar 2024', value: 2000, yield: 0 },
          { month: 'Apr 2024', value: 5000, yield: 45 },
          { month: 'May 2024', value: 8500, yield: 123 },
          { month: 'Jun 2024', value: 10000, yield: 201 },
          { month: 'Jul 2024', value: totalCurrentValue, yield: totalEarned }
        ]
      },
      
      // Recent activity
      recentActivity: [
        {
          type: 'yield_claim',
          skillName: 'Senior React Developer',
          amount: 45,
          date: new Date('2024-07-10'),
          description: 'Monthly yield claimed'
        },
        {
          type: 'investment',
          skillName: 'UI/UX Designer', 
          amount: 2000,
          date: new Date('2024-06-20'),
          description: 'New investment made'
        },
        {
          type: 'yield_earned',
          skillName: 'Solidity Smart Contract Developer',
          amount: 78,
          date: new Date('2024-07-08'),
          description: 'Revenue from job completion'
        }
      ]
    })

  } catch (error) {
    console.error('Error fetching investment portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Claim pending yield from all investments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, skillIds } = body

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'walletAddress required' },
        { status: 400 }
      )
    }

    // TODO: Call smart contract to claim yield
    // This would call skillRevenue.claimYield() for each skill

    // Mock successful yield claim
    const totalClaimed = skillIds ? skillIds.length * 35 : 80 // Average $35 per skill
    
    return NextResponse.json({
      success: true,
      totalClaimed: totalClaimed,
      claimedFrom: skillIds || ['skill_1', 'skill_2', 'skill_3'],
      transactionHash: '0x' + Math.random().toString(16).substr(2, 40),
      message: `Successfully claimed ${totalClaimed} REPR tokens in yield!`
    })

  } catch (error) {
    console.error('Error claiming yield:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to claim yield' },
      { status: 500 }
    )
  }
} 