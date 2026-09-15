import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

const DECKS = {
  emojis: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🥑', '🥥', '🍔', '🍟', '🍕', '🌭', '🍩', '🍪', '🍫', '🍬'],
  animales: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦']
};

export const LEVELS = {
  facil: { name: 'Fácil (4x4)', pairs: 8 },
  medio: { name: 'Medio (4x6)', pairs: 12 },
  dificil: { name: 'Difícil (6x6)', pairs: 18 }
};

export function useMemorama() {
  const [level, setLevel] = useState('facil');
  const [theme, setTheme] = useState('emojis');
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem('memorama-best')) || null
  );

  const startGame = useCallback((lvl = level, thm = theme) => {
    setLevel(lvl);
    setTheme(thm);
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
    setTime(0);
    setCombo(0);
    setIsActive(false);
    setIsWon(false);
  }, [level, theme]);

  // Init game on mount
  useEffect(() => {
    startGame();
  }, [startGame]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isWon) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon, time]);

  const flipCard = (index) => {
    if (isLocked || isWon) return;
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
        
        // Multiplier based on combo
        const comboMultiplier = currentCombo > 1 ? currentCombo : 1;
        setScore(s => s + (100 + Math.max(0, 50 - time)) * comboMultiplier); 
        
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        // No match
        sound.error(soundEnabled);
        setCombo(0); // Reset combo
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const useHint = () => {
    if (isLocked || isWon || score < 200) return;
    setScore(s => s - 200);
    const hidden = cards.map((_, i) => i).filter(i => !matchedIndices.includes(i));
    setFlippedIndices(hidden);
    setIsLocked(true);
    setTimeout(() => {
      setFlippedIndices([]);
      setIsLocked(false);
    }, 1000);
  };


  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && matchedIndices.length === cards.length) {
      setIsWon(true);
      setIsActive(false);
      sound.win(soundEnabled);
      
      // Lanzar confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#34d399', '#fbbf24', '#ec4899']
      });

      const currentScore = score + Math.max(0, 1000 - time * 10);
      setScore(currentScore);
      if (!bestScore || currentScore > bestScore) {
        setBestScore(currentScore);
        localStorage.setItem('memorama-best', currentScore);
      }
    }
  }, [matchedIndices, cards.length, score, time, bestScore]);

  const resetBestScore = useCallback(() => {
    setBestScore(null);
    localStorage.removeItem('memorama-best');
  }, []);

  return {
    cards,
    flippedIndices,
    matchedIndices,
    attempts,
    score,
    time,
    combo,
    isWon,
    bestScore,
    level,
    theme,
    soundEnabled,
    setSoundEnabled,
    flipCard,
    useHint,
    startGame,
    resetBestScore
  };
}
