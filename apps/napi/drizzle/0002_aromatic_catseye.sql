ALTER TABLE "project" ADD COLUMN "schema_version" varchar(10) DEFAULT '1.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "schema" jsonb DEFAULT '{}'::jsonb NOT NULL;