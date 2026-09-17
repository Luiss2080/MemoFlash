import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export const DECKS = {
  emojis: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🥑', '🥥', '🍔', '🍟', '🍕', '🌭', '🍩', '🍪', '🍫', '🍬'],
  animales: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'],
  codigo: ['💻', '⚙️', '🖥️', '📡', '🔌', '🔋', '💾', '💿', '📱', '📟', '⌨️', '🖱️', '🖲️', '🕹️', '🗜️', '💡', '🔦', '🔧'],
  banderas: ['🇲🇽', '🇪🇸', '🇺🇸', '🇨🇦', '🇧🇷', '🇦🇷', '🇨🇴', '🇨🇱', '🇵🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇩🇪', '🇫🇷', '🇮🇹', '🇬🇧', '🇷🇺', '🇮🇳']
};

export const LEVELS = {
  facil: { name: 'Fácil (4x4)', pairs: 8 },
  medio: { name: 'Medio (4x6)', pairs: 12 },
  dificil: { name: 'Difícil (6x6)', pairs: 18 }
};

const INITIAL_STATS = { gamesPlayed: 0, gamesWon: 0, totalTime: 0 };
const DEFAULT_PROFILE = { name: 'Jugador', avatar: '👽' };

export function useMemorama() {
  const [level, setLevel] = useState('facil');
  const [theme, setTheme] = useState('emojis');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false);

  // Pending setTimeout handles for the mismatch flip-back and the hint reveal.
  // Tracked in refs (instead of fire-and-forget setTimeout calls) so a restart
  // or unmount that happens while one of them is still pending can cancel it -
  // otherwise the stale timeout fires later against the *new* game's state and
  // wipes out flippedIndices/isLocked mid-turn (see fix/flip-animation-race-condition).
  const mismatchTimeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);

  const clearPendingTimeouts = () => {
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
  };

  // Cancel any in-flight timeout if the component unmounts mid-animation.
  useEffect(() => clearPendingTimeouts, []);

  const [lang, setLangState] = useState(() => localStorage.getItem('memorama-lang') || 'es');
  const [themeMode, setThemeModeState] = useState(() => localStorage.getItem('memorama-theme') || 'dark');

  const setLang = (l) => { setLangState(l); localStorage.setItem('memorama-lang', l); };
  const setThemeMode = (t) => { setThemeModeState(t); localStorage.setItem('memorama-theme', t); };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Multiplayer stats
  const [activePlayer, setActivePlayer] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // User Profile
  const [profile, setProfileState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('memorama-profile')) || DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const setProfile = (newProfile) => {
    setProfileState(newProfile);
    localStorage.setItem('memorama-profile', JSON.stringify(newProfile));
  };

  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem('memorama-best')) || null
  );

  const [globalStats, setGlobalStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('memorama-stats')) || INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const saveStats = (newStats) => {
    setGlobalStats(newStats);
    localStorage.setItem('memorama-stats', JSON.stringify(newStats));
  };

  useEffect(() => {
    sound.toggleBgm(bgmEnabled);
    return () => sound.toggleBgm(false);
  }, [bgmEnabled]);

  const startGame = useCallback((lvl = level, thm = theme, multi = isMultiplayer, ta = isTimeAttack) => {
    // A rapid restart (or difficulty/theme change) while a mismatch flip-back
    // or a hint reveal is still pending must not let that stale timeout fire
    // later and corrupt the freshly-started game's state.
    clearPendingTimeouts();

    setLevel(lvl);
    setTheme(thm);
    setIsMultiplayer(multi);
    setIsTimeAttack(ta);
    const pairCount = LEVELS[lvl].pairs;
    const selectedDeck = DECKS[thm].slice(0, pairCount);
    const deck = [...selectedDeck, ...selectedDeck]
      .sort(() => Math.random() - 0.5)
      .map((content, id) => ({ id, content }));
    
    setCards(deck);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setIsLocked(false);
    setAttempts(0);
    setScore(0);
    setTime(ta ? 60 : 0);
    setCombo(0);
    setIsActive(false);
    setIsWon(false);
    setIsGameOver(false);
    
    setActivePlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
  }, [level, theme, isMultiplayer, isTimeAttack]);

  // Init game on mount
  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isWon && !isGameOver) {
      interval = setInterval(() => {
        setTime((t) => {
          if (isTimeAttack) {
            if (t <= 1) {
              setIsGameOver(true);
              setIsActive(false);
              sound.error(soundEnabled); // Game over sound
              return 0;
            }
            return t - 1;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon, isGameOver, isTimeAttack, soundEnabled]);

  const addScoreToActivePlayer = (points) => {
    if (isMultiplayer) {
      if (activePlayer === 1) setPlayer1Score(s => s + points);
      else setPlayer2Score(s => s + points);
    } else {
      setScore(s => s + points);
    }
  };

  const flipCard = (index) => {
    if (isLocked || isWon || isGameOver) return;
    if (flippedIndices.includes(index) || matchedIndices.includes(index)) return;

    if (!isActive) setIsActive(true); // Start timer on first click

    sound.init();
    sound.flip(soundEnabled);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setAttempts(a => a + 1);

      const [first, second] = newFlipped;
      if (cards[first].content === cards[second].content) {
        // Match!
        sound.match(soundEnabled);
        setMatchedIndices(prev => [...prev, first, second]);
        const currentCombo = combo + 1;
        setCombo(currentCombo);
        
        const comboMultiplier = currentCombo > 1 ? currentCombo : 1;
        addScoreToActivePlayer((100 + Math.max(0, 50 - (isTimeAttack ? (60 - time) : time))) * comboMultiplier);
        
        if (isTimeAttack) {
            setTime(t => t + 5); // Add 5 seconds for a match in time attack
        }

        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        // No match
        sound.error(soundEnabled);
        setCombo(0);
        mismatchTimeoutRef.current = setTimeout(() => {
          mismatchTimeoutRef.current = null;
          setFlippedIndices([]);
          setIsLocked(false);
          if (isMultiplayer) setActivePlayer(prev => prev === 1 ? 2 : 1);
        }, 800);
      }
    }
  };

  const useHint = () => {
    if (isLocked || isWon || isGameOver) return;
    const currentScore = isMultiplayer ? (activePlayer === 1 ? player1Score : player2Score) : score;
    if (currentScore < 200) return;

    addScoreToActivePlayer(-200);
    const hidden = cards.map((_, i) => i).filter(i => !matchedIndices.includes(i));
    setFlippedIndices(hidden);
    setIsLocked(true);
    hintTimeoutRef.current = setTimeout(() => {
      hintTimeoutRef.current = null;
      setFlippedIndices([]);
      setIsLocked(false);
    }, 1000);
  };


  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && matchedIndices.length === cards.length && !isWon) {
      setIsWon(true);
      setIsActive(false);
      sound.win(soundEnabled);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#34d399', '#fbbf24', '#ec4899']
      });

      let finalTime = isTimeAttack ? (60 - time) : time; // approximate time spent
      const winBonus = Math.max(0, 1000 - finalTime * 10);
      
      if (!isMultiplayer) {
        const finalScore = score + winBonus;
        setScore(finalScore);
        if (!bestScore || finalScore > bestScore) {
          setBestScore(finalScore);
          localStorage.setItem('memorama-best', finalScore);
        }
      } else {
        addScoreToActivePlayer(winBonus);
      }

      saveStats({
        gamesPlayed: globalStats.gamesPlayed + 1,
        gamesWon: globalStats.gamesWon + 1,
        totalTime: globalStats.totalTime + finalTime
      });
    }
  }, [matchedIndices, cards.length, score, time, bestScore, isMultiplayer, isWon, globalStats, activePlayer, isTimeAttack]);

  const resetBestScore = useCallback(() => {
    setBestScore(null);
    localStorage.removeItem('memorama-best');
    saveStats(INITIAL_STATS);
  }, []);

  return {
    cards, flippedIndices, matchedIndices, attempts, score, time, combo, isWon, isGameOver, bestScore,
    level, theme, isMultiplayer, isTimeAttack, activePlayer, player1Score, player2Score,
    globalStats, profile, setProfile, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled,
    lang, setLang, themeMode, setThemeMode,
    flipCard, useHint, startGame, resetBestScore
  };
}
