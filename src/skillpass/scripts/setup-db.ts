#!/usr/bin/env npx tsx

import { exec } from 'child_process'
import { promisify } from 'util'
import { seedDatabase } from '../lib/seed'

const execAsync = promisify(exec)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up SkillPass database...\n')
    console.log(process.env)
    
    // Check if DATABASE_URL is set
    // if (!process.env.DATABASE_URL) {
      // console.error('❌ DATABASE_URL environment variable is not set')
      // console.log('💡 Make sure to set DATABASE_URL in your .env file')
      // process.exit(1)
    // }
    
    console.log('📦 Installing dependencies...')
    await execAsync('npm install --force')
    
    console.log('🔧 Generating Drizzle migrations...')
    await execAsync('npx drizzle-kit generate')
    
    console.log('🔄 Running database migrations...')
    await execAsync('npx drizzle-kit push')
    
    console.log('🌱 Seeding database with sample data...')
    await seedDatabase()
    
    console.log('\n✅ Database setup completed successfully!')
    console.log('\n🎉 Your SkillPass database is ready!')
    console.log('\n📝 Next steps:')
    console.log('   1. Start your development server: npm run dev')
    console.log('   2. Visit http://localhost:3000 to see your app')
    console.log('   3. Check the dashboard and leaderboard with real data!')
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupDatabase()
} 