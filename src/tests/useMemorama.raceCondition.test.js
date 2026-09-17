import { renderHook, act } from '@testing-library/react';
import { useMemorama } from '../hooks/useMemorama.js';

describe('race condition regression', () => {
  beforeEach(() => {
    localStorage.clear();
    window.AudioContext = class {
      createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} } }; }
      createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
      get state() { return 'running'; }
      resume() {}
    };
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('stale mismatch timeout does not corrupt state after restart', () => {
    const { result } = renderHook(() => useMemorama());

    // Force a deterministic deck by finding a guaranteed mismatch pair.
    act(() => {
      result.current.startGame('facil', 'emojis');
    });
    const cards = result.current.cards;
    let a = 0, b = cards.findIndex((c, i) => i !== 0 && c.content !== cards[0].content);

    act(() => {
      result.current.flipCard(a);
    });
    act(() => {
      result.current.flipCard(b);
    });
    expect(result.current.flippedIndices).toEqual([a, b]); // mismatch -> both still flipped, 800ms timeout pending

    // Restart BEFORE the 800ms mismatch timeout fires.
    act(() => {
      result.current.startGame('facil', 'emojis');
    });
    expect(result.current.flippedIndices).toEqual([]);

    // Flip one new card in the new game.
    act(() => {
      result.current.flipCard(0);
    });
    expect(result.current.flippedIndices).toEqual([0]);

    // Now let the STALE timeout from the old game fire.
    act(() => {
      vi.advanceTimersByTime(900);
    });

    // BUG (pre-fix): the stale timeout would wipe flippedIndices here, even
    // though card 0 of the NEW game is legitimately flipped and waiting for
    // its second card.
    // FIX: the stale timeout was cancelled by startGame, so state is untouched.
    expect(result.current.flippedIndices).toEqual([0]);
  });

  test('a third click while two mismatched cards are still face-up is ignored', () => {
    const { result } = renderHook(() => useMemorama());

    act(() => {
      result.current.startGame('facil', 'emojis');
    });
    const cards = result.current.cards;
    const a = 0;
    const b = cards.findIndex((c, i) => i !== 0 && c.content !== cards[0].content);
    const c = cards.findIndex((_, i) => i !== a && i !== b);

    act(() => { result.current.flipCard(a); });
    act(() => { result.current.flipCard(b); });
    expect(result.current.flippedIndices).toEqual([a, b]);

    // Board is locked while the mismatch is displayed: a third card click
    // must not add a 3rd face-up card or disturb the pending pair.
    act(() => { result.current.flipCard(c); });
    expect(result.current.flippedIndices).toEqual([a, b]);

    // Once the flip-back timeout elapses, the board unlocks normally.
    act(() => { vi.advanceTimersByTime(900); });
    expect(result.current.flippedIndices).toEqual([]);
  });

  test('stale hint-reveal timeout does not corrupt state after restart', () => {
    const { result } = renderHook(() => useMemorama());

    act(() => {
      result.current.startGame('facil', 'emojis');
    });
    // Give the player enough score to afford a hint by finding every
    // remaining pair by brute force (deterministic, no UI timing involved).
    while (result.current.score < 200) {
      const cards = result.current.cards;
      const matched = result.current.matchedIndices;
      const remaining = cards.map((_, i) => i).filter(i => !matched.includes(i));
      const first = remaining[0];
      const second = remaining.find(i => i !== first && cards[i].content === cards[first].content);
      act(() => { result.current.flipCard(first); });
      act(() => { result.current.flipCard(second); });
    }
    expect(result.current.score).toBeGreaterThanOrEqual(200);

    act(() => { result.current.useHint(); }); // reveals all cards for 1000ms
    expect(result.current.flippedIndices.length).toBeGreaterThan(0);

    // Restart BEFORE the hint's 1000ms reveal window elapses.
    act(() => {
      result.current.startGame('facil', 'emojis');
    });
    expect(result.current.flippedIndices).toEqual([]);

    act(() => { result.current.flipCard(0); });
    expect(result.current.flippedIndices).toEqual([0]);

    // Let the STALE hint timeout from the old game fire.
    act(() => { vi.advanceTimersByTime(1100); });

    // BUG (pre-fix): the stale hint timeout would wipe flippedIndices here.
    expect(result.current.flippedIndices).toEqual([0]);
  });
});
