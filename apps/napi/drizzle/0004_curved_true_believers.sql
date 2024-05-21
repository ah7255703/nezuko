ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reset_password_token" DROP CONSTRAINT "reset_password_token_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "verify_email_token" DROP CONSTRAINT "verify_email_token_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reset_password_token" ADD CONSTRAINT "reset_password_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verify_email_token" ADD CONSTRAINT "verify_email_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
