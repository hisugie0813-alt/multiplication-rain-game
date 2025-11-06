import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  correctAnswers: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  correctAnswers,
  totalQuestions,
  onPlayAgain,
  onMainMenu,
}) => {
  const isNewHighScore = score > 0 && score === highScore;
  
  const getMessage = () => {
    if (score >= 100) return { text: '최고예요!', emoji: '🌟', color: '#FFD700' };
    if (score >= 50) return { text: '잘했어요!', emoji: '😊', color: '#4CAF50' };
    return { text: '다시 도전해보세요!', emoji: '💪', color: '#FF9800' };
  };

  const message = getMessage();
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="gameover-screen">
      <div className="gameover-content">
        <div className="gameover-header">
          <h1 className="gameover-title">게임 종료!</h1>
          <p className="gameover-message" style={{ color: message.color }}>
            {message.emoji} {message.text}
          </p>
        </div>

        <div className="gameover-stats">
          <div className="stat-card final-score">
            <div className="stat-label">최종 점수</div>
            <div className="stat-value">{score}</div>
            {isNewHighScore && (
              <div className="new-record">🎉 신기록!</div>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-label">최고 점수</div>
            <div className="stat-value high">{highScore}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">정답률</div>
            <div className="stat-value">{accuracy}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">맞춘 문제</div>
            <div className="stat-value">
              {correctAnswers} / {totalQuestions}
            </div>
          </div>
        </div>

        <div className="gameover-actions">
          <button className="gameover-button play-again" onClick={onPlayAgain}>
            <span className="button-icon">🔄</span>
            <span className="button-text">다시하기</span>
          </button>

          <button className="gameover-button main-menu" onClick={onMainMenu}>
            <span className="button-icon">🏠</span>
            <span className="button-text">메인으로</span>
          </button>
        </div>

        <div className="encouragement">
          {score < 50 && '구구단을 더 연습하면 금방 높은 점수를 받을 수 있어요!'}
          {score >= 50 && score < 100 && '조금만 더 집중하면 최고 점수를 달성할 수 있어요!'}
          {score >= 100 && '정말 대단해요! 구구단 마스터예요! 🎓'}
        </div>
      </div>
    </div>
  );
};

