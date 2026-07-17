import * as migration_20260714_101024_initial from './20260714_101024_initial';
import * as migration_20260714_103528_phase1_data_model from './20260714_103528_phase1_data_model';
import * as migration_20260714_135258_phase2_form_submissions from './20260714_135258_phase2_form_submissions';
import * as migration_20260714_142554_phase3_jobs_queue from './20260714_142554_phase3_jobs_queue';
import * as migration_20260714_150658_phase5_dedup_fields from './20260714_150658_phase5_dedup_fields';
import * as migration_20260714_180439_erid_sponsor_links from './20260714_180439_erid_sponsor_links';
import * as migration_20260714_183258_videos_and_hero_video from './20260714_183258_videos_and_hero_video';
import * as migration_20260714_190557_media_alt_optional from './20260714_190557_media_alt_optional';
import * as migration_20260714_231842_latest_news_block from './20260714_231842_latest_news_block';
import * as migration_20260715_125447_education_documents from './20260715_125447_education_documents';
import * as migration_20260715_150332_nav_pageheaders_footer from './20260715_150332_nav_pageheaders_footer';
import * as migration_20260715_154714_ui_texts_and_eyebrows from './20260715_154714_ui_texts_and_eyebrows';
import * as migration_20260717_095054_partner_page_fields from './20260717_095054_partner_page_fields';
import * as migration_20260717_101717_forum_page from './20260717_101717_forum_page';

export const migrations = [
  {
    up: migration_20260714_101024_initial.up,
    down: migration_20260714_101024_initial.down,
    name: '20260714_101024_initial',
  },
  {
    up: migration_20260714_103528_phase1_data_model.up,
    down: migration_20260714_103528_phase1_data_model.down,
    name: '20260714_103528_phase1_data_model',
  },
  {
    up: migration_20260714_135258_phase2_form_submissions.up,
    down: migration_20260714_135258_phase2_form_submissions.down,
    name: '20260714_135258_phase2_form_submissions',
  },
  {
    up: migration_20260714_142554_phase3_jobs_queue.up,
    down: migration_20260714_142554_phase3_jobs_queue.down,
    name: '20260714_142554_phase3_jobs_queue',
  },
  {
    up: migration_20260714_150658_phase5_dedup_fields.up,
    down: migration_20260714_150658_phase5_dedup_fields.down,
    name: '20260714_150658_phase5_dedup_fields',
  },
  {
    up: migration_20260714_180439_erid_sponsor_links.up,
    down: migration_20260714_180439_erid_sponsor_links.down,
    name: '20260714_180439_erid_sponsor_links',
  },
  {
    up: migration_20260714_183258_videos_and_hero_video.up,
    down: migration_20260714_183258_videos_and_hero_video.down,
    name: '20260714_183258_videos_and_hero_video',
  },
  {
    up: migration_20260714_190557_media_alt_optional.up,
    down: migration_20260714_190557_media_alt_optional.down,
    name: '20260714_190557_media_alt_optional',
  },
  {
    up: migration_20260714_231842_latest_news_block.up,
    down: migration_20260714_231842_latest_news_block.down,
    name: '20260714_231842_latest_news_block',
  },
  {
    up: migration_20260715_125447_education_documents.up,
    down: migration_20260715_125447_education_documents.down,
    name: '20260715_125447_education_documents',
  },
  {
    up: migration_20260715_150332_nav_pageheaders_footer.up,
    down: migration_20260715_150332_nav_pageheaders_footer.down,
    name: '20260715_150332_nav_pageheaders_footer',
  },
  {
    up: migration_20260715_154714_ui_texts_and_eyebrows.up,
    down: migration_20260715_154714_ui_texts_and_eyebrows.down,
    name: '20260715_154714_ui_texts_and_eyebrows',
  },
  {
    up: migration_20260717_095054_partner_page_fields.up,
    down: migration_20260717_095054_partner_page_fields.down,
    name: '20260717_095054_partner_page_fields',
  },
  {
    up: migration_20260717_101717_forum_page.up,
    down: migration_20260717_101717_forum_page.down,
    name: '20260717_101717_forum_page'
  },
];
