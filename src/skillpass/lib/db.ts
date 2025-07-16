import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { pgTable, text, integer, timestamp, boolean, jsonb, decimal } from 'drizzle-orm/pg-core'

const connectionString = process.env.DATABASE_URL!

// Skip transform DEV
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)

// Skills table
export const skills = pgTable('skills', {
  id: text('id').primaryKey(), // NFT token ID
  userId: text('user_id').notNull(),
  walletAddress: text('wallet_address').notNull(),
  category: text('category').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  
  // Blockchain data
  tokenId: text('token_id').unique(),
  contractAddress: text('contract_address'),
  blockNumber: integer('block_number'),
  transactionHash: text('transaction_hash'),
  
  // Metadata
  ipfsHash: text('ipfs_hash'),
  metadataUri: text('metadata_uri'),
  evidence: jsonb('evidence'), // Links, certificates, portfolio items
  
  // Metrics (cached from blockchain)
  totalStaked: decimal('total_staked', { precision: 18, scale: 0 }).default('0'),
  endorsementCount: integer('endorsement_count').default(0),
  verified: boolean('verified').default(false),
  
  // Status
  status: text('status').default('pending'), // pending, minted, challenged, verified
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Endorsements table
export const endorsements = pgTable('endorsements', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').references(() => skills.id),
  endorserId: text('endorser_id').notNull(),
  endorserWallet: text('endorser_wallet').notNull(),
  
  // Staking info
  stakedAmount: decimal('staked_amount', { precision: 18, scale: 0 }).notNull(),
  evidence: text('evidence'), // Why they're endorsing
  
  // Blockchain data
  transactionHash: text('transaction_hash'),
  blockNumber: integer('block_number'),
  
  // Status
  active: boolean('active').default(true),
  challenged: boolean('challenged').default(false),
  resolved: boolean('resolved').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey(),
  walletAddress: text('wallet_address').unique().notNull(),
  
  // Profile info
  displayName: text('display_name'),
  bio: text('bio'),
  avatar: text('avatar'),
  website: text('website'),
  twitter: text('twitter'),
  linkedin: text('linkedin'),
  
  // Reputation metrics (cached)
  reputationScore: decimal('reputation_score', { precision: 18, scale: 0 }).default('0'),
  totalSkills: integer('total_skills').default(0),
  totalEndorsements: integer('total_endorsements').default(0),
  verifiedSkills: integer('verified_skills').default(0),
  
  // Activity
  lastActive: timestamp('last_active'),
  joinedAt: timestamp('joined_at').defaultNow(),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Challenges table
export const challenges = pgTable('challenges', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').references(() => skills.id),
  challengerId: text('challenger_id').notNull(),
  challengerWallet: text('challenger_wallet').notNull(),
  
  reason: text('reason').notNull(),
  evidence: jsonb('evidence'), // Evidence why skill is invalid
  
  // Blockchain data
  transactionHash: text('transaction_hash'),
  blockNumber: integer('block_number'),
  challengeEndTime: timestamp('challenge_end_time'),
  
  // Resolution
  resolved: boolean('resolved').default(false),
  skillIsValid: boolean('skill_is_valid'),
  resolvedAt: timestamp('resolved_at'),
  resolverWallet: text('resolver_wallet'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Blockchain events table (for syncing)
export const blockchainEvents = pgTable('blockchain_events', {
  id: text('id').primaryKey(),
  contractAddress: text('contract_address').notNull(),
  eventName: text('event_name').notNull(),
  blockNumber: integer('block_number').notNull(),
  transactionHash: text('transaction_hash').notNull(),
  eventData: jsonb('event_data').notNull(),
  processed: boolean('processed').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
})

// IPFS uploads table
export const ipfsUploads = pgTable('ipfs_uploads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  hash: text('hash').unique().notNull(),
  originalName: text('original_name'),
  mimeType: text('mime_type'),
  size: integer('size'),
  purpose: text('purpose'), // skill-evidence, profile-avatar, etc.
  
  createdAt: timestamp('created_at').defaultNow(),
})

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type Endorsement = typeof endorsements.$inferSelect
export type NewEndorsement = typeof endorsements.$inferInsert
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
export type Challenge = typeof challenges.$inferSelect
export type NewChallenge = typeof challenges.$inferInsert