import React, { useEffect, useRef } from 'react';
import { Raindrop } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, INPUT_PANEL_HEIGHT, RAINDROP_SIZE } from '../constants';

interface GameScreenProps {
  raindrops: Raindrop[];
  score: number;
  lives: number;
  currentInput: string;
  gameTime: number;
  onInputChange: (value: string) => void;
  onSubmitAnswer: () => void;
  onBackspace: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  raindrops,
  score,
  lives,
  currentInput,
  gameTime,
  onInputChange,
  onSubmitAnswer,
  onBackspace,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 물방울 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 클리어
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - INPUT_PANEL_HEIGHT);

    // 입력 패널 영역 구분선
    ctx.strokeStyle = '#4DA6FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - INPUT_PANEL_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - INPUT_PANEL_HEIGHT);
    ctx.stroke();

    // 물방울 그리기
    raindrops.forEach((drop) => {
      // 물방울 배경 (파란색 원)
      ctx.fillStyle = '#4DA6FF';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, RAINDROP_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // 물방울 테두리
      ctx.strokeStyle = '#2E86DE';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 문제 텍스트
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${drop.num1} × ${drop.num2}`, drop.x, drop.y);
    });
  }, [raindrops]);

  const handleNumberClick = (num: number) => {
    if (currentInput.length < 2) {
      onInputChange(currentInput + num);
    }
  };

  const handleClear = () => {
    onInputChange('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmitAnswer();
    } else if (e.key === 'Backspace') {
      onBackspace();
    } else if (e.key >= '0' && e.key <= '9' && currentInput.length < 2) {
      onInputChange(currentInput + e.key);
    }
  };

  return (
    <div className="game-screen" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* 게임 헤더 */}
      <div className="game-header">
        <div className="score-display">
          ⭐ 점수: <strong>{score}</strong>
        </div>
        <div className="lives-display">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < lives ? 'heart active' : 'heart'}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <div className="time-display">
          ⏱️ {gameTime}초
        </div>
      </div>

      {/* 게임 캔버스 */}
      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />
      </div>

      {/* 입력 패널 */}
      <div className="input-panel">
        <div className="input-display">
          <span className="input-label">답 입력:</span>
          <span className="input-value">{currentInput || '__'}</span>
        </div>
        
        <div className="number-pad">
          <div className="number-row">
            {[7, 8, 9].map((num) => (
              <button
                key={num}
                className="number-button"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="number-row">
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                className="number-button"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="number-row">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className="number-button"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="number-row">
            <button className="number-button zero" onClick={() => handleNumberClick(0)}>
              0
            </button>
            <button className="action-button confirm" onClick={onSubmitAnswer}>
              ✓ 확인
            </button>
            <button className="action-button clear" onClick={handleClear}>
              ✗ 지우기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

