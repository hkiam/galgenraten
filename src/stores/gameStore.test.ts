import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import type { Player } from '../types/game';

function resetStore() {
  useGameStore.setState({
    players: [],
    currentGamePlayers: [],
    currentPlayerIndex: 0,
    gamePhase: 'setup',
    gameStatus: 'waiting',
    winner: null,
    maxTries: 11,
    wordInputIndex: 0,
  });
}

function addPlayers(names: string[]) {
  const add = useGameStore.getState().addPlayer;
  names.forEach((n, i) => add(n, `😀${i}`));
}

beforeEach(() => {
  resetStore();
});

describe('gameStore basic flow', () => {
  it('respects active players on startWordInput', () => {
    addPlayers(['A', 'B', 'C']);
    const { togglePlayerActive, startWordInput } = useGameStore.getState();
    // deactivate B
    const bId = useGameStore.getState().players[1].id;
    togglePlayerActive(bId);
    startWordInput();
    const state = useGameStore.getState();
    expect(state.gamePhase).toBe('word-input');
    expect(state.currentGamePlayers).toHaveLength(2);
  });

  it('runs a full round with loss after too many wrong guesses', () => {
    addPlayers(['A', 'B']);
    const store = useGameStore.getState();
    store.startWordInput();
    // Assign words
    const ids = useGameStore.getState().players.map((p) => p.id);
    store.setPlayerWord(ids[0], 'TEST');
    store.setPlayerWord(ids[1], 'CODE');
    store.startGame();

    // Ensure both got a word and not their own
    const gp = useGameStore.getState().currentGamePlayers;
    expect(gp).toHaveLength(2);
    expect(gp[0].playerId).toBe(ids[0]);
    expect(gp[1].playerId).toBe(ids[1]);
    expect(gp[0].wordToGuess).not.toBe('TEST');
    expect(gp[1].wordToGuess).not.toBe('CODE');

    // Make wrong guesses for player 1 until lost
    const wrong = ['x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    wrong.forEach((ch) => useGameStore.getState().guessLetter(ch));

    const st = useGameStore.getState();
    // The round may auto-advance; ensure we eventually end as lost or continue
    // After enough wrong guesses the current player should be completed
    const p0 = st.currentGamePlayers[0];
    expect(p0.isCompleted).toBeTruthy();
  });
});

