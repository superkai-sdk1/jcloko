import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_call_to_action_style" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_team_grid_mode" AS ENUM('coaches', 'athletes');
  CREATE TYPE "public"."enum_pages_blocks_video_embed_provider" AS ENUM('youtube', 'rutube', 'vk');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_sources_platform" AS ENUM('site', 'telegram', 'vk');
  CREATE TYPE "public"."enum_news_crosspost_targets_platform" AS ENUM('telegram', 'vk');
  CREATE TYPE "public"."enum_news_crosspost_targets_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  CREATE TYPE "public"."enum_news_merged_from_platform" AS ENUM('site', 'telegram', 'vk');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_origin_platform" AS ENUM('site', 'telegram', 'vk');
  CREATE TYPE "public"."enum_media_galleries_videos_provider" AS ENUM('youtube', 'rutube', 'vk');
  CREATE TYPE "public"."enum_media_galleries_kind" AS ENUM('photo', 'film', 'interview');
  CREATE TYPE "public"."enum_media_galleries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_schedule_entries_day_of_week" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_schedule_entries_level" AS ENUM('beginner', 'intermediate', 'advanced', 'all');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'coach');
  CREATE TYPE "public"."enum_social_post_queue_platform" AS ENUM('telegram', 'vk');
  CREATE TYPE "public"."enum_social_post_queue_status" AS ENUM('pending', 'processed', 'merged', 'discarded');
  CREATE TABLE "pages_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"heading" varchar,
  	"subheading" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" jsonb,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"style" "enum_pages_blocks_call_to_action_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_list_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"mode" "enum_pages_blocks_team_grid_mode" DEFAULT 'coaches',
  	"show_all" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_schedule_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"show_all" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"show_all" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"provider" "enum_pages_blocks_video_embed_provider",
  	"url" varchar NOT NULL,
  	"poster_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"recipient_email" varchar,
  	"consent_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"coaches_id" integer,
  	"athletes_id" integer,
  	"schedule_entries_id" integer,
  	"partners_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "news_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_news_sources_platform" NOT NULL,
  	"external_id" varchar,
  	"url" varchar,
  	"raw_payload" jsonb
  );
  
  CREATE TABLE "news_crosspost_targets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_news_crosspost_targets_platform" NOT NULL,
  	"status" "enum_news_crosspost_targets_status" DEFAULT 'pending',
  	"remote_url" varchar,
  	"error" varchar,
  	"attempts" numeric DEFAULT 0,
  	"last_attempt_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "news_merged_from" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_news_merged_from_platform",
  	"external_id" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_news_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"origin_platform" "enum_news_origin_platform" DEFAULT 'site',
  	"needs_review_duplicate" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media_galleries_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_media_galleries_videos_provider",
  	"url" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "media_galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"kind" "enum_media_galleries_kind" DEFAULT 'photo' NOT NULL,
  	"status" "enum_media_galleries_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media_galleries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "coaches_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "coaches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"rank" varchar,
  	"photo_id" integer,
  	"bio" jsonb,
  	"user_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "athletes_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "athletes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"birth_year" numeric,
  	"weight_category" varchar,
  	"rank" varchar,
  	"coach_id" integer,
  	"bio" jsonb,
  	"parental_consent_obtained" boolean DEFAULT false,
  	"parental_consent_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "schedule_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL,
  	"day_of_week" "enum_schedule_entries_day_of_week" NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar,
  	"coach_id" integer,
  	"hall" varchar,
  	"age_group" varchar,
  	"level" "enum_schedule_entries_level",
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"is_general_partner" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_post_queue" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_social_post_queue_platform" NOT NULL,
  	"external_id" varchar NOT NULL,
  	"received_at" timestamp(3) with time zone,
  	"raw_text" varchar,
  	"normalized_text" varchar,
  	"media_hashes" jsonb,
  	"url" varchar,
  	"raw_payload" jsonb,
  	"status" "enum_social_post_queue_status" DEFAULT 'pending',
  	"linked_news_post_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"club_name" varchar DEFAULT 'Клуб дзюдо «Локомотив»',
  	"tagline" varchar,
  	"logo_id" integer,
  	"contacts_phone" varchar,
  	"contacts_email" varchar,
  	"contacts_address" varchar,
  	"contacts_map_embed" varchar,
  	"socials_telegram" varchar,
  	"socials_vk" varchar,
  	"socials_youtube" varchar,
  	"socials_rutube" varchar,
  	"general_partner_id" integer,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"default_seo_og_image_id" integer,
  	"footer_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "integration_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"telegram_enabled" boolean DEFAULT false,
  	"telegram_bot_token" varchar,
  	"telegram_channel_id" varchar,
  	"telegram_crosspost_on_publish" boolean DEFAULT false,
  	"vk_enabled" boolean DEFAULT false,
  	"vk_access_token" varchar,
  	"vk_group_id" varchar,
  	"vk_confirmation_token" varchar,
  	"vk_crosspost_on_publish" boolean DEFAULT false,
  	"deduplication_enabled" boolean DEFAULT true,
  	"deduplication_time_window_minutes" numeric DEFAULT 30,
  	"deduplication_similarity_threshold" numeric DEFAULT 0.82,
  	"deduplication_review_lower_bound" numeric DEFAULT 0.5,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_galleries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "coaches_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "athletes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "schedule_entries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_post_queue_id" integer;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider" ADD CONSTRAINT "pages_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission" ADD CONSTRAINT "pages_blocks_mission_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission" ADD CONSTRAINT "pages_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics_stats" ADD CONSTRAINT "pages_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_events" ADD CONSTRAINT "pages_blocks_timeline_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_list_rules" ADD CONSTRAINT "pages_blocks_rules_list_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rules_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_list" ADD CONSTRAINT "pages_blocks_rules_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule_table" ADD CONSTRAINT "pages_blocks_schedule_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_strip" ADD CONSTRAINT "pages_blocks_partners_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion_items" ADD CONSTRAINT "pages_blocks_faq_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion" ADD CONSTRAINT "pages_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_coaches_fk" FOREIGN KEY ("coaches_id") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_athletes_fk" FOREIGN KEY ("athletes_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_schedule_entries_fk" FOREIGN KEY ("schedule_entries_id") REFERENCES "public"."schedule_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_sources" ADD CONSTRAINT "news_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_crosspost_targets" ADD CONSTRAINT "news_crosspost_targets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_merged_from" ADD CONSTRAINT "news_merged_from_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_galleries_videos" ADD CONSTRAINT "media_galleries_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_galleries" ADD CONSTRAINT "media_galleries_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_galleries_rels" ADD CONSTRAINT "media_galleries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_galleries_rels" ADD CONSTRAINT "media_galleries_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coaches_specializations" ADD CONSTRAINT "coaches_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coaches" ADD CONSTRAINT "coaches_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coaches" ADD CONSTRAINT "coaches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "athletes_achievements" ADD CONSTRAINT "athletes_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "athletes" ADD CONSTRAINT "athletes_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "athletes" ADD CONSTRAINT "athletes_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_entries" ADD CONSTRAINT "schedule_entries_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_post_queue" ADD CONSTRAINT "social_post_queue_linked_news_post_id_news_id_fk" FOREIGN KEY ("linked_news_post_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_general_partner_id_partners_id_fk" FOREIGN KEY ("general_partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_slider_slides_order_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_slides_parent_id_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_slides_image_idx" ON "pages_blocks_hero_slider_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slider_order_idx" ON "pages_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_parent_id_idx" ON "pages_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_path_idx" ON "pages_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "pages_blocks_mission_order_idx" ON "pages_blocks_mission" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_parent_id_idx" ON "pages_blocks_mission" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_path_idx" ON "pages_blocks_mission" USING btree ("_path");
  CREATE INDEX "pages_blocks_mission_image_idx" ON "pages_blocks_mission" USING btree ("image_id");
  CREATE INDEX "pages_blocks_statistics_stats_order_idx" ON "pages_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_stats_parent_id_idx" ON "pages_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_events_order_idx" ON "pages_blocks_timeline_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_events_parent_id_idx" ON "pages_blocks_timeline_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_rules_list_rules_order_idx" ON "pages_blocks_rules_list_rules" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_list_rules_parent_id_idx" ON "pages_blocks_rules_list_rules" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_list_order_idx" ON "pages_blocks_rules_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_list_parent_id_idx" ON "pages_blocks_rules_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_list_path_idx" ON "pages_blocks_rules_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_schedule_table_order_idx" ON "pages_blocks_schedule_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_table_parent_id_idx" ON "pages_blocks_schedule_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_table_path_idx" ON "pages_blocks_schedule_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_partners_strip_order_idx" ON "pages_blocks_partners_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_strip_parent_id_idx" ON "pages_blocks_partners_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_strip_path_idx" ON "pages_blocks_partners_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_poster_idx" ON "pages_blocks_video_embed" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_faq_accordion_items_order_idx" ON "pages_blocks_faq_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_items_parent_id_idx" ON "pages_blocks_faq_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_order_idx" ON "pages_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_parent_id_idx" ON "pages_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_path_idx" ON "pages_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_og_image_idx" ON "pages" USING btree ("og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_coaches_id_idx" ON "pages_rels" USING btree ("coaches_id");
  CREATE INDEX "pages_rels_athletes_id_idx" ON "pages_rels" USING btree ("athletes_id");
  CREATE INDEX "pages_rels_schedule_entries_id_idx" ON "pages_rels" USING btree ("schedule_entries_id");
  CREATE INDEX "pages_rels_partners_id_idx" ON "pages_rels" USING btree ("partners_id");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "news_sources_order_idx" ON "news_sources" USING btree ("_order");
  CREATE INDEX "news_sources_parent_id_idx" ON "news_sources" USING btree ("_parent_id");
  CREATE INDEX "news_crosspost_targets_order_idx" ON "news_crosspost_targets" USING btree ("_order");
  CREATE INDEX "news_crosspost_targets_parent_id_idx" ON "news_crosspost_targets" USING btree ("_parent_id");
  CREATE INDEX "news_merged_from_order_idx" ON "news_merged_from" USING btree ("_order");
  CREATE INDEX "news_merged_from_parent_id_idx" ON "news_merged_from" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_hero_image_idx" ON "news" USING btree ("hero_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "media_galleries_videos_order_idx" ON "media_galleries_videos" USING btree ("_order");
  CREATE INDEX "media_galleries_videos_parent_id_idx" ON "media_galleries_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "media_galleries_slug_idx" ON "media_galleries" USING btree ("slug");
  CREATE INDEX "media_galleries_cover_image_idx" ON "media_galleries" USING btree ("cover_image_id");
  CREATE INDEX "media_galleries_updated_at_idx" ON "media_galleries" USING btree ("updated_at");
  CREATE INDEX "media_galleries_created_at_idx" ON "media_galleries" USING btree ("created_at");
  CREATE INDEX "media_galleries_rels_order_idx" ON "media_galleries_rels" USING btree ("order");
  CREATE INDEX "media_galleries_rels_parent_idx" ON "media_galleries_rels" USING btree ("parent_id");
  CREATE INDEX "media_galleries_rels_path_idx" ON "media_galleries_rels" USING btree ("path");
  CREATE INDEX "media_galleries_rels_media_id_idx" ON "media_galleries_rels" USING btree ("media_id");
  CREATE INDEX "coaches_specializations_order_idx" ON "coaches_specializations" USING btree ("_order");
  CREATE INDEX "coaches_specializations_parent_id_idx" ON "coaches_specializations" USING btree ("_parent_id");
  CREATE INDEX "coaches_photo_idx" ON "coaches" USING btree ("photo_id");
  CREATE INDEX "coaches_user_idx" ON "coaches" USING btree ("user_id");
  CREATE INDEX "coaches_updated_at_idx" ON "coaches" USING btree ("updated_at");
  CREATE INDEX "coaches_created_at_idx" ON "coaches" USING btree ("created_at");
  CREATE INDEX "athletes_achievements_order_idx" ON "athletes_achievements" USING btree ("_order");
  CREATE INDEX "athletes_achievements_parent_id_idx" ON "athletes_achievements" USING btree ("_parent_id");
  CREATE INDEX "athletes_photo_idx" ON "athletes" USING btree ("photo_id");
  CREATE INDEX "athletes_coach_idx" ON "athletes" USING btree ("coach_id");
  CREATE INDEX "athletes_updated_at_idx" ON "athletes" USING btree ("updated_at");
  CREATE INDEX "athletes_created_at_idx" ON "athletes" USING btree ("created_at");
  CREATE INDEX "schedule_entries_coach_idx" ON "schedule_entries" USING btree ("coach_id");
  CREATE INDEX "schedule_entries_updated_at_idx" ON "schedule_entries" USING btree ("updated_at");
  CREATE INDEX "schedule_entries_created_at_idx" ON "schedule_entries" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "social_post_queue_external_id_idx" ON "social_post_queue" USING btree ("external_id");
  CREATE INDEX "social_post_queue_linked_news_post_idx" ON "social_post_queue" USING btree ("linked_news_post_id");
  CREATE INDEX "social_post_queue_updated_at_idx" ON "social_post_queue" USING btree ("updated_at");
  CREATE INDEX "social_post_queue_created_at_idx" ON "social_post_queue" USING btree ("created_at");
  CREATE UNIQUE INDEX "platform_externalId_idx" ON "social_post_queue" USING btree ("platform","external_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_general_partner_idx" ON "site_settings" USING btree ("general_partner_id");
  CREATE INDEX "site_settings_default_seo_default_seo_og_image_idx" ON "site_settings" USING btree ("default_seo_og_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_galleries_fk" FOREIGN KEY ("media_galleries_id") REFERENCES "public"."media_galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coaches_fk" FOREIGN KEY ("coaches_id") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_athletes_fk" FOREIGN KEY ("athletes_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schedule_entries_fk" FOREIGN KEY ("schedule_entries_id") REFERENCES "public"."schedule_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_post_queue_fk" FOREIGN KEY ("social_post_queue_id") REFERENCES "public"."social_post_queue"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_media_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("media_galleries_id");
  CREATE INDEX "payload_locked_documents_rels_coaches_id_idx" ON "payload_locked_documents_rels" USING btree ("coaches_id");
  CREATE INDEX "payload_locked_documents_rels_athletes_id_idx" ON "payload_locked_documents_rels" USING btree ("athletes_id");
  CREATE INDEX "payload_locked_documents_rels_schedule_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("schedule_entries_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_social_post_queue_id_idx" ON "payload_locked_documents_rels" USING btree ("social_post_queue_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_slider_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statistics_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rules_list_rules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rules_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schedule_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partners_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_accordion_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_crosspost_targets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_merged_from" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_galleries_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_galleries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_galleries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coaches_specializations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coaches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "athletes_achievements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "athletes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "schedule_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_post_queue" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "integration_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slider" CASCADE;
  DROP TABLE "pages_blocks_mission" CASCADE;
  DROP TABLE "pages_blocks_statistics_stats" CASCADE;
  DROP TABLE "pages_blocks_statistics" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages_blocks_timeline_events" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_rules_list_rules" CASCADE;
  DROP TABLE "pages_blocks_rules_list" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TABLE "pages_blocks_schedule_table" CASCADE;
  DROP TABLE "pages_blocks_partners_strip" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "news_sources" CASCADE;
  DROP TABLE "news_crosspost_targets" CASCADE;
  DROP TABLE "news_merged_from" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "media_galleries_videos" CASCADE;
  DROP TABLE "media_galleries" CASCADE;
  DROP TABLE "media_galleries_rels" CASCADE;
  DROP TABLE "coaches_specializations" CASCADE;
  DROP TABLE "coaches" CASCADE;
  DROP TABLE "athletes_achievements" CASCADE;
  DROP TABLE "athletes" CASCADE;
  DROP TABLE "schedule_entries" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "social_post_queue" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "integration_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_galleries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_coaches_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_athletes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_schedule_entries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_post_queue_fk";
  
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_hero_sizes_hero_filename_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  DROP INDEX "payload_locked_documents_rels_media_galleries_id_idx";
  DROP INDEX "payload_locked_documents_rels_coaches_id_idx";
  DROP INDEX "payload_locked_documents_rels_athletes_id_idx";
  DROP INDEX "payload_locked_documents_rels_schedule_entries_id_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "payload_locked_documents_rels_social_post_queue_id_idx";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_url";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_width";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_height";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filename";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_galleries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "coaches_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "athletes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "schedule_entries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_post_queue_id";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_style";
  DROP TYPE "public"."enum_pages_blocks_team_grid_mode";
  DROP TYPE "public"."enum_pages_blocks_video_embed_provider";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_news_sources_platform";
  DROP TYPE "public"."enum_news_crosspost_targets_platform";
  DROP TYPE "public"."enum_news_crosspost_targets_status";
  DROP TYPE "public"."enum_news_merged_from_platform";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum_news_origin_platform";
  DROP TYPE "public"."enum_media_galleries_videos_provider";
  DROP TYPE "public"."enum_media_galleries_kind";
  DROP TYPE "public"."enum_media_galleries_status";
  DROP TYPE "public"."enum_schedule_entries_day_of_week";
  DROP TYPE "public"."enum_schedule_entries_level";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_social_post_queue_platform";
  DROP TYPE "public"."enum_social_post_queue_status";`)
}
