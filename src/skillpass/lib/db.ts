import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { sendMail } from "./email"

/* ---------- Types ---------- */

export interface Skill {
  id: string
  userId: string
  name: string
  description: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  endorsements: Endorsement[]
  totalStaked: number
  reputationScore: number
  created: string
  updated: string
}

export interface Endorsement {
  id: string
  skillId: string
  endorserId: string
  endorserAddress: string
  endorserName?: string
  stakeAmount: number
  stakeCurrency: string
  transactionHash: string
  message?: string
  created: string
}

export interface UserProfile {
  userId: string
  address: string
  displayName?: string
  bio?: string
  avatar?: string
  totalReputationScore: number
  skillsCount: number
  endorsementsReceived: number
  endorsementsGiven: number
  created: string
  updated: string
}

/* ---------- File helpers ---------- */

const dataDir = path.join(process.cwd(), "data")
const skillsFile = path.join(dataDir, "skills.json")
const endorsementsFile = path.join(dataDir, "endorsements.json")
const profilesFile = path.join(dataDir, "profiles.json")

async function ensureSkillsFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(skillsFile)
  } catch {
    await fs.writeFile(skillsFile, "[]")
  }
}

async function ensureEndorsementsFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(endorsementsFile)
  } catch {
    await fs.writeFile(endorsementsFile, "[]")
  }
}

async function ensureProfilesFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(profilesFile)
  } catch {
    await fs.writeFile(profilesFile, "[]")
  }
}

async function readSkills(): Promise<Skill[]> {
  await ensureSkillsFile()
  const raw = await fs.readFile(skillsFile, "utf8")
  return JSON.parse(raw) as Skill[]
}

async function writeSkills(skills: Skill[]) {
  await fs.writeFile(skillsFile, JSON.stringify(skills, null, 2))
}

async function readEndorsements(): Promise<Endorsement[]> {
  await ensureEndorsementsFile()
  const raw = await fs.readFile(endorsementsFile, "utf8")
  return JSON.parse(raw) as Endorsement[]
}

async function writeEndorsements(endorsements: Endorsement[]) {
  await fs.writeFile(endorsementsFile, JSON.stringify(endorsements, null, 2))
}

async function readProfiles(): Promise<UserProfile[]> {
  await ensureProfilesFile()
  const raw = await fs.readFile(profilesFile, "utf8")
  return JSON.parse(raw) as UserProfile[]
}

async function writeProfiles(profiles: UserProfile[]) {
  await fs.writeFile(profilesFile, JSON.stringify(profiles, null, 2))
}

/* ---------- Skills CRUD ---------- */

export async function getSkillsByUser(userId: string): Promise<Skill[]> {
  const skills = await readSkills()
  const endorsements = await readEndorsements()
  
  return skills
    .filter((s) => s.userId === userId)
    .map((skill) => ({
      ...skill,
      endorsements: endorsements.filter((e) => e.skillId === skill.id),
    }))
}

export async function getSkill(userId: string, id: string): Promise<Skill | undefined> {
  const skills = await readSkills()
  const endorsements = await readEndorsements()
  
  const skill = skills.find((s) => s.userId === userId && s.id === id)
  if (!skill) return undefined
  
  return {
    ...skill,
    endorsements: endorsements.filter((e) => e.skillId === skill.id),
  }
}

export async function addSkill(
  userId: string,
  payload: {
    name: string
    description: string
    category: string
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  },
): Promise<Skill> {
  const skills = await readSkills()
  const id = randomUUID()
  const created = new Date().toISOString()

  const newSkill: Skill = {
    id,
    userId,
    name: payload.name,
    description: payload.description,
    category: payload.category,
    level: payload.level,
    endorsements: [],
    totalStaked: 0,
    reputationScore: 0,
    created,
    updated: created,
  }

  skills.push(newSkill)
  await writeSkills(skills)
  return newSkill
}

export async function updateSkill(
  userId: string,
  id: string,
  patch: Partial<Omit<Skill, "id" | "created" | "userId" | "endorsements" | "totalStaked" | "reputationScore">>,
): Promise<Skill | undefined> {
  const skills = await readSkills()
  const index = skills.findIndex((s) => s.userId === userId && s.id === id)
  if (index === -1) return undefined

  skills[index] = {
    ...skills[index],
    ...patch,
    updated: new Date().toISOString(),
  }

  await writeSkills(skills)
  return skills[index]
}

export async function deleteSkill(userId: string, id: string): Promise<boolean> {
  const skills = await readSkills()
  const index = skills.findIndex((s) => s.userId === userId && s.id === id)
  if (index === -1) return false

  skills.splice(index, 1)
  await writeSkills(skills)
  
  // Also remove associated endorsements
  const endorsements = await readEndorsements()
  const filteredEndorsements = endorsements.filter((e) => e.skillId !== id)
  await writeEndorsements(filteredEndorsements)
  
  return true
}

