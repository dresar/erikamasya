CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_user_id" integer,
	"action" varchar(64) NOT NULL,
	"entity" varchar(64) NOT NULL,
	"entity_id" varchar(64),
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"subject" varchar(256) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"period_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"position" varchar(256) NOT NULL,
	"department" varchar(256),
	"photo_url" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" varchar(32) NOT NULL,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" varchar(512) NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(128) PRIMARY KEY NOT NULL,
	"value" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"position" varchar(256),
	"avatar_url" text,
	"avatar_initials" varchar(8),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "author_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "author_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "file_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "uploaded_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "uploaded_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "author_name" varchar(256);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "read_time" varchar(50);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "file_type" varchar(50);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "file_size" varchar(50);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "date" timestamp;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "uploaded_by" integer;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "nim" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "angkatan" varchar(16);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "jurusan" varchar(256);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "status" varchar(50) DEFAULT 'Aktif';--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_period_id_organization_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."organization_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_periods_period_unique" ON "organization_periods" USING btree ("period");--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_unique" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "members_nim_unique" ON "members" USING btree ("nim");--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "image";