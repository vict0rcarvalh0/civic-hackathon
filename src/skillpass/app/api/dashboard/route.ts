import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles, endorsements, investments } from '@/lib/db'
import { desc, eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      // Calculate real stats from database instead of using demo data
      
      // Get all skills count
      const totalSkillsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(skills)
      const totalSkills = totalSkillsResult[0]?.count || 0

      // Get total investments count (new metric)
      const totalInvestmentsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(investments)
      const totalInvestments = totalInvestmentsResult[0]?.count || 0

      // Calculate total investment value
      const totalInvestmentValueResult = await db
        .select({ 
          totalValue: sql<number>`COALESCE(SUM(CAST(investment_amount AS NUMERIC)), 0)` 
        })
        .from(investments)
      const totalInvestmentValue = Number(totalInvestmentValueResult[0]?.totalValue || 0)

      // Calculate average APY from investments
      const avgAPYResult = await db
        .select({ 
          avgAPY: sql<number>`COALESCE(AVG(CAST(current_apy AS NUMERIC)), 0)` 
        })
        .from(investments)
        .where(eq(investments.status, 'active'))
      const avgAPY = Number((avgAPYResult[0]?.avgAPY || 0))

      // Calculate a demo rank based on investment activity
      const demoRank = Math.max(1, Math.floor(totalInvestments / 5))

      const calculatedStats = {
        totalSkills: Number(totalSkills),
        endorsements: Number(totalInvestments), // Show investments as "endorsements" for compatibility
        reputation: Number((totalInvestmentValue / 100).toFixed(1)), // Show investment value as reputation
        rank: demoRank
      }
      
      // Get some sample skills from database
      const sampleSkills = await db
        .select({
          id: skills.id,
          name: skills.name,
          category: skills.category,
          description: skills.description,
          endorsementCount: skills.endorsementCount,
          verified: skills.verified,
          status: skills.status
        })
        .from(skills)
        .orderBy(desc(skills.verified), desc(skills.endorsementCount))
        .limit(8)

      // Get recent investments (not endorsements)
      const recentInvestments = await db
        .select({
          id: investments.id,
          skillName: skills.name,
          investorWallet: investments.investorWallet,
          investmentAmount: investments.investmentAmount,
          expectedYield: investments.expectedMonthlyYield,
          currentAPY: investments.currentAPY,
          investmentDate: investments.investmentDate,
          status: investments.status
        })
        .from(investments)
        .innerJoin(skills, eq(investments.skillId, skills.id))
        .orderBy(desc(investments.investmentDate))
        .limit(5)

      return NextResponse.json({
        success: true,
        stats: calculatedStats,
        skills: sampleSkills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: (skill.endorsementCount ?? 0) > 10 ? 'Expert' : (skill.endorsementCount ?? 0) > 5 ? 'Advanced' : 'Intermediate',
          endorsements: skill.endorsementCount ?? 0,
          verified: skill.verified,
          status: skill.status
        })),
        recentInvestments: recentInvestments.map(investment => ({
          skill: investment.skillName,
          investor: `${investment.investorWallet.slice(0, 6)}...${investment.investorWallet.slice(-4)}`,
          amount: parseFloat(investment.investmentAmount),
          expectedYield: parseFloat(investment.expectedYield || '0'),
          apy: parseFloat(investment.currentAPY || '0'),
          timestamp: getTimeAgo(investment.investmentDate),
          status: investment.status
        }))
      })
    }

    // If userId is provided, get specific user data
    const userProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1)

    if (userProfile.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userProfile[0]

    // Get user's skills
    const userSkills = await db
      .select({
        id: skills.id,
        name: skills.name,
        category: skills.category,
        description: skills.description,
        endorsementCount: skills.endorsementCount,
        verified: skills.verified,
        status: skills.status,
        totalStaked: skills.totalStaked
      })
      .from(skills)
      .where(eq(skills.userId, userId))
      .orderBy(desc(skills.verified), desc(skills.endorsementCount))

    // Get recent investments in user's skills
    const userSkillInvestments = await db
      .select({
        id: investments.id,
        skillName: skills.name,
        investorWallet: investments.investorWallet,
        investmentAmount: investments.investmentAmount,
        expectedYield: investments.expectedMonthlyYield,
        currentAPY: investments.currentAPY,
        investmentDate: investments.investmentDate,
        status: investments.status
      })
      .from(investments)
      .innerJoin(skills, eq(investments.skillId, skills.id))
      .where(eq(skills.userId, userId))
      .orderBy(desc(investments.investmentDate))
      .limit(5)

    return NextResponse.json({
      success: true,
      stats: {
        totalSkills: user.totalSkills,
        endorsements: user.totalEndorsements, // This will include investments
        reputation: Number(user.reputationScore) / 1000,
        rank: await getUserRank(user.reputationScore || '0')
      },
      skills: userSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: (skill.endorsementCount ?? 0) > 10 ? 'Expert' : (skill.endorsementCount ?? 0) > 5 ? 'Advanced' : 'Intermediate',
        endorsements: skill.endorsementCount ?? 0,
        verified: skill.verified,
        status: skill.status
      })),
      recentInvestments: userSkillInvestments.map(investment => ({
        skill: investment.skillName,
        investor: `${investment.investorWallet.slice(0, 6)}...${investment.investorWallet.slice(-4)}`,
        amount: parseFloat(investment.investmentAmount),
        expectedYield: parseFloat(investment.expectedYield || '0'),
        apy: parseFloat(investment.currentAPY || '0'),
        timestamp: getTimeAgo(investment.investmentDate),
        status: investment.status
      }))
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getUserRank(reputationScore: string): Promise<number> {
  const score = Number(reputationScore)
  const betterUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProfiles)
    .where(sql`CAST(reputation_score AS NUMERIC) > ${score}`)
  
  return (betterUsers[0]?.count || 0) + 1
}

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