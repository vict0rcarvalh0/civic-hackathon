CREATE TABLE "investments" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_id" text NOT NULL,
	"investor_id" text NOT NULL,
	"investor_wallet" text NOT NULL,
	"investment_amount" numeric(18, 2) NOT NULL,
	"expected_monthly_yield" numeric(18, 2),
	"current_apy" numeric(5, 2),
	"total_yield_earned" numeric(18, 2) DEFAULT '0',
	"total_yield_claimed" numeric(18, 2) DEFAULT '0',
	"pending_yield" numeric(18, 2) DEFAULT '0',
	"last_yield_claim" timestamp,
	"jobs_completed" integer DEFAULT 0,
	"monthly_job_revenue" numeric(18, 2) DEFAULT '0',
	"risk_score" integer DEFAULT 50,
	"transaction_hash" text,
	"block_number" integer,
	"status" text DEFAULT 'active',
	"investment_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;