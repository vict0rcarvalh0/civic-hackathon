import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
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
    if (skill[0].walletAddress === investorWallet) {
      return NextResponse.json(
        { success: false, error: 'Cannot invest in your own skill' },
        { status: 400 }
      )
    }

    // Create the investment record
    const newInvestment = {
      id: nanoid(),
      skillId: skillId,
      investorId: investorWallet, // Use wallet address as ID
      investorWallet: investorWallet,
      investmentAmount: amount.toString(),
      expectedMonthlyYield: expectedMonthlyYield || '0',
      transactionHash: transactionHash || null,
      blockNumber: blockNumber || null,
      status: 'active',
      investmentDate: new Date(),
      lastYieldClaim: new Date(),
      totalYieldClaimed: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // TODO: Insert investment into investments table (needs DB migration)
    // await db.insert(investments).values(newInvestment)

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

    // Calculate investment metrics
    const projectedAPY = calculateAPY(skill[0], amount)
    const monthlyYieldEstimate = (amount * (projectedAPY / 100)) / 12

    return NextResponse.json({
      success: true,
      investment: newInvestment,
      metrics: {
        investmentAmount: amount,
        projectedAPY: projectedAPY,
        monthlyYieldEstimate: monthlyYieldEstimate.toFixed(2),
        expectedMonthlyYield: expectedMonthlyYield
      },
      message: `Successfully invested ${amount} REPR tokens! Expected monthly yield: $${expectedMonthlyYield}`
    })

  } catch (error) {
    console.error('Error creating investment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Calculate projected APY based on skill metrics
 */
function calculateAPY(skill: any, investmentAmount: number): number {
  const baseAPY = 12 // Base 12% APY
  const endorsementBonus = Math.min((skill.endorsementCount || 0) * 2, 20) // Up to 20% bonus
  const stakeBonus = (skill.totalStaked || 0) > 1000 ? 8 : 4 // Higher stakes = better performance
  const verificationBonus = skill.verified ? 5 : 0 // Verified skills get bonus
  
  return baseAPY + endorsementBonus + stakeBonus + verificationBonus
} 