/* ---------- Endorsements CRUD ---------- */

export async function addEndorsement(
  skillId: string,
  endorserId: string,
  payload: {
    endorserAddress: string
    endorserName?: string
    stakeAmount: number
    stakeCurrency: string
    transactionHash: string
    message?: string
  },
): Promise<Endorsement | null> {
  const skills = await readSkills()
  const endorsements = await readEndorsements()
  
  const skill = skills.find((s) => s.id === skillId)
  if (!skill) return null

  const id = randomUUID()
  const created = new Date().toISOString()

  const newEndorsement: Endorsement = {
    id,
    skillId,
    endorserId,
    endorserAddress: payload.endorserAddress,
    endorserName: payload.endorserName,
    stakeAmount: payload.stakeAmount,
    stakeCurrency: payload.stakeCurrency,
    transactionHash: payload.transactionHash,
    message: payload.message,
    created,
  }

  endorsements.push(newEndorsement)
  await writeEndorsements(endorsements)

  // Update skill's total staked and reputation score
  const skillIndex = skills.findIndex((s) => s.id === skillId)
  if (skillIndex !== -1) {
    skills[skillIndex].totalStaked += payload.stakeAmount
    skills[skillIndex].reputationScore = calculateReputationScore(skills[skillIndex], endorsements.filter(e => e.skillId === skillId))
    skills[skillIndex].updated = created
    await writeSkills(skills)
  }

  return newEndorsement
}

export async function getEndorsementsBySkill(skillId: string): Promise<Endorsement[]> {
  const endorsements = await readEndorsements()
  return endorsements.filter((e) => e.skillId === skillId)
}

/* ---------- User Profiles CRUD ---------- */

export async function getUserProfile(userId: string): Promise<UserProfile | undefined> {
  const profiles = await readProfiles()
  return profiles.find((p) => p.userId === userId)
}

export async function createOrUpdateProfile(
  userId: string,
  address: string,
  payload: {
    displayName?: string
    bio?: string
    avatar?: string
  },
): Promise<UserProfile> {
  const profiles = await readProfiles()
  const existingIndex = profiles.findIndex((p) => p.userId === userId)
  
  const skills = await getSkillsByUser(userId)
  const endorsements = await readEndorsements()
  
  const totalReputationScore = skills.reduce((sum, skill) => sum + skill.reputationScore, 0)
  const endorsementsReceived = endorsements.filter(e => 
    skills.some(s => s.id === e.skillId)
  ).length
  const endorsementsGiven = endorsements.filter(e => e.endorserId === userId).length

  const profileData: UserProfile = {
    userId,
    address,
    displayName: payload.displayName,
    bio: payload.bio,
    avatar: payload.avatar,
    totalReputationScore,
    skillsCount: skills.length,
    endorsementsReceived,
    endorsementsGiven,
    created: existingIndex !== -1 ? profiles[existingIndex].created : new Date().toISOString(),
    updated: new Date().toISOString(),
  }

  if (existingIndex !== -1) {
    profiles[existingIndex] = profileData
  } else {
    profiles.push(profileData)
  }

  await writeProfiles(profiles)
  return profileData
}

/* ---------- Utility Functions ---------- */

function calculateReputationScore(skill: Skill, endorsements: Endorsement[]): number {
  if (endorsements.length === 0) return 0
  
  // Simple reputation algorithm: 
  // Base score from number of endorsements + weighted by stake amounts
  const baseScore = endorsements.length * 10
  const stakeScore = endorsements.reduce((sum, e) => sum + Math.log(e.stakeAmount + 1), 0)
  
  return Math.round(baseScore + stakeScore)
}

export async function getLeaderboard(category?: string, limit: number = 10): Promise<Skill[]> {
  const skills = await readSkills()
  const endorsements = await readEndorsements()
  
  let filteredSkills = skills
  if (category) {
    filteredSkills = skills.filter(s => s.category.toLowerCase() === category.toLowerCase())
  }
  
  // Add endorsements to skills
  const skillsWithEndorsements = filteredSkills.map(skill => ({
    ...skill,
    endorsements: endorsements.filter(e => e.skillId === skill.id)
  }))
  
  // Sort by reputation score
  return skillsWithEndorsements
    .sort((a, b) => b.reputationScore - a.reputationScore)
    .slice(0, limit)
}

// Legacy functions for backward compatibility (will be removed)
export async function getLinksByUser(userId: string): Promise<any[]> {
  return []
}

export async function getLink(userId: string, id: string): Promise<any> {
  return undefined
}

export async function addLink(userId: string, payload: any): Promise<any> {
  return null
}

export async function updateLink(userId: string, id: string, patch: any): Promise<any> {
  return undefined
}

export async function deleteLink(userId: string, id: string): Promise<boolean> {
  return false
}

export async function recordPayment(id: string, amount: number, currency: string, txHash: string): Promise<any> {
  return undefined
}