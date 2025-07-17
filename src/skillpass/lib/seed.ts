import { db, skills, endorsements, userProfiles, challenges } from './db'
import { nanoid } from 'nanoid'

// Sample users with diverse profiles
const sampleUsers = [
  {
    id: nanoid(),
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'Sarah Chen',
    bio: 'Full-stack developer with 8+ years of experience. Passionate about React and blockchain technology.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612-f4f1?w=150&h=150&fit=crop&crop=face',
    website: 'https://sarahchen.dev',
    twitter: '@sarahchen_dev',
    linkedin: 'sarah-chen-dev',
    reputationScore: '9800',
    totalSkills: 15,
    totalEndorsements: 147,
    verifiedSkills: 12,
    lastActive: new Date(),
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: nanoid(),
    walletAddress: '0x2345678901bcdef12345678901bcdef123456789',
    displayName: 'Mike Johnson',
    bio: 'ML Engineer and Data Scientist. Building the future with AI and Web3.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    website: 'https://mikejohnson.ai',
    twitter: '@mike_johnson_ai',
    linkedin: 'mike-johnson-ai',
    reputationScore: '9600',
    totalSkills: 12,
    totalEndorsements: 134,
    verifiedSkills: 10,
    lastActive: new Date(),
    joinedAt: new Date('2023-02-20'),
  },
  {
    id: nanoid(),
    walletAddress: '0x3456789012cdef123456789012cdef1234567890',
    displayName: 'Emma Wilson',
    bio: 'UX/UI Designer with a passion for creating beautiful and functional interfaces.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    website: 'https://emmawilson.design',
    twitter: '@emma_wilson_ux',
    linkedin: 'emma-wilson-ux',
    reputationScore: '9400',
    totalSkills: 18,
    totalEndorsements: 128,
    verifiedSkills: 15,
    lastActive: new Date(),
    joinedAt: new Date('2023-03-10'),
  },
  {
    id: nanoid(),
    walletAddress: '0x456789013def123456789013def12345678901a',
    displayName: 'David Kim',
    bio: 'DevOps Engineer and Cloud Architecture specialist. Love automating everything.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    website: 'https://davidkim.cloud',
    twitter: '@david_kim_ops',
    linkedin: 'david-kim-devops',
    reputationScore: '9300',
    totalSkills: 14,
    totalEndorsements: 119,
    verifiedSkills: 11,
    lastActive: new Date(),
    joinedAt: new Date('2023-04-05'),
  },
  {
    id: nanoid(),
    walletAddress: '0x56789014ef123456789014ef12345678901ab2',
    displayName: 'Lisa Rodriguez',
    bio: 'Product Manager and Blockchain enthusiast. Building products that matter.',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    website: 'https://lisarodriguez.pm',
    twitter: '@lisa_rodriguez',
    linkedin: 'lisa-rodriguez-pm',
    reputationScore: '9100',
    totalSkills: 16,
    totalEndorsements: 115,
    verifiedSkills: 13,
    lastActive: new Date(),
    joinedAt: new Date('2023-05-12'),
  },
  {
    id: nanoid(),
    walletAddress: '0x6789015f123456789015f12345678901abc34',
    displayName: 'Alex Thompson',
    bio: 'Smart Contract Developer and Security Auditor. Making DeFi safer.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    website: 'https://alexthompson.security',
    twitter: '@alex_security',
    linkedin: 'alex-thompson-security',
    reputationScore: '8900',
    totalSkills: 10,
    totalEndorsements: 98,
    verifiedSkills: 8,
    lastActive: new Date(),
    joinedAt: new Date('2023-06-18'),
  }
]

