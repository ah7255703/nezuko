CREATE TABLE IF NOT EXISTS "verify_email_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"token" uuid DEFAULT gen_random_uuid(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '1 day' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verify_email_token" ADD CONSTRAINT "verify_email_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
