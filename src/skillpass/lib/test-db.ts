import { db, userProfiles } from './db'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Try a simple query
    const result = await db.select().from(userProfiles).limit(1)
    console.log('✅ Database connection successful!')
    console.log(`📊 Found ${result.length} users in database`)
    
    if (result.length > 0) {
      console.log('👤 Sample user:', {
        name: result[0].displayName,
        reputation: result[0].reputationScore,
        skills: result[0].totalSkills
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.error('💡 Make sure:')
    console.error('   1. PostgreSQL is running (npm run docker:up)')
    console.error('   2. DATABASE_URL is set correctly in .env')
    console.error('   3. Database migrations have been run (npm run db:migrate)')
    return false
  }
}

if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} 