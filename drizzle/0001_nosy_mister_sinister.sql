CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event" text NOT NULL,
	"properties" jsonb,
	"page" text,
	"referrer" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_analytics_event" ON "analytics_events" USING btree ("event");--> statement-breakpoint
CREATE INDEX "idx_analytics_created_at" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_analytics_page" ON "analytics_events" USING btree ("page");