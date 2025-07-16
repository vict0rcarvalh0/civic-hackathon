import { NextRequest, NextResponse } from 'next/server'
import { db, investments, skills, userProfiles } from '@/lib/db'
import { desc, eq, sql } from 'drizzle-orm'

/**
 * Get recent investments across the platform
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId') // Optional: filter by specific user's investments

    let query = db
      .select({
        investmentId: investments.id,
        skillId: investments.skillId,
        skillName: skills.name,
        skillCategory: skills.category,
        investorWallet: investments.investorWallet,
        investmentAmount: investments.investmentAmount,
        expectedMonthlyYield: investments.expectedMonthlyYield,
        currentAPY: investments.currentAPY,
        totalYieldEarned: investments.totalYieldEarned,
        investmentDate: investments.investmentDate,
        status: investments.status,
        riskScore: investments.riskScore,
        // Skill owner info
        skillOwnerName: userProfiles.displayName,
        skillOwnerWallet: skills.walletAddress,
        // Investment metrics
        jobsCompleted: investments.jobsCompleted,
        monthlyJobRevenue: investments.monthlyJobRevenue
      })
      .from(investments)
      .innerJoin(skills, eq(investments.skillId, skills.id))
      .leftJoin(userProfiles, eq(skills.walletAddress, userProfiles.walletAddress))

    // Filter by specific user if provided
    if (userId) {
      query = query.where(eq(investments.investorWallet, userId))
    }

    const recentInvestments = await query
      .orderBy(desc(investments.investmentDate))
      .limit(limit)

    // Format for frontend
    const formattedInvestments = recentInvestments.map(investment => ({
      id: investment.investmentId,
      skillId: investment.skillId,
      skillName: investment.skillName,
      skillCategory: investment.skillCategory,
      skillOwner: investment.skillOwnerName || `${investment.skillOwnerWallet?.slice(0, 6)}...${investment.skillOwnerWallet?.slice(-4)}`,
      investor: `${investment.investorWallet.slice(0, 6)}...${investment.investorWallet.slice(-4)}`,
      investorWallet: investment.investorWallet,
      amount: parseFloat(investment.investmentAmount),
      expectedYield: parseFloat(investment.expectedMonthlyYield || '0'),
      currentAPY: parseFloat(investment.currentAPY || '0'),
      totalEarned: parseFloat(investment.totalYieldEarned || '0'),
      investmentDate: investment.investmentDate,
      status: investment.status,
      riskScore: investment.riskScore,
      jobsCompleted: investment.jobsCompleted || 0,
      monthlyRevenue: parseFloat(investment.monthlyJobRevenue || '0'),
      // Calculate time ago
      timeAgo: getTimeAgo(investment.investmentDate)
    }))

    return NextResponse.json({
      success: true,
      investments: formattedInvestments,
      total: formattedInvestments.length
    })

  } catch (error) {
    console.error('Error fetching recent investments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent investments' },
      { status: 500 }
    )
  }
}

/**
 * Helper function to calculate time ago
 */
function getTimeAgo(date: Date | null): string {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
} 