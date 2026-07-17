import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" ADD COLUMN "page_logo_id" integer;
  ALTER TABLE "partners" ADD COLUMN "description" varchar;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_page_logo_id_media_id_fk" FOREIGN KEY ("page_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_page_logo_idx" ON "partners" USING btree ("page_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP CONSTRAINT "partners_page_logo_id_media_id_fk";
  
  DROP INDEX "partners_page_logo_idx";
  ALTER TABLE "partners" DROP COLUMN "page_logo_id";
  ALTER TABLE "partners" DROP COLUMN "description";`)
}
