import { db, skills, investments, userProfiles } from '../lib/db'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'

async function seedInvestments() {
  console.log('🌱 Seeding investments...')

  try {
    // Get some existing skills to invest in
    const existingSkills = await db
      .select()
      .from(skills)
      .limit(5)

    if (existingSkills.length === 0) {
      console.log('❌ No skills found. Please seed skills first.')
      return
    }

    // Create sample investors
    const investors = [
      {
        id: nanoid(),
        walletAddress: '0x742d35Cc6634C0532925a3b8',
        displayName: 'Alice Chen',
        bio: 'Professional investor focused on tech skills',
        reputationScore: '5000',
        totalEndorsements: 3,
        joinedAt: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(), 
        walletAddress: '0x8ba1f109551bD432803012b0',
        displayName: 'Bob Smith',
        bio: 'Angel investor specializing in developer talent',
        reputationScore: '7500',
        totalEndorsements: 5,
        joinedAt: new Date('2024-05-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        walletAddress: '0x9fE46736679d2D9a65F09922',
        displayName: 'Carol Williams',
        bio: 'VC partner investing in emerging tech skills',
        reputationScore: '12000',
        totalEndorsements: 8,
        joinedAt: new Date('2024-04-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Insert investors
    for (const investor of investors) {
      await db.insert(userProfiles).values(investor).onConflictDoNothing()
    }

    // Create sample investments
    const sampleInvestments = [
      {
        id: nanoid(),
        skillId: existingSkills[0].id,
        investorId: investors[0].walletAddress,
        investorWallet: investors[0].walletAddress,
        investmentAmount: '2500.00',
        expectedMonthlyYield: '87.50',
        currentAPY: '42.0',
        totalYieldEarned: '175.00',
        totalYieldClaimed: '87.50',
        pendingYield: '87.50',
        lastYieldClaim: new Date('2024-07-01'),
        jobsCompleted: 3,
        monthlyJobRevenue: '1200.00',
        riskScore: 25,
        transactionHash: '0x1234567890abcdef',
        status: 'active',
        investmentDate: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        skillId: existingSkills[1].id,
        investorId: investors[1].walletAddress,
        investorWallet: investors[1].walletAddress,
        investmentAmount: '5000.00',
        expectedMonthlyYield: '145.83',
        currentAPY: '35.0',
        totalYieldEarned: '291.66',
        totalYieldClaimed: '145.83',
        pendingYield: '145.83',
        lastYieldClaim: new Date('2024-07-05'),
        jobsCompleted: 5,
        monthlyJobRevenue: '2800.00',
        riskScore: 35,
        transactionHash: '0xabcdef1234567890',
        status: 'active',
        investmentDate: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        skillId: existingSkills[2].id,
        investorId: investors[2].walletAddress,
        investorWallet: investors[2].walletAddress,
        investmentAmount: '1500.00',
        expectedMonthlyYield: '45.00',
        currentAPY: '36.0',
        totalYieldEarned: '67.50',
        totalYieldClaimed: '45.00',
        pendingYield: '22.50',
        lastYieldClaim: new Date('2024-07-01'),
        jobsCompleted: 2,
        monthlyJobRevenue: '900.00',
        riskScore: 40,
        transactionHash: '0x5678901234abcdef',
        status: 'active',
        investmentDate: new Date('2024-06-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        skillId: existingSkills[0].id,
        investorId: investors[1].walletAddress,
        investorWallet: investors[1].walletAddress,
        investmentAmount: '3000.00',
        expectedMonthlyYield: '75.00',
        currentAPY: '30.0',
        totalYieldEarned: '112.50',
        totalYieldClaimed: '75.00',
        pendingYield: '37.50',
        lastYieldClaim: new Date('2024-07-03'),
        jobsCompleted: 1,
        monthlyJobRevenue: '800.00',
        riskScore: 30,
        transactionHash: '0x9abcdef567890123',
        status: 'active',
        investmentDate: new Date('2024-07-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        skillId: existingSkills[3]?.id || existingSkills[0].id,
        investorId: investors[0].walletAddress,
        investorWallet: investors[0].walletAddress,
        investmentAmount: '800.00',
        expectedMonthlyYield: '20.00',
        currentAPY: '30.0',
        totalYieldEarned: '15.00',
        totalYieldClaimed: '0.00',
        pendingYield: '15.00',
        lastYieldClaim: null,
        jobsCompleted: 1,
        monthlyJobRevenue: '400.00',
        riskScore: 50,
        transactionHash: '0xdef9876543210abc',
        status: 'active',
        investmentDate: new Date('2024-07-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Insert investments
    for (const investment of sampleInvestments) {
      await db.insert(investments).values(investment).onConflictDoNothing()
    }

    console.log(`✅ Created ${sampleInvestments.length} sample investments`)
    console.log(`✅ Created ${investors.length} sample investors`)
    console.log('🎉 Investment seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding investments:', error)
  }
}

// Run if called directly
if (require.main === module) {
  seedInvestments().then(() => process.exit(0))
}

export default seedInvestments 