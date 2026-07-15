import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_mission" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_statistics" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_timeline" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_rules_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_team_grid" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_schedule_table" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_partners_strip" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_video_embed" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq_accordion" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_contact_form" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_contact_form" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "ui_texts_empty_news" varchar DEFAULT 'Пока новостей нет.';
  ALTER TABLE "site_settings" ADD COLUMN "ui_texts_empty_media" varchar DEFAULT 'Материалы скоро появятся.';
  ALTER TABLE "site_settings" ADD COLUMN "ui_texts_empty_coaches" varchar DEFAULT 'Информация скоро появится.';
  ALTER TABLE "site_settings" ADD COLUMN "ui_texts_not_found_title" varchar DEFAULT 'Страница не найдена';
  ALTER TABLE "site_settings" ADD COLUMN "ui_texts_not_found_text" varchar DEFAULT 'Возможно, страница была перемещена или удалена. Вернитесь на главную или загляните в расписание тренировок.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_mission" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_statistics" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_timeline" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_rules_list" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_team_grid" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_schedule_table" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_partners_strip" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_video_embed" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_faq_accordion" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_contact_form" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_contact_form" DROP COLUMN "submit_label";
  ALTER TABLE "site_settings" DROP COLUMN "ui_texts_empty_news";
  ALTER TABLE "site_settings" DROP COLUMN "ui_texts_empty_media";
  ALTER TABLE "site_settings" DROP COLUMN "ui_texts_empty_coaches";
  ALTER TABLE "site_settings" DROP COLUMN "ui_texts_not_found_title";
  ALTER TABLE "site_settings" DROP COLUMN "ui_texts_not_found_text";`)
}
