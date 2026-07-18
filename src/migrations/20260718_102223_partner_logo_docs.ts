import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" ADD COLUMN "logo_light_id" integer;
  ALTER TABLE "documents" ADD COLUMN "description" varchar;
  ALTER TABLE "documents" ADD COLUMN "display_order" numeric DEFAULT 0;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_logo_light_idx" ON "partners" USING btree ("logo_light_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP CONSTRAINT "partners_logo_light_id_media_id_fk";
  
  DROP INDEX "partners_logo_light_idx";
  ALTER TABLE "partners" DROP COLUMN "logo_light_id";
  ALTER TABLE "documents" DROP COLUMN "description";
  ALTER TABLE "documents" DROP COLUMN "display_order";`)
}
