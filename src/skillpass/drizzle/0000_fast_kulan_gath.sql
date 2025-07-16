CREATE TABLE "blockchain_events" (
	"id" text PRIMARY KEY NOT NULL,
	"contract_address" text NOT NULL,
	"event_name" text NOT NULL,
	"block_number" integer NOT NULL,
	"transaction_hash" text NOT NULL,
	"event_data" jsonb NOT NULL,
	"processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_id" text,
	"challenger_id" text NOT NULL,
	"challenger_wallet" text NOT NULL,
	"reason" text NOT NULL,
	"evidence" jsonb,
	"transaction_hash" text,
	"block_number" integer,
	"challenge_end_time" timestamp,
	"resolved" boolean DEFAULT false,
	"skill_is_valid" boolean,
	"resolved_at" timestamp,
	"resolver_wallet" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "endorsements" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_id" text,
	"endorser_id" text NOT NULL,
	"endorser_wallet" text NOT NULL,
	"staked_amount" numeric(18, 0) NOT NULL,
	"evidence" text,
	"transaction_hash" text,
	"block_number" integer,
	"active" boolean DEFAULT true,
	"challenged" boolean DEFAULT false,
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ipfs_uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hash" text NOT NULL,
	"original_name" text,
	"mime_type" text,
	"size" integer,
	"purpose" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ipfs_uploads_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wallet_address" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"token_id" text,
	"contract_address" text,
	"block_number" integer,
	"transaction_hash" text,
	"ipfs_hash" text,
	"metadata_uri" text,
	"evidence" jsonb,
	"total_staked" numeric(18, 0) DEFAULT '0',
	"endorsement_count" integer DEFAULT 0,
	"verified" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "skills_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"display_name" text,
	"bio" text,
	"avatar" text,
	"website" text,
	"twitter" text,
	"linkedin" text,
	"reputation_score" numeric(18, 0) DEFAULT '0',
	"total_skills" integer DEFAULT 0,
	"total_endorsements" integer DEFAULT 0,
	"verified_skills" integer DEFAULT 0,
	"last_active" timestamp,
	"joined_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;