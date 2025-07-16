import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, and, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description, evidence, walletAddress, tokenId, transactionHash, blockNumber, contractAddress } = body

    // Validate required fields
    if (!name || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, category, and description are required' },
        { status: 400 }
      )
    }

    // For blockchain integration, we expect these fields from the frontend
    const userId = walletAddress || 'demo-user-' + Date.now()
    const userWallet = walletAddress || '0x' + Math.random().toString(16).substr(2, 40)

    // Create metadata URI
    const metadata = {
      name,
      description,
      category,
      image: "https://skillpass.app/placeholder-skill.png",
      attributes: [
        { trait_type: "Category", value: category },
        { trait_type: "Verified", value: false },
        { trait_type: "Created", value: new Date().toISOString() }
      ]
    }
    
    const metadataUri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`

    // Create the skill
    const newSkill = {
      id: nanoid(),
      userId: userId,
      walletAddress: userWallet,
      category,
      name,
      description,
      evidence: evidence ? { portfolio: [evidence] } : null,
      tokenId: tokenId?.toString() || null, // From blockchain mint
      contractAddress: contractAddress || null, // SkillNFT contract address
      blockNumber: blockNumber || null,
      transactionHash: transactionHash || null,
      ipfsHash: null,
      metadataUri: metadataUri,
      totalStaked: '0',
      endorsementCount: 0,
      verified: false,
      status: tokenId ? 'active' : 'pending', // Active if minted on blockchain
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the skill into database
    await db.insert(skills).values(newSkill)

    // Create or update user profile if it doesn't exist
    try {
      const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.walletAddress, userWallet)).limit(1)
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          id: nanoid(),
          walletAddress: userWallet,
          displayName: `User ${userWallet.slice(-6)}`,
          bio: '',
          avatar: null,
          website: null,
          twitter: null,
          linkedin: null,
          reputationScore: '0',
          totalSkills: 1,
          totalEndorsements: 0,
          verifiedSkills: 0,
          lastActive: new Date(),
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } else {
        // Update skills count
        await db.update(userProfiles)
          .set({ 
            totalSkills: (existingProfile[0].totalSkills || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(userProfiles.walletAddress, userWallet))
      }
    } catch (profileError) {
      console.error('Error updating user profile:', profileError)
      // Don't fail the skill creation if profile update fails
    }

    return NextResponse.json({
      success: true,
      skill: newSkill,
      message: 'Skill created successfully'
    })

  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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