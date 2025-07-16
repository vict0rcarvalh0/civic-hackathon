import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles, endorsements } from '@/lib/db'
import { desc, eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      // Return demo user data if no userId provided
      const demoStats = {
        totalSkills: 12,
        endorsements: 47,
        reputation: 8.4,
        rank: 23
      }
      
      // Get some sample skills from database
      const sampleSkills = await db
        .select({
          id: skills.id,
          name: skills.name,
          category: skills.category,
          description: skills.description,
          endorsementCount: skills.endorsementCount,
          verified: skills.verified
        })
        .from(skills)
        .where(eq(skills.verified, true))
        .orderBy(desc(skills.endorsementCount))
        .limit(4)

      // Get recent endorsements
      const recentEndorsements = await db
        .select({
          id: endorsements.id,
          skillName: skills.name,
          endorserName: userProfiles.displayName,
          endorserReputation: userProfiles.reputationScore,
          createdAt: endorsements.createdAt,
          evidence: endorsements.evidence
        })
        .from(endorsements)
        .innerJoin(skills, eq(endorsements.skillId, skills.id))
        .innerJoin(userProfiles, eq(endorsements.endorserId, userProfiles.id))
        .orderBy(desc(endorsements.createdAt))
        .limit(3)

      return NextResponse.json({
        success: true,
        stats: demoStats,
        skills: sampleSkills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: (skill.endorsementCount ?? 0) > 10 ? 'Expert' : (skill.endorsementCount ?? 0) > 5 ? 'Advanced' : 'Intermediate',
          endorsements: skill.endorsementCount ?? 0,
          verified: skill.verified
        })),
        recentEndorsements: recentEndorsements.map(endorsement => ({
          skill: endorsement.skillName,
          endorser: endorsement.endorserName || 'Anonymous',
          reputation: Number(endorsement.endorserReputation) / 1000,
          timestamp: getTimeAgo(endorsement.createdAt),
          evidence: endorsement.evidence || undefined
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
        totalStaked: skills.totalStaked
      })
      .from(skills)
      .where(eq(skills.userId, userId))
      .orderBy(desc(skills.endorsementCount))

    // Get recent endorsements for user's skills
    const userEndorsements = await db
      .select({
        id: endorsements.id,
        skillName: skills.name,
        endorserName: userProfiles.displayName,
        endorserReputation: userProfiles.reputationScore,
        createdAt: endorsements.createdAt,
        evidence: endorsements.evidence
      })
      .from(endorsements)
      .innerJoin(skills, eq(endorsements.skillId, skills.id))
      .innerJoin(userProfiles, eq(endorsements.endorserId, userProfiles.id))
      .where(eq(skills.userId, userId))
      .orderBy(desc(endorsements.createdAt))
      .limit(5)

    return NextResponse.json({
      success: true,
      stats: {
        totalSkills: user.totalSkills,
        endorsements: user.totalEndorsements,
        reputation: Number(user.reputationScore) / 1000,
        rank: await getUserRank(user.reputationScore || '0')
      },
      skills: userSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: (skill.endorsementCount ?? 0) > 10 ? 'Expert' : (skill.endorsementCount ?? 0) > 5 ? 'Advanced' : 'Intermediate',
        endorsements: skill.endorsementCount ?? 0,
        verified: skill.verified
      })),
      recentEndorsements: userEndorsements.map(endorsement => ({
        skill: endorsement.skillName,
        endorser: endorsement.endorserName || 'Anonymous',
        reputation: Number(endorsement.endorserReputation || '0') / 1000,
        timestamp: getTimeAgo(endorsement.createdAt),
        evidence: endorsement.evidence || undefined
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

// Helper function to calculate user rank
async function getUserRank(userReputation: string): Promise<number> {
  try {
    const higherRankedUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProfiles)
      .where(sql`${userProfiles.reputationScore} > ${userReputation}`)
    
    return (higherRankedUsers[0]?.count || 0) + 1
  } catch {
    return 1
  }
}

// Helper function to format timestamps
function getTimeAgo(date: Date | null): string {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
} 