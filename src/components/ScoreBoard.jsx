export function ScoreBoard({ attempts, score, time, bestScore }) {
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="label">⏳ Tiempo</span>
        <span className="value">{formatTime(time)}</span>
      </div>
      <div className="score-item">
        <span className="label">🔄 Intentos</span>
        <span className="value">{attempts}</span>
      </div>
      <div className="score-item">
        <span className="label">⭐ Puntos</span>
        <span className="value">{score}</span>
      </div>
      <div className="score-item">
        <span className="label">🏆 Mejor</span>
        <span className="value">{bestScore || '--'}</span>
      </div>
    </div>
  );
}
