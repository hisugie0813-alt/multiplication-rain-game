// 게임 상수 정의

import { DifficultyConfig } from './types';

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    name: '쉬움',
    tables: [2, 3, 4, 5],
    speed: 1.5,
    spawnInterval: 3000,
    maxRaindrops: 3,
  },
  normal: {
    name: '보통',
    tables: [2, 3, 4, 5, 6, 7],
    speed: 2.5,
    spawnInterval: 2500,
    maxRaindrops: 4,
  },
  hard: {
    name: '어려움',
    tables: [2, 3, 4, 5, 6, 7, 8, 9],
    speed: 3.5,
    spawnInterval: 2000,
    maxRaindrops: 5,
  },
};

export const INITIAL_LIVES = 3;
export const POINTS_PER_CORRECT = 10;
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;
export const INPUT_PANEL_HEIGHT = 220;
export const RAINDROP_SIZE = 80;

// LocalStorage 키
export const HIGH_SCORE_KEY = 'multiplicationRainHighScore';
export const SOUND_ENABLED_KEY = 'multiplicationRainSoundEnabled';

