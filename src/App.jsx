import { useMemorama, LEVELS } from './hooks/useMemorama';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import './index.css';

function App() {
  const {
    cards, flippedIndices, matchedIndices, attempts, score, time, isWon, bestScore,
    level, theme, flipCard, startGame
  } = useMemorama();

  return (
    <div className="app-container">
      <header className="header">
        <h1>🧠 Memorama Premium</h1>
        <div className="controls">
          <select value={level} onChange={(e) => startGame(e.target.value, theme)}>
            {Object.entries(LEVELS).map(([key, lvl]) => (
              <option key={key} value={key}>{lvl.name}</option>
            ))}
          </select>
          <select value={theme} onChange={(e) => startGame(level, e.target.value)}>
            <option value="emojis">Emojis 🍎</option>
            <option value="animales">Animales 🐶</option>
          </select>
          <button className="btn-primary" onClick={() => startGame()}>🔄 Reiniciar</button>
        </div>
      </header>

      <main className="main-content">
        <ScoreBoard attempts={attempts} score={score} time={time} bestScore={bestScore} />
        
        <div className="board-container">
          {isWon && (
            <div className="victory-overlay">
              <div className="victory-card">
                <h2>🎉 ¡Victoria! 🎉</h2>
                <p>Has completado el tablero en <strong>{time}</strong> segundos con <strong>{attempts}</strong> intentos.</p>
                <p className="final-score">Puntuación Total: <span>{score}</span></p>
                <button className="btn-primary large" onClick={() => startGame()}>Jugar de Nuevo</button>
              </div>
            </div>
          )}
          
          <Board 
            cards={cards} 
            flippedIndices={flippedIndices} 
            matchedIndices={matchedIndices} 
            onFlip={flipCard} 
            level={level}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