// Sample skills with diverse categories
const sampleSkills = [
  // Sarah Chen's skills
  {
    id: nanoid(),
    userId: sampleUsers[0].id,
    walletAddress: sampleUsers[0].walletAddress,
    category: 'Frontend',
    name: 'React Development',
    description: 'Expert in building scalable React applications with modern hooks and state management.',
    evidence: {
      portfolio: ['https://sarahchen.dev/projects/react-dashboard', 'https://github.com/sarahchen/react-components'],
      certifications: ['React Advanced Certification'],
      testimonials: ['Built our entire frontend architecture - CTO at TechCorp']
    },
    tokenId: '1',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '5000',
    endorsementCount: 15,
    verified: true,
    status: 'verified'
  },
  {
    id: nanoid(),
    userId: sampleUsers[0].id,
    walletAddress: sampleUsers[0].walletAddress,
    category: 'Programming',
    name: 'TypeScript',
    description: 'Advanced TypeScript development with complex type systems and enterprise patterns.',
    evidence: {
      portfolio: ['https://github.com/sarahchen/typescript-utils'],
      certifications: ['TypeScript Expert Certification'],
      testimonials: ['TypeScript wizard who helped us migrate our entire codebase']
    },
    tokenId: '2',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '3500',
    endorsementCount: 12,
    verified: true,
    status: 'verified'
  },
  {
    id: nanoid(),
    userId: sampleUsers[0].id,
    walletAddress: sampleUsers[0].walletAddress,
    category: 'Backend',
    name: 'Node.js',
    description: 'Full-stack Node.js development with Express, NestJS, and microservices architecture.',
    evidence: {
      portfolio: ['https://github.com/sarahchen/node-microservices'],
      certifications: ['Node.js Professional Certification'],
      testimonials: ['Built our backend infrastructure from scratch']
    },
    tokenId: '3',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '4200',
    endorsementCount: 10,
    verified: true,
    status: 'verified'
  },
  
  // Mike Johnson's skills
  {
    id: nanoid(),
    userId: sampleUsers[1].id,
    walletAddress: sampleUsers[1].walletAddress,
    category: 'AI/ML',
    name: 'Machine Learning',
    description: 'Expert in ML algorithms, deep learning, and production ML systems.',
    evidence: {
      portfolio: ['https://github.com/mikejohnson/ml-models', 'https://kaggle.com/mikejohnson'],
      certifications: ['Google ML Engineering Certification', 'AWS ML Specialty'],
      testimonials: ['Increased our model accuracy by 15% and reduced inference time by 40%']
    },
    tokenId: '4',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '6000',
    endorsementCount: 18,
    verified: true,
    status: 'verified'
  },
  {
    id: nanoid(),
    userId: sampleUsers[1].id,
    walletAddress: sampleUsers[1].walletAddress,
    category: 'Programming',
    name: 'Python',
    description: 'Advanced Python development for data science, web development, and automation.',
    evidence: {
      portfolio: ['https://github.com/mikejohnson/python-tools'],
      certifications: ['Python Institute PCEP'],
      testimonials: ['Python expert who optimized our data pipeline']
    },
    tokenId: '5',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '4800',
    endorsementCount: 15,
    verified: true,
    status: 'verified'
  },
  
  // Emma Wilson's skills
  {
    id: nanoid(),
    userId: sampleUsers[2].id,
    walletAddress: sampleUsers[2].walletAddress,
    category: 'Design',
    name: 'UI/UX Design',
    description: 'Expert in user experience design, prototyping, and design systems.',
    evidence: {
      portfolio: ['https://emmawilson.design/portfolio', 'https://dribbble.com/emmawilson'],
      certifications: ['Google UX Design Certificate', 'Adobe Certified Expert'],
      testimonials: ['Redesigned our entire product and increased user engagement by 50%']
    },
    tokenId: '6',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '5500',
    endorsementCount: 14,
    verified: true,
    status: 'verified'
  },
  {
    id: nanoid(),
    userId: sampleUsers[2].id,
    walletAddress: sampleUsers[2].walletAddress,
    category: 'Design',
    name: 'Figma',
    description: 'Advanced Figma skills including component systems, auto-layout, and team collaboration.',
    evidence: {
      portfolio: ['https://figma.com/@emmawilson/files'],
      certifications: ['Figma Professional Certification'],
      testimonials: ['Created our entire design system in Figma']
    },
    tokenId: '7',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '3200',
    endorsementCount: 11,
    verified: true,
    status: 'verified'
  },
  
  // David Kim's skills
  {
    id: nanoid(),
    userId: sampleUsers[3].id,
    walletAddress: sampleUsers[3].walletAddress,
    category: 'DevOps',
    name: 'Docker',
    description: 'Containerization expert with Docker and Kubernetes for scalable deployments.',
    evidence: {
      portfolio: ['https://github.com/davidkim/docker-configs'],
      certifications: ['Docker Certified Associate', 'CKA Kubernetes'],
      testimonials: ['Containerized our entire infrastructure and improved deployment speed by 10x']
    },
    tokenId: '8',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '4000',
    endorsementCount: 13,
    verified: true,
    status: 'verified'
  },
  {
    id: nanoid(),
    userId: sampleUsers[3].id,
    walletAddress: sampleUsers[3].walletAddress,
    category: 'Cloud',
    name: 'AWS',
    description: 'AWS cloud architecture and infrastructure management expert.',
    evidence: {
      portfolio: ['https://github.com/davidkim/aws-templates'],
      certifications: ['AWS Solutions Architect Professional', 'AWS DevOps Engineer'],
      testimonials: ['Migrated our infrastructure to AWS and reduced costs by 40%']
    },
    tokenId: '9',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '5200',
    endorsementCount: 16,
    verified: true,
    status: 'verified'
  },
  
  // Lisa Rodriguez's skills
  {
    id: nanoid(),
    userId: sampleUsers[4].id,
    walletAddress: sampleUsers[4].walletAddress,
    category: 'Product',
    name: 'Product Management',
    description: 'Expert in product strategy, roadmap planning, and cross-functional team leadership.',
    evidence: {
      portfolio: ['https://lisarodriguez.pm/case-studies'],
      certifications: ['Certified Product Manager', 'Agile Product Management'],
      testimonials: ['Launched 3 successful products that generated $2M+ revenue']
    },
    tokenId: '10',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '4500',
    endorsementCount: 12,
    verified: true,
    status: 'verified'
  },
  
  // Alex Thompson's skills
  {
    id: nanoid(),
    userId: sampleUsers[5].id,
    walletAddress: sampleUsers[5].walletAddress,
    category: 'Blockchain',
    name: 'Solidity',
    description: 'Smart contract development and security auditing with Solidity.',
    evidence: {
      portfolio: ['https://github.com/alexthompson/smart-contracts'],
      certifications: ['Certified Ethereum Developer', 'Smart Contract Security'],
      testimonials: ['Audited 50+ smart contracts and found critical vulnerabilities']
    },
    tokenId: '11',
    contractAddress: '0xSkillNFTContract',
    totalStaked: '7000',
    endorsementCount: 9,
    verified: true,
    status: 'verified'
  }
]

