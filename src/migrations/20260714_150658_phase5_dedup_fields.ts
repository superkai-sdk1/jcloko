import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'crosspostVk';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'crosspostVk';
  ALTER TABLE "news" ADD COLUMN "duplicate_of_id" integer;
  ALTER TABLE "news" ADD COLUMN "similarity_score" numeric;
  ALTER TABLE "news" ADD COLUMN "image_hash" varchar;
  ALTER TABLE "news" ADD CONSTRAINT "news_duplicate_of_id_news_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "news_duplicate_of_idx" ON "news" USING btree ("duplicate_of_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DROP CONSTRAINT "news_duplicate_of_id_news_id_fk";
  
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'crosspostTelegram');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'crosspostTelegram');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "news_duplicate_of_idx";
  ALTER TABLE "news" DROP COLUMN "duplicate_of_id";
  ALTER TABLE "news" DROP COLUMN "similarity_score";
  ALTER TABLE "news" DROP COLUMN "image_hash";`)
}
