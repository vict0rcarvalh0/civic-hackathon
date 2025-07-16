import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles, investments } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, sql } from 'drizzle-orm'

/**
 * Create a new skill investment with revenue sharing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      skillId, 
      investmentAmount, 
      expectedMonthlyYield,
      investorWallet, 
      transactionHash, 
      blockNumber 
    } = body

    // Validate required fields
    if (!skillId || !investmentAmount || !investorWallet) {
      return NextResponse.json(
        { success: false, error: 'Skill ID, investment amount, and investor wallet are required' },
        { status: 400 }
      )
    }

    // Validate investment amount
    const amount = parseFloat(investmentAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid investment amount' },
        { status: 400 }
      )
    }

    if (amount < 50) {
      return NextResponse.json(
        { success: false, error: 'Minimum investment is 50 REPR tokens' },
        { status: 400 }
      )
    }

    // Check if skill exists
    const skill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, skillId))
      .limit(1)

    if (skill.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      )
    }

    // Check if user is trying to invest in their own skill
    // Temporarily disabled for testing
    /*
    if (skill[0].walletAddress === investorWallet) {
      return NextResponse.json(
        { success: false, error: 'Cannot invest in your own skill' },
        { status: 400 }
      )
    }
    */

    // Calculate investment metrics
    const projectedAPY = calculateAPY(skill[0], amount)
    const monthlyYieldEstimate = (amount * (projectedAPY / 100)) / 12
    const finalExpectedYield = expectedMonthlyYield ? parseFloat(expectedMonthlyYield.toString()) : monthlyYieldEstimate

    // Create the investment record
    const newInvestment = {
      id: nanoid(),
      skillId: skillId,
      investorId: investorWallet,
      investorWallet: investorWallet,
      investmentAmount: amount.toString(),
      expectedMonthlyYield: finalExpectedYield.toString(),
      currentAPY: projectedAPY.toString(),
      totalYieldEarned: '0',
      totalYieldClaimed: '0',
      pendingYield: '0',
      lastYieldClaim: null,
      jobsCompleted: 0,
      monthlyJobRevenue: '0',
      riskScore: calculateRiskScore(skill[0]),
      transactionHash: transactionHash || null,
      blockNumber: blockNumber || null,
      status: 'active',
      investmentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert investment into database
    await db.insert(investments).values(newInvestment)

    // Update skill with new investment data
    await db
      .update(skills)
      .set({
        totalStaked: sql`CAST(${skills.totalStaked} AS NUMERIC) + ${amount}`,
        endorsementCount: sql`${skills.endorsementCount} + 1`, // Count investments as endorsements for now
        updatedAt: new Date()
      })
      .where(eq(skills.id, skillId))

    // Update or create investor profile
    try {
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.walletAddress, investorWallet))
        .limit(1)
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          id: nanoid(),
          walletAddress: investorWallet,
          displayName: `Investor ${investorWallet.slice(-6)}`,
          bio: 'Skill investor',
          avatar: null,
          website: null,
          twitter: null,
          linkedin: null,
          reputationScore: '0',
          totalSkills: 0,
          totalEndorsements: 1, // Count investments as endorsements
          verifiedSkills: 0,
          lastActive: new Date(),
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } else {
        await db
          .update(userProfiles)
          .set({
            totalEndorsements: (existingProfile[0].totalEndorsements || 0) + 1,
            lastActive: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userProfiles.walletAddress, investorWallet))
      }
    } catch (profileError) {
      console.error('Error updating investor profile:', profileError)
    }

    return NextResponse.json({
      success: true,
      investment: newInvestment,
      metrics: {
        investmentAmount: amount,
        projectedAPY: projectedAPY,
        monthlyYieldEstimate: monthlyYieldEstimate.toFixed(2),
        expectedMonthlyYield: finalExpectedYield.toFixed(2)
      },
      message: `Successfully invested ${amount} REPR tokens! Expected monthly yield: $${finalExpectedYield.toFixed(2)}`
    })

  } catch (error: any) {
    console.error('Investment creation error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { success: false, error: 'Failed to create investment', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Calculate projected APY based on skill metrics
 */
function calculateAPY(skill: any, investmentAmount: number): number {
  // Base APY calculation (15-45% range)
  let baseAPY = 15
  
  // Boost based on endorsements/investments
  const endorsementBoost = Math.min(15, (skill.endorsementCount || 0) * 2)
  baseAPY += endorsementBoost
  
  // Boost for verified skills
  if (skill.verified) {
    baseAPY += 10
  }
  
  // Boost based on total staked (higher staked = higher confidence)
  const totalStaked = parseFloat(skill.totalStaked || '0')
  if (totalStaked > 1000) baseAPY += 5
  if (totalStaked > 5000) baseAPY += 5
  
  return Math.min(45, baseAPY) // Cap at 45%
}

/**
 * Calculate risk score (0-100, lower is safer)
 */
function calculateRiskScore(skill: any): number {
  let riskScore = 50 // Start at medium risk
  
  // Lower risk for verified skills
  if (skill.verified) riskScore -= 20
  
  // Lower risk for established skills (more endorsements)
  const endorsements = skill.endorsementCount || 0
  if (endorsements > 5) riskScore -= 10
  if (endorsements > 15) riskScore -= 10
  
  // Lower risk for higher total investment
  const totalStaked = parseFloat(skill.totalStaked || '0')
  if (totalStaked > 2000) riskScore -= 10
  if (totalStaked > 10000) riskScore -= 10
  
  return Math.max(10, Math.min(90, riskScore)) // Keep between 10-90
} 