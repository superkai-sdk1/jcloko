import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "halls" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar,
  	"address" varchar NOT NULL,
  	"note" varchar,
  	"map_x" numeric,
  	"map_y" numeric,
  	"display_order" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "schedule_entries" ADD COLUMN "hall_link_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "halls_id" integer;
  CREATE UNIQUE INDEX "halls_slug_idx" ON "halls" USING btree ("slug");
  CREATE INDEX "halls_updated_at_idx" ON "halls" USING btree ("updated_at");
  CREATE INDEX "halls_created_at_idx" ON "halls" USING btree ("created_at");
  ALTER TABLE "schedule_entries" ADD CONSTRAINT "schedule_entries_hall_link_id_halls_id_fk" FOREIGN KEY ("hall_link_id") REFERENCES "public"."halls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_halls_fk" FOREIGN KEY ("halls_id") REFERENCES "public"."halls"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "schedule_entries_hall_link_idx" ON "schedule_entries" USING btree ("hall_link_id");
  CREATE INDEX "payload_locked_documents_rels_halls_id_idx" ON "payload_locked_documents_rels" USING btree ("halls_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "halls" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "halls" CASCADE;
  ALTER TABLE "schedule_entries" DROP CONSTRAINT "schedule_entries_hall_link_id_halls_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_halls_fk";
  
  DROP INDEX "schedule_entries_hall_link_idx";
  DROP INDEX "payload_locked_documents_rels_halls_id_idx";
  ALTER TABLE "schedule_entries" DROP COLUMN "hall_link_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "halls_id";`)
}
