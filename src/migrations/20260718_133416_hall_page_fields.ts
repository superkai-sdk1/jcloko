import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "halls" ADD COLUMN "description" varchar;
  ALTER TABLE "halls" ADD COLUMN "phone" varchar;
  ALTER TABLE "halls" ADD COLUMN "photo_id" integer;
  ALTER TABLE "halls" ADD COLUMN "coach_id" integer;
  ALTER TABLE "halls" ADD CONSTRAINT "halls_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "halls" ADD CONSTRAINT "halls_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "halls_photo_idx" ON "halls" USING btree ("photo_id");
  CREATE INDEX "halls_coach_idx" ON "halls" USING btree ("coach_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "halls" DROP CONSTRAINT "halls_photo_id_media_id_fk";
  
  ALTER TABLE "halls" DROP CONSTRAINT "halls_coach_id_coaches_id_fk";
  
  DROP INDEX "halls_photo_idx";
  DROP INDEX "halls_coach_idx";
  ALTER TABLE "halls" DROP COLUMN "description";
  ALTER TABLE "halls" DROP COLUMN "phone";
  ALTER TABLE "halls" DROP COLUMN "photo_id";
  ALTER TABLE "halls" DROP COLUMN "coach_id";`)
}
