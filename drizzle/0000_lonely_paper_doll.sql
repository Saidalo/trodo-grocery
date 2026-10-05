CREATE TYPE "public"."item_type" AS ENUM('REGULAR', 'PERISHABLE', 'CONSUMER');--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price_cents" integer NOT NULL,
	"type" "item_type" DEFAULT 'REGULAR' NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expiration_date" date,
	"keep_in_temperature" real,
	"picture_url" text,
	CONSTRAINT "price_not_negative" CHECK ("items"."price_cents" >= 0),
	CONSTRAINT "perishable_has_expiration" CHECK ("items"."type" <> 'PERISHABLE' OR "items"."expiration_date" IS NOT NULL)
);
