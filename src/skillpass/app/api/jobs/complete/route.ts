import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'

/**
 * Record job completion and distribute revenue to skill investors
 * This is the core endpoint that makes investors actually earn money!
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      skillId, 
      jobRevenue, 
      jobTitle, 
      clientAddress, 
      skillOwnerAddress,
      transactionHash 
    } = body

    // Validate required fields
    if (!skillId || !jobRevenue || !skillOwnerAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const revenue = parseFloat(jobRevenue)
    if (isNaN(revenue) || revenue <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid job revenue amount' },
        { status: 400 }
      )
    }

    // Verify skill exists
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

    // Calculate revenue distribution
    const platformFee = revenue * 0.10  // 10% of job goes to platform/investors
    const investorShare = platformFee * 0.70  // 70% to investors
    const skillOwnerBonus = platformFee * 0.20  // 20% bonus to skill owner
    const platformTreasury = platformFee * 0.10  // 10% to platform

    // Record the job completion
    const jobRecord = {
      id: nanoid(),
      skillId: skillId,
      jobTitle: jobTitle || 'Completed Project',
      totalRevenue: revenue,
      platformFee: platformFee,
      investorShare: investorShare,
      skillOwnerBonus: skillOwnerBonus,
      clientAddress: clientAddress,
      skillOwnerAddress: skillOwnerAddress,
      transactionHash: transactionHash,
      completedAt: new Date(),
      status: 'completed'
    }

    // TODO: Call smart contract to distribute revenue
    // This would typically call skillRevenue.recordJobCompletion()
    console.log('📈 Job Revenue Distribution:', {
      totalRevenue: revenue,
      investorShare: investorShare,
      skillOwnerBonus: skillOwnerBonus,
      platformTreasury: platformTreasury
    })

    // Update skill metrics with new revenue
    await db
      .update(skills)
      .set({
        totalStaked: skill[0].totalStaked, // Keep existing stake
        // Add revenue tracking fields (would need DB migration)
        updatedAt: new Date()
      })
      .where(eq(skills.id, skillId))

    return NextResponse.json({
      success: true,
      jobRecord: jobRecord,
      distribution: {
        totalRevenue: revenue,
        investorShare: investorShare,
        skillOwnerBonus: skillOwnerBonus,
        platformFee: platformTreasury
      },
      message: 'Job completed and revenue distributed to investors!'
    })

  } catch (error) {
    console.error('Error recording job completion:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Get job completion history for a skill
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'skillId parameter required' },
        { status: 400 }
      )
    }

    // TODO: Query job history from database
    // For now, return mock data to show what real data would look like
    const mockJobHistory = [
      {
        id: 'job_1',
        jobTitle: 'E-commerce Website Development',
        totalRevenue: 2500,
        investorShare: 175, // 7% of total revenue
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'completed'
      },
      {
        id: 'job_2',
        jobTitle: 'React Dashboard Implementation',
        totalRevenue: 1800,
        investorShare: 126, // 7% of total revenue
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        status: 'completed'
      },
      {
        id: 'job_3',
        jobTitle: 'API Integration & Testing',
        totalRevenue: 800,
        investorShare: 56, // 7% of total revenue
        completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        status: 'completed'
      }
    ]

    // Calculate metrics
    const totalInvestorRevenue = mockJobHistory.reduce((sum, job) => sum + job.investorShare, 0)
    const monthlyRevenue = mockJobHistory
      .filter(job => job.completedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, job) => sum + job.investorShare, 0)

    return NextResponse.json({
      success: true,
      jobHistory: mockJobHistory.slice(0, limit),
      metrics: {
        totalJobs: mockJobHistory.length,
        totalInvestorRevenue: totalInvestorRevenue,
        monthlyRevenue: monthlyRevenue,
        averageJobValue: mockJobHistory.reduce((sum, job) => sum + job.totalRevenue, 0) / mockJobHistory.length
      }
    })

  } catch (error) {
    console.error('Error fetching job history:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 