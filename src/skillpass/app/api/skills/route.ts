import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, and, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description, evidence } = body

    // Validate required fields
    if (!name || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, category, and description are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a demo user since we don't have auth yet
    // In a real app, you'd get this from the session/auth token
    const demoUserId = 'demo-user-' + Date.now()
    const demoWalletAddress = '0x' + Math.random().toString(16).substr(2, 40)

    // Create the skill
    const newSkill = {
      id: nanoid(),
      userId: demoUserId,
      walletAddress: demoWalletAddress,
      category,
      name,
      description,
      evidence: evidence ? { portfolio: [evidence] } : null,
      tokenId: null, // Will be set when minted on blockchain
      contractAddress: null,
      blockNumber: null,
      transactionHash: null,
      ipfsHash: null,
      metadataUri: null,
      totalStaked: '0',
      endorsementCount: 0,
      verified: false,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the skill into database
    await db.insert(skills).values(newSkill)

    // Create or update user profile if it doesn't exist
    try {
      await db.insert(userProfiles).values({
        id: demoUserId,
        walletAddress: demoWalletAddress,
        displayName: 'Demo User',
        bio: 'Demo user for testing skills functionality',
        avatar: null,
        website: null,
        twitter: null,
        linkedin: null,
        reputationScore: '1000',
        totalSkills: 1,
        totalEndorsements: 0,
        verifiedSkills: 0,
        lastActive: new Date(),
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error) {
      // User might already exist, that's fine
      console.log('User might already exist, continuing...')
    }

    return NextResponse.json({
      success: true,
      skill: {
        id: newSkill.id,
        name: newSkill.name,
        category: newSkill.category,
        description: newSkill.description,
        status: newSkill.status
      },
      message: 'Skill added successfully!'
    })

  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create skill. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const verified = searchParams.get('verified')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build the query with filters
    let whereConditions = []
    if (userId) {
      whereConditions.push(eq(skills.userId, userId))
    }
    if (category) {
      whereConditions.push(eq(skills.category, category))
    }
    if (verified === 'true') {
      whereConditions.push(eq(skills.verified, true))
    }

    let allSkills
    if (whereConditions.length > 0) {
      allSkills = await db
        .select()
        .from(skills)
        .where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
        .orderBy(desc(skills.createdAt))
        .limit(limit)
    } else {
      allSkills = await db
        .select()
        .from(skills)
        .orderBy(desc(skills.createdAt))
        .limit(limit)
    }

    return NextResponse.json({
      success: true,
      skills: allSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        endorsements: skill.endorsementCount || 0,
        verified: skill.verified || false,
        status: skill.status || 'pending',
        evidence: skill.evidence,
        createdAt: skill.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
} 