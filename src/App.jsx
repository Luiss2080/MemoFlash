import { useMemorama, LEVELS } from './hooks/useMemorama';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import { Layout } from './components/Layout';
import { RotateCcw, Eye } from 'lucide-react';
import './index.css';

function App() {
  const {
    cards, flippedIndices, matchedIndices, attempts, score, time, combo, isWon, bestScore,
    level, theme, soundEnabled, setSoundEnabled, flipCard, useHint, startGame, resetBestScore
  } = useMemorama();

  return (
    <Layout resetBestScore={resetBestScore} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}>
      <div className="app-container">
        <header className="header">
          <div className="controls">
            <select value={level} onChange={(e) => startGame(e.target.value, theme)} className="styled-select">
              {Object.entries(LEVELS).map(([key, lvl]) => (
                <option key={key} value={key}>{lvl.name}</option>
              ))}
            </select>
            <select value={theme} onChange={(e) => startGame(level, e.target.value)} className="styled-select">
              <option value="emojis">Emojis 🍎</option>
              <option value="animales">Animales 🐶</option>
            </select>
            <button className="btn-primary flex-center" onClick={() => startGame()}>
              <RotateCcw size={18} /> Reiniciar
            </button>
            <button className="btn-secondary flex-center" onClick={useHint} disabled={score < 200 || isWon}>
              <Eye size={18} /> Pista (-200)
            </button>
          </div>
        </header>

        <ScoreBoard attempts={attempts} score={score} time={time} bestScore={bestScore} combo={combo} />
        
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
      </div>
    </Layout>
  );
}

export default App;
