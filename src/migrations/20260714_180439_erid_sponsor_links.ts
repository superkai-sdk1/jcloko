import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_link_type" AS ENUM('external', 'internal', 'none');
  ALTER TABLE "news" ADD COLUMN "is_advertising" boolean DEFAULT false;
  ALTER TABLE "news" ADD COLUMN "erid" varchar;
  ALTER TABLE "news" ADD COLUMN "advertiser_info" varchar;
  ALTER TABLE "partners" ADD COLUMN "link_type" "enum_partners_link_type" DEFAULT 'external';
  ALTER TABLE "partners" ADD COLUMN "internal_page_id" integer;
  ALTER TABLE "partners" ADD COLUMN "erid" varchar;
  ALTER TABLE "partners" ADD COLUMN "advertiser_info" varchar;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_internal_page_id_pages_id_fk" FOREIGN KEY ("internal_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_internal_page_idx" ON "partners" USING btree ("internal_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP CONSTRAINT "partners_internal_page_id_pages_id_fk";
  
  DROP INDEX "partners_internal_page_idx";
  ALTER TABLE "news" DROP COLUMN "is_advertising";
  ALTER TABLE "news" DROP COLUMN "erid";
  ALTER TABLE "news" DROP COLUMN "advertiser_info";
  ALTER TABLE "partners" DROP COLUMN "link_type";
  ALTER TABLE "partners" DROP COLUMN "internal_page_id";
  ALTER TABLE "partners" DROP COLUMN "erid";
  ALTER TABLE "partners" DROP COLUMN "advertiser_info";
  DROP TYPE "public"."enum_partners_link_type";`)
}
