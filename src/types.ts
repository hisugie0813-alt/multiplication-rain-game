// 게임 상태 타입 정의

export type Difficulty = 'easy' | 'normal' | 'hard' | 'custom';

export type GameScreen = 'main' | 'game' | 'gameover';

export interface Raindrop {
  id: number;
  num1: number;
  num2: number;
  answer: number;
  x: number;
  y: number;
  speed: number;
}

export interface GameState {
  screen: GameScreen;
  difficulty: Difficulty;
  customTable: number | null; // 단 선택 모드
  score: number;
  lives: number;
  raindrops: Raindrop[];
  currentInput: string;
  totalQuestions: number;
  correctAnswers: number;
  highScore: number;
  gameTime: number;
  soundEnabled: boolean;
}

export interface DifficultyConfig {
  name: string;
  tables: number[]; // 출제 단 (예: [2, 3, 4, 5])
  speed: number; // 낙하 속도
  spawnInterval: number; // 새 물방울 생성 간격 (ms)
  maxRaindrops: number; // 동시 최대 물방울 수
}

