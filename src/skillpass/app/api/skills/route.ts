import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq, and, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Skills API: Received request body:', JSON.stringify(body, null, 2))
    
    const { name, category, description, evidence, walletAddress, tokenId, transactionHash, blockNumber, contractAddress } = body

    // Validate required fields
    if (!name || !category || !description) {
      console.error('❌ Skills API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, category, and description are required' },
        { status: 400 }
      )
    }

    // For blockchain integration, we expect these fields from the frontend
    const userId = walletAddress || 'demo-user-' + Date.now()
    const userWallet = walletAddress || '0x' + Math.random().toString(16).substr(2, 40)

    console.log('🔍 Skills API: Processing skill creation for user:', userId)

    // Create metadata URI
    const metadata = {
      name,
      description,
      category,
      image: "https://skillpass.app/placeholder-skill.png",
      attributes: [
        { trait_type: "Category", value: category },
        { trait_type: "Verified", value: true }, // Auto-verify skills
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
      blockNumber: blockNumber ? Number(blockNumber) : null, // Ensure it's a number
      transactionHash: transactionHash || null,
      ipfsHash: null,
      metadataUri: metadataUri,
      totalStaked: '0',
      endorsementCount: 0,
      verified: true, // Auto-verify new skills
      status: tokenId ? 'verified' : 'verified', // Mark as verified instead of pending
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('🔍 Skills API: About to insert skill:', JSON.stringify(newSkill, null, 2))

    // Check if a skill with this token_id already exists (for blockchain minting conflicts)
    if (newSkill.tokenId) {
      const existingSkillWithToken = await db
        .select()
        .from(skills)
        .where(eq(skills.tokenId, newSkill.tokenId))
        .limit(1)
      
      if (existingSkillWithToken.length > 0) {
        console.log('🔍 Skills API: Found existing skill with same token_id, updating instead of inserting')
        
        // Update the existing skill with new transaction details
        await db
          .update(skills)
          .set({
            name: newSkill.name,
            category: newSkill.category,
            description: newSkill.description,
            evidence: newSkill.evidence,
            walletAddress: newSkill.walletAddress,
            contractAddress: newSkill.contractAddress,
            blockNumber: newSkill.blockNumber,
            transactionHash: newSkill.transactionHash,
            metadataUri: newSkill.metadataUri,
            verified: true,
            status: 'verified',
            updatedAt: new Date()
          })
          .where(eq(skills.tokenId, newSkill.tokenId))
        
        console.log('✅ Skills API: Existing skill updated successfully')
        
        // Return the updated skill data
        const updatedSkill = { ...existingSkillWithToken[0], ...newSkill }
        return NextResponse.json({
          success: true,
          skill: updatedSkill,
          message: 'Skill updated successfully with new transaction details'
        })
      }
    }

    // Insert the skill into database
    await db.insert(skills).values(newSkill)
    console.log('✅ Skills API: Skill inserted successfully')

    // Create or update user profile if it doesn't exist
    try {
      console.log('🔍 Skills API: Checking user profile for wallet:', userWallet)
      const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.walletAddress, userWallet)).limit(1)
      
      if (existingProfile.length === 0) {
        console.log('🔍 Skills API: Creating new user profile')
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
          verifiedSkills: 1, // New skill is auto-verified
          lastActive: new Date(),
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        console.log('✅ Skills API: New user profile created')
      } else {
        console.log('🔍 Skills API: Updating existing user profile')
        // Update skills count
        await db.update(userProfiles)
          .set({ 
            totalSkills: (existingProfile[0].totalSkills || 0) + 1,
            verifiedSkills: (existingProfile[0].verifiedSkills || 0) + 1, // Increment verified skills
            updatedAt: new Date()
          })
          .where(eq(userProfiles.walletAddress, userWallet))
        console.log('✅ Skills API: User profile updated')
      }
    } catch (profileError: any) {
      console.error('❌ Skills API: Error updating user profile:', profileError)
      console.error('❌ Skills API: Profile error message:', profileError.message)
    }

    console.log('✅ Skills API: Skill creation completed successfully')
    return NextResponse.json({
      success: true,
      skill: newSkill,
      message: 'Skill created successfully'
    })

  } catch (error: any) {
    console.error('❌ Skills API: Error creating skill:', error)
    console.error('❌ Skills API: Error type:', error.constructor.name)
    console.error('❌ Skills API: Error message:', error.message)
    console.error('❌ Skills API: Error stack:', error.stack)
    
    // More specific error handling
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, error: 'Skill with this data already exists' },
        { status: 409 }
      )
    }
    
    if (error.message?.includes('foreign key')) {
      return NextResponse.json(
        { success: false, error: 'Database constraint error' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
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