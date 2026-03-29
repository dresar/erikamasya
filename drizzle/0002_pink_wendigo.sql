ALTER TABLE "members" ADD COLUMN "member_code" varchar(64);--> statement-breakpoint
UPDATE "members" SET "member_code" = 'MBR-' || "nim" WHERE "member_code" IS NULL;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "member_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "email" varchar(256);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "phone" varchar(64);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "place_of_birth" varchar(256);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "gender" varchar(32);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "joined_at" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "notes" text;--> statement-breakpoint
CREATE UNIQUE INDEX "members_member_code_unique" ON "members" USING btree ("member_code");
