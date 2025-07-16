import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles } from '@/lib/db'
import { desc, eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const verified = searchParams.get('verified')

    // Get skills with user information for endorsement
    let query = db
      .select({
        skillId: skills.id,
        skillName: skills.name,
        skillCategory: skills.category,
        skillDescription: skills.description,
        skillTokenId: skills.tokenId,
        skillEndorsementCount: skills.endorsementCount,
        skillTotalStaked: skills.totalStaked,
        skillVerified: skills.verified,
        skillStatus: skills.status,
        skillEvidence: skills.evidence,
        skillCreatedAt: skills.createdAt,
        userId: userProfiles.id,
        userName: userProfiles.displayName,
        userReputation: userProfiles.reputationScore,
        userAvatar: userProfiles.avatar
      })
      .from(skills)
      .innerJoin(userProfiles, eq(skills.userId, userProfiles.walletAddress))

    // Apply filters if provided
    if (category) {
      query = query.where(eq(skills.category, category))
    }
    if (verified === 'true') {
      query = query.where(eq(skills.verified, true))
    } else if (verified === 'false') {
      query = query.where(eq(skills.verified, false))
    }

    const skillsData = await query
      .orderBy(desc(skills.verified), desc(skills.endorsementCount), desc(skills.createdAt))
      .limit(limit)

    // Transform the data to match the frontend interface
    const endorsableSkills = skillsData.map(skill => ({
      id: skill.skillId,
      name: skill.skillName,
      category: skill.skillCategory,
      description: skill.skillDescription,
      tokenId: skill.skillTokenId,
      userName: skill.userName || 'Anonymous User',
      userReputation: Number(skill.userReputation) || 0,
      endorsementCount: skill.skillEndorsementCount || 0,
      totalStaked: Number(skill.skillTotalStaked) || 0,
      verified: skill.skillVerified || false,
      status: skill.skillStatus || 'pending',
      evidence: skill.skillEvidence,
      createdAt: skill.skillCreatedAt?.toISOString() || new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      skills: endorsableSkills,
      total: endorsableSkills.length
    })

  } catch (error) {
    console.error('Error fetching endorsable skills:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills for endorsement' },
      { status: 500 }
    )
  }
} 