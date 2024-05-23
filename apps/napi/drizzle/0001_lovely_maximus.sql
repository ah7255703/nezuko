DO $$ BEGIN
 CREATE TYPE "public"."member_role" AS ENUM('admin', 'dev');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "userOrganizations" RENAME TO "org_members";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "org_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."org"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
