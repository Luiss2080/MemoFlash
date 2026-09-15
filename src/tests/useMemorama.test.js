import { renderHook, act } from '@testing-library/react';
import { useMemorama, LEVELS } from '../hooks/useMemorama';

describe('useMemorama Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('inicializa el juego correctamente en dificultad fácil', () => {
    const { result } = renderHook(() => useMemorama());

    // Esperar que las cartas sean 16 en nivel fácil (8 pares)
    expect(result.current.cards.length).toBe(16);
    expect(result.current.level).toBe('facil');
    expect(result.current.score).toBe(0);
    expect(result.current.isMultiplayer).toBe(false);
  });

  test('inicia partida multijugador correctamente', () => {
    const { result } = renderHook(() => useMemorama());

    act(() => {
      result.current.startGame('medio', 'codigo', true);
    });

    expect(result.current.level).toBe('medio');
    expect(result.current.theme).toBe('codigo');
    expect(result.current.isMultiplayer).toBe(true);
    expect(result.current.activePlayer).toBe(1);
    expect(result.current.player1Score).toBe(0);
    expect(result.current.player2Score).toBe(0);
  });
});
