import { NextRequest, NextResponse } from 'next/server'
import { db, skills, userProfiles, endorsements } from '@/lib/db'
import { desc, count, sum, eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'skills'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (type === 'skills') {
      // Get top skills by endorsement count and total staked
      const topSkills = await db
        .select({
          id: skills.id,
          name: skills.name,
          category: skills.category,
          description: skills.description,
          endorsementCount: skills.endorsementCount,
          totalStaked: skills.totalStaked,
          verified: skills.verified,
          status: skills.status,
          // Calculate average rating (simplified - using endorsement count as proxy)
          avgRating: sql<number>`CASE 
            WHEN ${skills.endorsementCount} = 0 THEN 0 
            ELSE LEAST(9.5, 7.0 + (${skills.endorsementCount}::float / 10)) 
          END`,
          // Calculate growth percentage (simplified random for demo)
          growth: sql<string>`CONCAT('+', (${skills.endorsementCount} + 5)::text, '%')`
        })
        .from(skills)
        .orderBy(desc(skills.verified), desc(skills.endorsementCount), desc(skills.totalStaked))
        .limit(limit)

      return NextResponse.json({
        success: true,
        skills: topSkills.map((skill, index) => ({
          rank: index + 1,
          skill: skill.name,
          category: skill.category,
          endorsements: skill.endorsementCount,
          avgRating: Number(skill.avgRating?.toFixed(1)) || 8.0,
          growth: skill.growth,
          verified: skill.verified,
          status: skill.status
        }))
      })
    } 
    
    else if (type === 'users') {
      // Get top users by reputation score
      const topUsers = await db
        .select({
          id: userProfiles.id,
          displayName: userProfiles.displayName,
          avatar: userProfiles.avatar,
          reputationScore: userProfiles.reputationScore,
          totalSkills: userProfiles.totalSkills,
          totalEndorsements: userProfiles.totalEndorsements,
          verifiedSkills: userProfiles.verifiedSkills,
          joinedAt: userProfiles.joinedAt
        })
        .from(userProfiles)
        .orderBy(desc(userProfiles.reputationScore))
        .limit(limit)

      return NextResponse.json({
        success: true,
        users: topUsers.map((user, index) => ({
          rank: index + 1,
          id: user.id,
          name: user.displayName || 'Anonymous User',
          avatar: user.avatar,
          reputation: Number(user.reputationScore) / 1000, // Convert to decimal
          skills: user.totalSkills,
          endorsements: user.totalEndorsements,
          verifiedSkills: user.verifiedSkills,
          joinedAt: user.joinedAt
        }))
      })
    }

    else {
      return NextResponse.json(
        { success: false, error: 'Invalid type parameter' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    )
  }
} 