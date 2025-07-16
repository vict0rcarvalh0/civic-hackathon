import { NextRequest, NextResponse } from 'next/server'
import { db, endorsements, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, sql, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skillId, stakedAmount, evidence, endorserWallet, transactionHash, blockNumber } = body

    // Validate required fields
    if (!skillId || !stakedAmount || !endorserWallet) {
      return NextResponse.json(
        { success: false, error: 'Skill ID, staked amount, and endorser wallet are required' },
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

    // Create the endorsement
    const newEndorsement = {
      id: nanoid(),
      skillId: skillId,
      endorserId: endorserWallet, // Use wallet address as ID for blockchain integration
      endorserWallet: endorserWallet,
      stakedAmount: amount.toString(),
      evidence: evidence || null,
      transactionHash: transactionHash || null, // From blockchain transaction
      blockNumber: blockNumber || null,
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

    // Update or create endorser profile
    try {
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.walletAddress, endorserWallet))
        .limit(1)
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          id: nanoid(),
          walletAddress: endorserWallet,
          displayName: `User ${endorserWallet.slice(-6)}`,
          bio: '',
          avatar: null,
          website: null,
          twitter: null,
          linkedin: null,
          reputationScore: '0',
          totalSkills: 0,
          totalEndorsements: 1,
          verifiedSkills: 0,
          lastActive: new Date(),
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } else {
        // Update endorsement count
        await db
          .update(userProfiles)
          .set({
            totalEndorsements: (existingProfile[0].totalEndorsements || 0) + 1,
            lastActive: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userProfiles.walletAddress, endorserWallet))
      }
    } catch (profileError) {
      console.error('Error updating endorser profile:', profileError)
      // Don't fail the endorsement if profile update fails
    }

    return NextResponse.json({
      success: true,
      endorsement: newEndorsement,
      message: 'Endorsement created successfully'
    })

  } catch (error) {
    console.error('Error creating endorsement:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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