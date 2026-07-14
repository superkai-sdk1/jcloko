import * as migration_20260714_101024_initial from './20260714_101024_initial';
import * as migration_20260714_103528_phase1_data_model from './20260714_103528_phase1_data_model';
import * as migration_20260714_135258_phase2_form_submissions from './20260714_135258_phase2_form_submissions';
import * as migration_20260714_142554_phase3_jobs_queue from './20260714_142554_phase3_jobs_queue';

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
    name: '20260714_142554_phase3_jobs_queue'
  },
];
