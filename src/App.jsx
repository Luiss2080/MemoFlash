import { useMemorama, LEVELS } from './hooks/useMemorama';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import { Layout } from './components/Layout';
import { RotateCcw, Eye } from 'lucide-react';
import { getDict } from './utils/i18n';
import './index.css';

function App() {
  const {
    cards, flippedIndices, matchedIndices, attempts, score, time, combo, isWon, isGameOver, bestScore,
    level, theme, isMultiplayer, isTimeAttack, activePlayer, player1Score, player2Score,
    globalStats, profile, setProfile, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled,
    lang, setLang, themeMode, setThemeMode,
    flipCard, useHint, startGame, resetBestScore
  } = useMemorama();

  const t = getDict(lang);

  return (
    <Layout 
      resetBestScore={resetBestScore} 
      soundEnabled={soundEnabled} 
      setSoundEnabled={setSoundEnabled} 
      bgmEnabled={bgmEnabled}
      setBgmEnabled={setBgmEnabled}
      globalStats={globalStats}
      profile={profile}
      setProfile={setProfile}
      lang={lang}
      setLang={setLang}
      themeMode={themeMode}
      setThemeMode={setThemeMode}
    >
      <div className="app-container">
        <header className="header">
          <div className="controls">
            <select value={level} onChange={(e) => startGame(e.target.value, theme)} className="styled-select">
              {Object.entries(LEVELS).map(([key, lvl]) => (
                <option key={key} value={key}>{lvl.name}</option>
              ))}
            </select>
            <select value={theme} onChange={(e) => startGame(level, e.target.value, isMultiplayer)} className="styled-select">
              <option value="emojis">Emojis 🍎</option>
              <option value="animales">Animales 🐶</option>
              <option value="codigo">Código 💻</option>
              <option value="banderas">Banderas 🇲🇽</option>
            </select>
            <select value={isTimeAttack ? 'timeattack' : (isMultiplayer ? 'multi' : 'single')} onChange={(e) => {
              const val = e.target.value;
              if (val === 'timeattack') startGame(level, theme, false, true);
              else if (val === 'multi') startGame(level, theme, true, false);
              else startGame(level, theme, false, false);
            }} className="styled-select">
              <option value="single">{t.single}</option>
              <option value="multi">{t.multi}</option>
              <option value="timeattack">{t.timeattack}</option>
            </select>
            <button className="btn-primary flex-center" onClick={() => startGame()}>
              <RotateCcw size={18} /> {t.restart}
            </button>
            <button className="btn-secondary flex-center" onClick={useHint} disabled={score < 200 || isWon || isGameOver}>
              <Eye size={18} /> {t.hint}
            </button>
          </div>
        </header>

        <ScoreBoard 
          attempts={attempts} 
          score={score} 
          time={time} 
          bestScore={bestScore} 
          combo={combo} 
          isMultiplayer={isMultiplayer}
          activePlayer={activePlayer}
          player1Score={player1Score}
          player2Score={player2Score}
          lang={lang}
        />
        
        <div className="board-container">
          {isWon && (
            <div className="victory-overlay">
              <div className="victory-card">
                <h2>{t.win}</h2>
                <p>Completado en <strong>{time}</strong>s.</p>
                {isMultiplayer ? (
                  <p className="final-score">{t.winner}: <span>{player1Score > player2Score ? 'P1' : player1Score < player2Score ? 'P2' : t.tie}</span></p>
                ) : (
                  <p className="final-score">{t.total_score}: <span>{score}</span></p>
                )}
                <button className="btn-primary large" onClick={() => startGame()}>{t.restart}</button>
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
          {isGameOver && (
            <div className="victory-overlay">
              <div className="victory-card">
                <h2>{t.timeout}</h2>
                <p>{t.total_score}: <strong>{score}</strong>.</p>
                <button className="btn-primary large" onClick={() => startGame()}>{t.retry}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
