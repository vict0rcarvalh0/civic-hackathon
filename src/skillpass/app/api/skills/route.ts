import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// Temporary interface until we install drizzle-orm
interface Skill {
  id: string
  userId: string
  walletAddress: string
  category: string
  name: string
  description: string
  tokenId?: string
  contractAddress?: string
  blockNumber?: number
  transactionHash?: string
  ipfsHash?: string
  metadataUri?: string
  evidence?: any
  totalStaked: string
  endorsementCount: number
  verified: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}

// Temporary in-memory storage (replace with database when drizzle is installed)
const skills: Skill[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    
    let filteredSkills = skills

    if (userId) {
      filteredSkills = skills.filter(skill => skill.userId === userId)
    }

    if (category) {
      filteredSkills = filteredSkills.filter(skill => 
        skill.category.toLowerCase() === category.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      skills: filteredSkills
    })

  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      walletAddress, 
      category, 
      name, 
      description, 
      evidence,
      tokenId,
      contractAddress,
      transactionHash
    } = body

    // Validate required fields
    if (!userId || !walletAddress || !category || !name || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newSkill: Skill = {
      id: nanoid(),
      userId,
      walletAddress,
      category,
      name,
      description,
      evidence: evidence || [],
      tokenId,
      contractAddress,
      transactionHash,
      totalStaked: '0',
      endorsementCount: 0,
      verified: false,
      status: tokenId ? 'minted' : 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    skills.push(newSkill)

    // If minted, update IPFS metadata
    if (tokenId) {
      await updateIPFSMetadata(newSkill)
    }

    return NextResponse.json({
      success: true,
      skill: newSkill
    })

  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id, 
      tokenId, 
      contractAddress, 
      transactionHash, 
      blockNumber,
      totalStaked,
      endorsementCount,
      verified
    } = body

    const skillIndex = skills.findIndex(skill => skill.id === id)
    
    if (skillIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      )
    }

    // Update skill with blockchain data
    skills[skillIndex] = {
      ...skills[skillIndex],
      tokenId,
      contractAddress,
      transactionHash,
      blockNumber,
      totalStaked: totalStaked || skills[skillIndex].totalStaked,
      endorsementCount: endorsementCount || skills[skillIndex].endorsementCount,
      verified: verified !== undefined ? verified : skills[skillIndex].verified,
      status: tokenId ? 'minted' : skills[skillIndex].status,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      skill: skills[skillIndex]
    })

  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

async function updateIPFSMetadata(skill: Skill) {
  try {
    const metadata = {
      name: skill.name,
      description: skill.description,
      image: skill.evidence?.avatar || '',
      attributes: [
        {
          trait_type: 'Category',
          value: skill.category
        },
        {
          trait_type: 'Creator',
          value: skill.walletAddress
        },
        {
          trait_type: 'Total Staked',
          value: skill.totalStaked
        },
        {
          trait_type: 'Endorsements',
          value: skill.endorsementCount
        },
        {
          trait_type: 'Verified',
          value: skill.verified ? 'Yes' : 'No'
        }
      ],
      evidence: skill.evidence
    }

    // Upload to IPFS (implement IPFS upload logic)
    // const ipfsHash = await uploadToIPFS(metadata)
    // skill.ipfsHash = ipfsHash
    // skill.metadataUri = `ipfs://${ipfsHash}`

    console.log('Metadata prepared for IPFS:', metadata)
    
  } catch (error) {
    console.error('Error updating IPFS metadata:', error)
  }
} 