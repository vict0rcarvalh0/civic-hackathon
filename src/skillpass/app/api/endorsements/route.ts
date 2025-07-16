import { NextRequest, NextResponse } from 'next/server'
import { db, endorsements, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, sql } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skillId, stakedAmount, evidence } = body

    // Validate required fields
    if (!skillId || !stakedAmount) {
      return NextResponse.json(
        { success: false, error: 'Skill ID and staked amount are required' },
        { status: 400 }
      )
    }

    // Validate staked amount
    const amount = parseFloat(stakedAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid staked amount' },
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

    // For now, create a demo endorser since we don't have auth yet
    // In a real app, you'd get this from the session/auth token
    const demoEndorserId = 'endorser-' + Date.now()
    const demoEndorserWallet = '0x' + Math.random().toString(16).substr(2, 40)

    // Create the endorsement
    const newEndorsement = {
      id: nanoid(),
      skillId: skillId,
      endorserId: demoEndorserId,
      endorserWallet: demoEndorserWallet,
      stakedAmount: amount.toString(),
      evidence: evidence || null,
      transactionHash: null, // Will be set when blockchain transaction is made
      blockNumber: null,
      active: true,
      challenged: false,
      resolved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the endorsement
    await db.insert(endorsements).values(newEndorsement)

    // Update skill endorsement count and total staked
    await db
      .update(skills)
      .set({
        endorsementCount: sql`${skills.endorsementCount} + 1`,
        totalStaked: sql`CAST(${skills.totalStaked} AS NUMERIC) + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(skills.id, skillId))

    // Create or update endorser profile if it doesn't exist
    try {
      await db.insert(userProfiles).values({
        id: demoEndorserId,
        walletAddress: demoEndorserWallet,
        displayName: 'Demo Endorser',
        bio: 'Demo endorser for testing endorsement functionality',
        avatar: null,
        website: null,
        twitter: null,
        linkedin: null,
        reputationScore: '850',
        totalSkills: 0,
        totalEndorsements: 1,
        verifiedSkills: 0,
        lastActive: new Date(),
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error) {
      // User might already exist, that's fine
      console.log('Endorser profile might already exist, continuing...')
    }

    return NextResponse.json({
      success: true,
      endorsement: {
        id: newEndorsement.id,
        skillId: newEndorsement.skillId,
        stakedAmount: newEndorsement.stakedAmount,
        evidence: newEndorsement.evidence
      },
      message: 'Endorsement submitted successfully!'
    })

  } catch (error) {
    console.error('Error creating endorsement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create endorsement. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = db
      .select({
        id: endorsements.id,
        skillId: endorsements.skillId,
        skillName: skills.name,
        endorserId: endorsements.endorserId,
        endorserName: userProfiles.displayName,
        endorserReputation: userProfiles.reputationScore,
        stakedAmount: endorsements.stakedAmount,
        evidence: endorsements.evidence,
        active: endorsements.active,
        challenged: endorsements.challenged,
        createdAt: endorsements.createdAt
      })
      .from(endorsements)
      .innerJoin(skills, eq(endorsements.skillId, skills.id))
      .innerJoin(userProfiles, eq(endorsements.endorserId, userProfiles.id))

    // Apply filters
    if (skillId) {
      query = query.where(eq(endorsements.skillId, skillId))
    }
    if (userId) {
      query = query.where(eq(skills.userId, userId))
    }

    const endorsementData = await query
      .orderBy(sql`${endorsements.createdAt} DESC`)
      .limit(limit)

    return NextResponse.json({
      success: true,
      endorsements: endorsementData.map(endorsement => ({
        id: endorsement.id,
        skillId: endorsement.skillId,
        skillName: endorsement.skillName,
        endorserId: endorsement.endorserId,
        endorserName: endorsement.endorserName || 'Anonymous',
        endorserReputation: Number(endorsement.endorserReputation) / 100,
        stakedAmount: Number(endorsement.stakedAmount),
        evidence: endorsement.evidence,
        active: endorsement.active,
        challenged: endorsement.challenged,
        createdAt: endorsement.createdAt?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching endorsements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch endorsements' },
      { status: 500 }
    )
  }
} 