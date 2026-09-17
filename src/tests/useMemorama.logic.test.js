import { renderHook, act } from '@testing-library/react';
import { useMemorama, LEVELS, DECKS } from '../hooks/useMemorama';

// jsdom has no <canvas> 2D context, so the real canvas-confetti would spin up
// a requestAnimationFrame loop that later throws (getContext() unimplemented)
// well after the test that triggered it has finished. The win animation
// itself isn't game logic, so stub it out for these logic-only tests.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Minimal Web Audio API stub: useMemorama.flipCard() calls sound.init()/
// sound.flip() etc. on every flip, and jsdom has no AudioContext at all.
function stubAudioContext() {
  window.AudioContext = class {
    createOscillator() {
      return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} } };
    }
    createGain() {
      return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } };
    }
    get state() { return 'running'; }
    resume() {}
  };
}

function findFirstMatch(cards, matchedIndices = []) {
  const remaining = cards.map((_, i) => i).filter((i) => !matchedIndices.includes(i));
  const first = remaining[0];
  const second = remaining.find((i) => i !== first && cards[i].content === cards[first].content);
  return [first, second];
}

function findMismatch(cards) {
  const second = cards.findIndex((c, i) => i !== 0 && c.content !== cards[0].content);
  return [0, second];
}

describe('useMemorama - deck generation', () => {
  beforeEach(() => {
    localStorage.clear();
    stubAudioContext();
  });

  test.each(Object.keys(LEVELS))('nivel "%s" genera el número de cartas correcto', (levelKey) => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame(levelKey, 'emojis'); });

    expect(result.current.cards.length).toBe(LEVELS[levelKey].pairs * 2);
  });

  test('cada carta tiene exactamente una pareja (nunca 1, 3 o más repeticiones)', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('dificil', 'animales'); });

    const counts = {};
    for (const card of result.current.cards) {
      counts[card.content] = (counts[card.content] || 0) + 1;
    }
    expect(Object.values(counts).every((n) => n === 2)).toBe(true);
    expect(Object.keys(counts).length).toBe(LEVELS.dificil.pairs);
  });

  test('el mazo generado usa únicamente emojis del tema elegido', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'codigo'); });

    const uniqueContents = new Set(result.current.cards.map((c) => c.content));
    for (const content of uniqueContents) {
      expect(DECKS.codigo).toContain(content);
    }
  });

  test('cada id de carta es único dentro del tablero (sin colisiones de key)', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('medio', 'banderas'); });

    const ids = result.current.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('useMemorama - match checking', () => {
  beforeEach(() => {
    localStorage.clear();
    stubAudioContext();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('encontrar una pareja la marca como matched y suma puntos', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    const [first, second] = findFirstMatch(result.current.cards);
    act(() => { result.current.flipCard(first); });
    act(() => { result.current.flipCard(second); });

    expect(result.current.matchedIndices).toEqual(expect.arrayContaining([first, second]));
    expect(result.current.flippedIndices).toEqual([]); // matches clear the "currently flipped" set immediately
    expect(result.current.score).toBeGreaterThan(0);
    expect(result.current.attempts).toBe(1);
  });

  test('fallar una pareja no suma puntos y las regresa boca abajo tras 800ms', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    const [first, second] = findMismatch(result.current.cards);
    act(() => { result.current.flipCard(first); });
    act(() => { result.current.flipCard(second); });

    expect(result.current.score).toBe(0);
    expect(result.current.attempts).toBe(1);
    expect(result.current.flippedIndices).toEqual([first, second]);
    expect(result.current.matchedIndices).toEqual([]);

    act(() => { vi.advanceTimersByTime(800); });
    expect(result.current.flippedIndices).toEqual([]);
  });

  test('fallar resetea el combo a cero', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    const [m1, m2] = findFirstMatch(result.current.cards);
    act(() => { result.current.flipCard(m1); });
    act(() => { result.current.flipCard(m2); });
    expect(result.current.combo).toBe(1);

    // Pick a mismatch pair from the still-unmatched cards.
    const remaining = result.current.cards.map((_, i) => i).filter((i) => !result.current.matchedIndices.includes(i));
    const a = remaining[0];
    const b = remaining.find((i) => i !== a && result.current.cards[i].content !== result.current.cards[a].content);
    act(() => { result.current.flipCard(a); });
    act(() => { result.current.flipCard(b); });

    expect(result.current.combo).toBe(0);
  });

  test('parejas consecutivas aplican un multiplicador de combo creciente', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    const [m1, m2] = findFirstMatch(result.current.cards);
    act(() => { result.current.flipCard(m1); });
    act(() => { result.current.flipCard(m2); });
    const scoreAfterFirstMatch = result.current.score;

    const [m3, m4] = findFirstMatch(result.current.cards, result.current.matchedIndices);
    act(() => { result.current.flipCard(m3); });
    act(() => { result.current.flipCard(m4); });

    const gainFromSecondMatch = result.current.score - scoreAfterFirstMatch;
    // combo is now 2, so the second match's base+bonus points are doubled -
    // strictly greater than the first (uncombo'd) match's gain.
    expect(gainFromSecondMatch).toBeGreaterThan(scoreAfterFirstMatch);
    expect(result.current.combo).toBe(2);
  });

  test('no se puede voltear la misma carta dos veces ni una carta ya emparejada', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    const [m1, m2] = findFirstMatch(result.current.cards);
    act(() => { result.current.flipCard(m1); });
    act(() => { result.current.flipCard(m1); }); // clicking the same card again must be a no-op
    expect(result.current.flippedIndices).toEqual([m1]);

    act(() => { result.current.flipCard(m2); });
    expect(result.current.matchedIndices).toEqual(expect.arrayContaining([m1, m2]));

    act(() => { result.current.flipCard(m1); }); // re-clicking a matched card must be a no-op
    expect(result.current.flippedIndices).toEqual([]);
  });
});

