// 게임 로직 유틸리티 함수

import { Raindrop, DifficultyConfig } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, INPUT_PANEL_HEIGHT, RAINDROP_SIZE } from '../constants';

let raindropIdCounter = 0;

/**
 * 새로운 물방울(문제) 생성
 */
export function createRaindrop(config: DifficultyConfig, customTable?: number | null): Raindrop {
  let num1: number;
  
  if (customTable) {
    // 단 선택 모드
    num1 = customTable;
  } else {
    // 랜덤 단 선택
    num1 = config.tables[Math.floor(Math.random() * config.tables.length)];
  }
  
  const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
  const answer = num1 * num2;
  
  // x 위치 랜덤 (화면 양 끝 여백 고려)
  const x = Math.random() * (CANVAS_WIDTH - RAINDROP_SIZE * 2) + RAINDROP_SIZE;
  
  return {
    id: raindropIdCounter++,
    num1,
    num2,
    answer,
    x,
    y: -RAINDROP_SIZE,
    speed: config.speed,
  };
}

/**
 * 물방울 위치 업데이트
 */
export function updateRaindrops(raindrops: Raindrop[]): Raindrop[] {
  return raindrops.map(drop => ({
    ...drop,
    y: drop.y + drop.speed,
  }));
}

/**
 * 화면 밖으로 나간 물방울 확인
 */
export function checkRaindropsOutOfBounds(raindrops: Raindrop[]): {
  inBounds: Raindrop[];
  outOfBounds: Raindrop[];
} {
  const threshold = CANVAS_HEIGHT - INPUT_PANEL_HEIGHT;
  
  return {
    inBounds: raindrops.filter(drop => drop.y < threshold),
    outOfBounds: raindrops.filter(drop => drop.y >= threshold),
  };
}

/**
 * 정답 확인 및 해당 물방울 제거
 */
export function checkAnswer(raindrops: Raindrop[], input: string): {
  found: boolean;
  remainingRaindrops: Raindrop[];
  removedRaindrop: Raindrop | null;
} {
  const answer = parseInt(input, 10);
  
  if (isNaN(answer)) {
    return { found: false, remainingRaindrops: raindrops, removedRaindrop: null };
  }
  
  // 가장 아래에 있는 정답 물방울 찾기
  const matchingDrops = raindrops.filter(drop => drop.answer === answer);
  
  if (matchingDrops.length === 0) {
    return { found: false, remainingRaindrops: raindrops, removedRaindrop: null };
  }
  
  // 가장 y값이 큰 (아래쪽에 있는) 물방울 선택
  const targetDrop = matchingDrops.reduce((lowest, current) => 
    current.y > lowest.y ? current : lowest
  );
  
  return {
    found: true,
    remainingRaindrops: raindrops.filter(drop => drop.id !== targetDrop.id),
    removedRaindrop: targetDrop,
  };
}

/**
 * 최고 점수 로드
 */
export function loadHighScore(): number {
  try {
    const saved = localStorage.getItem('multiplicationRainHighScore');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * 최고 점수 저장
 */
export function saveHighScore(score: number): void {
  try {
    localStorage.setItem('multiplicationRainHighScore', score.toString());
  } catch {
    // 저장 실패 시 무시
  }
}

/**
 * 사운드 설정 로드
 */
export function loadSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem('multiplicationRainSoundEnabled');
    return saved !== 'false'; // 기본값 true
  } catch {
    return true;
  }
}

/**
 * 사운드 설정 저장
 */
export function saveSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem('multiplicationRainSoundEnabled', enabled.toString());
  } catch {
    // 저장 실패 시 무시
  }
}

