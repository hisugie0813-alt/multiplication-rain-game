import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, Raindrop } from './types';
import { MainScreen } from './components/MainScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { DIFFICULTY_CONFIGS, INITIAL_LIVES, POINTS_PER_CORRECT } from './constants';
import {
  createRaindrop,
  updateRaindrops,
  checkRaindropsOutOfBounds,
  checkAnswer,
  loadHighScore,
  saveHighScore,
  loadSoundEnabled,
  saveSoundEnabled,
} from './utils/gameLogic';
import { soundManager } from './utils/sounds';
import './App.css';

const initialState: GameState = {
  screen: 'main',
  difficulty: 'normal',
  customTable: null,
  score: 0,
  lives: INITIAL_LIVES,
  raindrops: [],
  currentInput: '',
  totalQuestions: 0,
  correctAnswers: 0,
  highScore: loadHighScore(),
  gameTime: 0,
  soundEnabled: loadSoundEnabled(),
};

function App() {
  const [state, setState] = useState<GameState>(initialState);
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const gameTimeRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // 사운드 설정 초기화
  useEffect(() => {
    soundManager.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // 게임 시작
  const startGame = useCallback((difficulty: Difficulty, customTable?: number) => {
    soundManager.playClick();
    setState({
      ...initialState,
      screen: 'game',
      difficulty,
      customTable: customTable || null,
      highScore: loadHighScore(),
      soundEnabled: state.soundEnabled,
      lives: INITIAL_LIVES,
    });
  }, [state.soundEnabled]);

  // 게임 루프
  useEffect(() => {
    if (state.screen !== 'game') {
      return;
    }

    const config = DIFFICULTY_CONFIGS[state.difficulty === 'custom' ? 'normal' : state.difficulty];

    // 물방울 업데이트 루프
    const gameLoop = () => {
      setState((prev) => {
        const now = Date.now();
        const deltaTime = (now - lastUpdateRef.current) / 1000;
        lastUpdateRef.current = now;

        // 물방울 위치 업데이트
        let updatedRaindrops = updateRaindrops(prev.raindrops);

        // 화면 밖으로 나간 물방울 체크
        const { inBounds, outOfBounds } = checkRaindropsOutOfBounds(updatedRaindrops);

        let newLives = prev.lives;
        
        // 생명 감소
        if (outOfBounds.length > 0) {
          newLives = Math.max(0, prev.lives - outOfBounds.length);
          soundManager.playLifeLost();
        }

        // 게임 오버 체크
        if (newLives === 0) {
          soundManager.playGameOver();
          
          // 최고 점수 업데이트
          let newHighScore = prev.highScore;
          if (prev.score > prev.highScore) {
            newHighScore = prev.score;
            saveHighScore(newHighScore);
          }

          // 게임 루프 정리
          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
          if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
          if (gameTimeRef.current) clearInterval(gameTimeRef.current);

          return {
            ...prev,
            screen: 'gameover',
            lives: 0,
            raindrops: [],
            highScore: newHighScore,
          };
        }

        return {
          ...prev,
          raindrops: inBounds,
          lives: newLives,
          totalQuestions: prev.totalQuestions + outOfBounds.length,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    lastUpdateRef.current = Date.now();

    // 물방울 생성 타이머
    const spawnInterval = setInterval(() => {
      setState((prev) => {
        if (prev.raindrops.length < config.maxRaindrops) {
          const newDrop = createRaindrop(config, prev.customTable);
          return {
            ...prev,
            raindrops: [...prev.raindrops, newDrop],
          };
        }
        return prev;
      });
    }, config.spawnInterval);

    spawnTimerRef.current = spawnInterval;

    // 게임 타이머
    const gameTimer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        gameTime: prev.gameTime + 1,
      }));
    }, 1000);

    gameTimeRef.current = gameTimer;

    // 클린업
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (gameTimeRef.current) clearInterval(gameTimeRef.current);
    };
  }, [state.screen, state.difficulty]);

  // 입력 변경
  const handleInputChange = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      currentInput: value,
    }));
  }, []);

  // 백스페이스
  const handleBackspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentInput: prev.currentInput.slice(0, -1),
    }));
  }, []);

  // 정답 제출
  const handleSubmitAnswer = useCallback(() => {
    setState((prev) => {
      if (!prev.currentInput) return prev;

      const { found, remainingRaindrops, removedRaindrop } = checkAnswer(
        prev.raindrops,
        prev.currentInput
      );

      if (found) {
        soundManager.playCorrect();
        return {
          ...prev,
          score: prev.score + POINTS_PER_CORRECT,
          raindrops: remainingRaindrops,
          currentInput: '',
          correctAnswers: prev.correctAnswers + 1,
          totalQuestions: prev.totalQuestions + 1,
        };
      } else {
        soundManager.playWrong();
        return {
          ...prev,
          currentInput: '',
        };
      }
    });
  }, []);

  // 다시하기
  const handlePlayAgain = useCallback(() => {
    soundManager.playClick();
    startGame(state.difficulty, state.customTable || undefined);
  }, [state.difficulty, state.customTable, startGame]);

  // 메인 메뉴로
  const handleMainMenu = useCallback(() => {
    soundManager.playClick();
    setState({
      ...initialState,
      highScore: loadHighScore(),
      soundEnabled: state.soundEnabled,
    });
  }, [state.soundEnabled]);

  // 사운드 토글
  const handleToggleSound = useCallback(() => {
    soundManager.playClick();
    const newSoundEnabled = !state.soundEnabled;
    soundManager.setEnabled(newSoundEnabled);
    saveSoundEnabled(newSoundEnabled);
    setState((prev) => ({
      ...prev,
      soundEnabled: newSoundEnabled,
    }));
  }, [state.soundEnabled]);

  return (
    <div className="app">
      {state.screen === 'main' && (
        <MainScreen
          highScore={state.highScore}
          soundEnabled={state.soundEnabled}
          onStartGame={startGame}
          onToggleSound={handleToggleSound}
        />
      )}

      {state.screen === 'game' && (
        <GameScreen
          raindrops={state.raindrops}
          score={state.score}
          lives={state.lives}
          currentInput={state.currentInput}
          gameTime={state.gameTime}
          onInputChange={handleInputChange}
          onSubmitAnswer={handleSubmitAnswer}
          onBackspace={handleBackspace}
        />
      )}

      {state.screen === 'gameover' && (
        <GameOverScreen
          score={state.score}
          highScore={state.highScore}
          correctAnswers={state.correctAnswers}
          totalQuestions={state.totalQuestions}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}

export default App;

