import { Timer, RotateCcw, Star, Trophy, Flame } from 'lucide-react';
import { getDict } from '../utils/i18n';

export function ScoreBoard({ attempts, score, time, bestScore, combo, isMultiplayer, activePlayer, player1Score, player2Score, lang }) {
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const t = getDict(lang);

  if (isMultiplayer) {
    return (
      <div className="scoreboard">
        <div className={`score-item ${activePlayer === 1 ? 'active-player' : ''}`}>
          <span className="label">{t.p1}</span>
          <span className="value score-highlight">{player1Score}</span>
        </div>
        <div className="score-item">
          <span className="label"><Timer size={16}/> {t.time}</span>
          <span className="value">{formatTime(time)}</span>
        </div>
        <div className={`score-item ${activePlayer === 2 ? 'active-player' : ''}`}>
          <span className="label">{t.p2}</span>
          <span className="value score-highlight">{player2Score}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="label">
          <Star size={16} fill="currentColor" className="text-yellow-400"/> {t.points} 
        </span>
        <span className="value score-highlight">
          {score}
          {combo > 1 && <span className="combo-badge"><Flame size={14}/> x{combo}</span>}
        </span>
      </div>
      <div className="score-item">
        <span className="label"><Trophy size={16} fill="currentColor" className="text-yellow-600"/> {t.best}</span>
        <span className="value">{bestScore || 0}</span>
      </div>
      <div className="score-item">
        <span className="label"><Timer size={16}/> {t.time}</span>
        <span className="value">{formatTime(time)}</span>
      </div>
    </div>
  );
}
