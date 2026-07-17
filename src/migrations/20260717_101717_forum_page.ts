import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_forum_challenge" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'ПМЭФ · Кавказский инвестиционный форум',
  	"heading" varchar DEFAULT 'Вызов Локомотива',
  	"intro" varchar,
  	"show_slides" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_forum_challenge" ADD CONSTRAINT "pages_blocks_forum_challenge_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_forum_challenge_order_idx" ON "pages_blocks_forum_challenge" USING btree ("_order");
  CREATE INDEX "pages_blocks_forum_challenge_parent_id_idx" ON "pages_blocks_forum_challenge" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_forum_challenge_path_idx" ON "pages_blocks_forum_challenge" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_forum_challenge" CASCADE;`)
}
