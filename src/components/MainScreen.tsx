import React from 'react';
import { Difficulty } from '../types';

interface MainScreenProps {
  highScore: number;
  soundEnabled: boolean;
  onStartGame: (difficulty: Difficulty, customTable?: number) => void;
  onToggleSound: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  highScore,
  soundEnabled,
  onStartGame,
  onToggleSound,
}) => {
  const [showCustomMode, setShowCustomMode] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState<number>(2);

  const handleCustomStart = () => {
    onStartGame('custom', selectedTable);
  };

  return (
    <div className="main-screen">
      <div className="main-content">
        <h1 className="game-title">
          🌧️ 구구단 산성비 게임
        </h1>
        <p className="game-subtitle">떨어지는 문제를 풀어보세요!</p>

        {!showCustomMode ? (
          <div className="menu-section">
            <div className="difficulty-buttons">
              <button
                className="menu-button difficulty-easy"
                onClick={() => onStartGame('easy')}
              >
                <span className="button-icon">😊</span>
                <span className="button-text">쉬움</span>
                <span className="button-desc">2~5단 / 느림</span>
              </button>

              <button
                className="menu-button difficulty-normal"
                onClick={() => onStartGame('normal')}
              >
                <span className="button-icon">😎</span>
                <span className="button-text">보통</span>
                <span className="button-desc">2~7단 / 중간</span>
              </button>

              <button
                className="menu-button difficulty-hard"
                onClick={() => onStartGame('hard')}
              >
                <span className="button-icon">🔥</span>
                <span className="button-text">어려움</span>
                <span className="button-desc">2~9단 / 빠름</span>
              </button>
            </div>

            <button
              className="menu-button custom-button"
              onClick={() => setShowCustomMode(true)}
            >
              <span className="button-icon">🎯</span>
              <span className="button-text">단 선택하기</span>
            </button>
          </div>
        ) : (
          <div className="menu-section custom-mode">
            <h2 className="section-title">단 선택 모드</h2>
            <p className="section-desc">연습하고 싶은 단을 선택하세요</p>
            
            <div className="table-selector">
              {[2, 3, 4, 5, 6, 7, 8, 9].map((table) => (
                <button
                  key={table}
                  className={`table-button ${selectedTable === table ? 'selected' : ''}`}
                  onClick={() => setSelectedTable(table)}
                >
                  {table}단
                </button>
              ))}
            </div>

            <div className="custom-actions">
              <button
                className="menu-button start-custom-button"
                onClick={handleCustomStart}
              >
                시작하기
              </button>
              <button
                className="menu-button back-button"
                onClick={() => setShowCustomMode(false)}
              >
                뒤로가기
              </button>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="high-score">
            🏆 최고 점수: <strong>{highScore}</strong>
          </div>
          
          <button
            className="sound-toggle"
            onClick={onToggleSound}
            title={soundEnabled ? '소리 끄기' : '소리 켜기'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        <div className="instructions">
          <h3>게임 방법</h3>
          <ul>
            <li>하늘에서 떨어지는 곱셈 문제를 풀어보세요</li>
            <li>숫자 버튼으로 답을 입력하고 확인을 누르세요</li>
            <li>정답을 맞추면 +10점을 얻습니다</li>
            <li>물방울이 바닥에 닿으면 생명이 줄어듭니다</li>
            <li>생명 3개를 모두 잃으면 게임이 끝납니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

