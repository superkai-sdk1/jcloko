import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_navigation_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_news_eyebrow" varchar DEFAULT 'Жизнь клуба';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_news_title" varchar DEFAULT 'Новости';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_news_subtitle" varchar DEFAULT 'Соревнования, сборы, достижения и анонсы.';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_schedule_eyebrow" varchar DEFAULT 'Тренировки';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_schedule_title" varchar DEFAULT 'Расписание';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_schedule_subtitle" varchar DEFAULT 'Занятия по возрастам и уровням подготовки.';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_coaches_eyebrow" varchar DEFAULT 'Команда';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_coaches_title" varchar DEFAULT 'Тренеры';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_coaches_subtitle" varchar DEFAULT 'Тренерский состав клуба дзюдо «Локомотив».';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_media_eyebrow" varchar DEFAULT 'Галерея';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_media_title" varchar DEFAULT 'Медиа';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_media_subtitle" varchar DEFAULT 'Фотографии, фильмы и интервью клуба.';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_partners_eyebrow" varchar DEFAULT 'Поддержка';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_partners_title" varchar DEFAULT 'Партнёры';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_partners_subtitle" varchar DEFAULT 'Компании и организации, которые помогают клубу.';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_contacts_eyebrow" varchar DEFAULT 'Свяжитесь с нами';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_contacts_title" varchar DEFAULT 'Контакты';
  ALTER TABLE "site_settings" ADD COLUMN "page_headers_contacts_subtitle" varchar DEFAULT 'Запишитесь на первую тренировку или задайте вопрос.';
  ALTER TABLE "site_settings" ADD COLUMN "footer_links_heading" varchar DEFAULT 'Разделы';
  ALTER TABLE "site_settings" ADD COLUMN "footer_contacts_heading" varchar DEFAULT 'Контакты';
  ALTER TABLE "site_settings" ADD COLUMN "footer_rights_text" varchar DEFAULT 'Все права защищены.';
  ALTER TABLE "site_settings_navigation_children" ADD CONSTRAINT "site_settings_navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_navigation_children_order_idx" ON "site_settings_navigation_children" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_children_parent_id_idx" ON "site_settings_navigation_children" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_navigation_children" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_news_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_news_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_news_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_schedule_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_schedule_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_schedule_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_coaches_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_coaches_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_coaches_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_media_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_media_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_media_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_partners_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_partners_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_partners_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_contacts_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_contacts_title";
  ALTER TABLE "site_settings" DROP COLUMN "page_headers_contacts_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "footer_links_heading";
  ALTER TABLE "site_settings" DROP COLUMN "footer_contacts_heading";
  ALTER TABLE "site_settings" DROP COLUMN "footer_rights_text";`)
}