// Sample endorsements
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Insert users
    console.log('👥 Inserting users...')
    await db.insert(userProfiles).values(sampleUsers)
    
    // Insert skills
    console.log('🎯 Inserting skills...')
    await db.insert(skills).values(sampleSkills)
    
    // Create cross-endorsements (users endorsing each other's skills)
    console.log('🤝 Creating endorsements...')
    const endorsementData = []
    
    // Sarah endorses Mike's ML skill
    endorsementData.push({
      id: nanoid(),
      skillId: sampleSkills.find(s => s.name === 'Machine Learning')!.id,
      endorserId: sampleUsers[0].id,
      endorserWallet: sampleUsers[0].walletAddress,
      stakedAmount: '1000',
      evidence: 'Worked with Mike on an AI project. His ML expertise is exceptional.',
      transactionHash: '0xendorsement1',
      blockNumber: 18500001,
      active: true
    })
    
    // Mike endorses Sarah's React skill
    endorsementData.push({
      id: nanoid(),
      skillId: sampleSkills.find(s => s.name === 'React Development')!.id,
      endorserId: sampleUsers[1].id,
      endorserWallet: sampleUsers[1].walletAddress,
      stakedAmount: '1500',
      evidence: 'Sarah built an amazing React dashboard for our team. Top-tier skills.',
      transactionHash: '0xendorsement2',
      blockNumber: 18500002,
      active: true
    })
    
    // Emma endorses Sarah's TypeScript skill
    endorsementData.push({
      id: nanoid(),
      skillId: sampleSkills.find(s => s.name === 'TypeScript')!.id,
      endorserId: sampleUsers[2].id,
      endorserWallet: sampleUsers[2].walletAddress,
      stakedAmount: '800',
      evidence: 'Sarah helped us implement complex TypeScript patterns. Highly skilled.',
      transactionHash: '0xendorsement3',
      blockNumber: 18500003,
      active: true
    })
    
    // David endorses Emma's UI/UX skill
    endorsementData.push({
      id: nanoid(),
      skillId: sampleSkills.find(s => s.name === 'UI/UX Design')!.id,
      endorserId: sampleUsers[3].id,
      endorserWallet: sampleUsers[3].walletAddress,
      stakedAmount: '1200',
      evidence: 'Emma redesigned our entire user interface. Outstanding design skills.',
      transactionHash: '0xendorsement4',
      blockNumber: 18500004,
      active: true
    })
    
    // Add more cross-endorsements
    for (let i = 0; i < 20; i++) {
      const randomSkill = sampleSkills[Math.floor(Math.random() * sampleSkills.length)]
      const randomEndorser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)]
      
      // Don't let users endorse their own skills
      if (randomSkill.userId !== randomEndorser.id) {
        endorsementData.push({
          id: nanoid(),
          skillId: randomSkill.id,
          endorserId: randomEndorser.id,
          endorserWallet: randomEndorser.walletAddress,
          stakedAmount: (Math.random() * 2000 + 500).toString(),
          evidence: `I've worked with this person and can vouch for their ${randomSkill.name} skills.`,
          transactionHash: `0xendorsement${Date.now()}${i}`,
          blockNumber: 18500000 + i,
          active: true
        })
      }
    }
    
    await db.insert(endorsements).values(endorsementData)
    
    console.log('✅ Database seeding completed successfully!')
    console.log(`📊 Inserted:`)
    console.log(`   - ${sampleUsers.length} users`)
    console.log(`   - ${sampleSkills.length} skills`) 
    console.log(`   - ${endorsementData.length} endorsements`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} 