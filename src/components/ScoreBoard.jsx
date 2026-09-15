import { Timer, RotateCcw, Star, Trophy, Flame } from 'lucide-react';

export function ScoreBoard({ attempts, score, time, bestScore, combo }) {
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="label"><Timer size={16}/> Tiempo</span>
        <span className="value">{formatTime(time)}</span>
      </div>
      <div className="score-item">
        <span className="label"><RotateCcw size={16}/> Intentos</span>
        <span className="value">{attempts}</span>
      </div>
      <div className="score-item">
        <span className="label">
          <Star size={16} fill="currentColor" className="text-yellow-400"/> Puntos 
        </span>
        <span className="value score-highlight">
          {score}
          {combo > 1 && <span className="combo-badge"><Flame size={14}/> x{combo}</span>}
        </span>
      </div>
      <div className="score-item">
        <span className="label"><Trophy size={16} fill="currentColor" className="text-yellow-600"/> Mejor</span>
        <span className="value">{bestScore || '--'}</span>
      </div>
    </div>
  );
}
