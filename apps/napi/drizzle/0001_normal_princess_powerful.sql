DO $$ BEGIN
 CREATE TYPE "public"."creation_method" AS ENUM('email-password', 'social', 'email-only');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reset_password_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"token" uuid DEFAULT gen_random_uuid(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '1 day' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "user_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "creation_method" "creation_method" DEFAULT 'email-password' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reset_password_token" ADD CONSTRAINT "reset_password_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_id";