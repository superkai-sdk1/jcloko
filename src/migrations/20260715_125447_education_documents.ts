import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_education_program_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"k" varchar,
  	"v" varchar
  );
  
  CREATE TABLE "pages_blocks_education_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'О клубе',
  	"heading" varchar DEFAULT 'Образовательная деятельность',
  	"intro" varchar,
  	"program_file_id" integer,
  	"show_program_details" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "pages_blocks_education_program_meta" ADD CONSTRAINT "pages_blocks_education_program_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_education_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_education_program" ADD CONSTRAINT "pages_blocks_education_program_program_file_id_documents_id_fk" FOREIGN KEY ("program_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_education_program" ADD CONSTRAINT "pages_blocks_education_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_education_program_meta_order_idx" ON "pages_blocks_education_program_meta" USING btree ("_order");
  CREATE INDEX "pages_blocks_education_program_meta_parent_id_idx" ON "pages_blocks_education_program_meta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_education_program_order_idx" ON "pages_blocks_education_program" USING btree ("_order");
  CREATE INDEX "pages_blocks_education_program_parent_id_idx" ON "pages_blocks_education_program" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_education_program_path_idx" ON "pages_blocks_education_program" USING btree ("_path");
  CREATE INDEX "pages_blocks_education_program_program_file_idx" ON "pages_blocks_education_program" USING btree ("program_file_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_education_program_meta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_education_program" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_education_program_meta" CASCADE;
  DROP TABLE "pages_blocks_education_program" CASCADE;
  DROP TABLE "documents" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";`)
}
