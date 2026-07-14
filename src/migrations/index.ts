import * as migration_20260714_101024_initial from './20260714_101024_initial';

export const migrations = [
  {
    up: migration_20260714_101024_initial.up,
    down: migration_20260714_101024_initial.down,
    name: '20260714_101024_initial'
  },
];