describe('useMemorama - win detection', () => {
  beforeEach(() => {
    localStorage.clear();
    stubAudioContext();
  });

  test('encontrar todas las parejas marca isWon y guarda el mejor puntaje', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    while (result.current.matchedIndices.length < result.current.cards.length) {
      const [a, b] = findFirstMatch(result.current.cards, result.current.matchedIndices);
      act(() => { result.current.flipCard(a); });
      act(() => { result.current.flipCard(b); });
    }

    expect(result.current.isWon).toBe(true);
    expect(result.current.bestScore).toBe(result.current.score);
    expect(Number(localStorage.getItem('memorama-best'))).toBe(result.current.score);
  });

  test('las estadísticas globales acumulan partidas jugadas y ganadas', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    while (result.current.matchedIndices.length < result.current.cards.length) {
      const [a, b] = findFirstMatch(result.current.cards, result.current.matchedIndices);
      act(() => { result.current.flipCard(a); });
      act(() => { result.current.flipCard(b); });
    }

    expect(result.current.globalStats.gamesPlayed).toBe(1);
    expect(result.current.globalStats.gamesWon).toBe(1);
  });
});

describe('useMemorama - hints', () => {
  beforeEach(() => {
    localStorage.clear();
    stubAudioContext();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('la pista no hace nada si el puntaje es menor a 200', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    expect(result.current.score).toBeLessThan(200);
    act(() => { result.current.useHint(); });

    expect(result.current.flippedIndices).toEqual([]);
    expect(result.current.score).toBe(0);
  });

  test('la pista revela el tablero y resta 200 puntos cuando hay saldo suficiente', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis'); });

    while (result.current.score < 200) {
      const [a, b] = findFirstMatch(result.current.cards, result.current.matchedIndices);
      act(() => { result.current.flipCard(a); });
      act(() => { result.current.flipCard(b); });
    }
    const scoreBeforeHint = result.current.score;
    const unmatchedCount = result.current.cards.length - result.current.matchedIndices.length;

    act(() => { result.current.useHint(); });

    expect(result.current.score).toBe(scoreBeforeHint - 200);
    expect(result.current.flippedIndices.length).toBe(unmatchedCount);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.flippedIndices).toEqual([]);
  });
});

describe('useMemorama - modo Contrarreloj (Time Attack)', () => {
  beforeEach(() => {
    localStorage.clear();
    stubAudioContext();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('empieza con 60 segundos y cuenta hacia atrás una vez activo', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis', false, true); });

    expect(result.current.time).toBe(60);

    act(() => { result.current.flipCard(0); }); // starts the timer (isActive = true)
    act(() => { vi.advanceTimersByTime(3000); });

    expect(result.current.time).toBe(57);
  });

  test('llegar a 0 termina la partida (game over) sin pasar a negativo', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis', false, true); });

    act(() => { result.current.flipCard(0); });
    act(() => { vi.advanceTimersByTime(60_000); });

    expect(result.current.time).toBe(0);
    expect(result.current.isGameOver).toBe(true);
  });

  test('encontrar una pareja añade 5 segundos extra al reloj', () => {
    const { result } = renderHook(() => useMemorama());
    act(() => { result.current.startGame('facil', 'emojis', false, true); });

    const [a, b] = findFirstMatch(result.current.cards);
    act(() => { result.current.flipCard(a); }); // starts timer at time=60
    const timeAtStart = result.current.time;
    act(() => { result.current.flipCard(b); });

    expect(result.current.time).toBe(timeAtStart + 5);
  });
});
