import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';


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
  it('builds currentGamePlayers aus aktiven Spielern', () => {
    addPlayers(['A', 'B', 'C']);
    const { startWordInput } = useGameStore.getState();
    startWordInput();
    const state = useGameStore.getState();
    expect(state.currentGamePlayers).toHaveLength(3);
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

    // Ensure both got a word and game proceeded
    const gp = useGameStore.getState().currentGamePlayers;
    expect(gp).toHaveLength(2);

    // Make wrong guesses for current player until lost, selecting letters not in the assigned word
    let st = useGameStore.getState();
    const target = st.currentGamePlayers[0].wordToGuess.toLowerCase();
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const wrongLetters = alphabet.filter((c) => !target.includes(c)).slice(0, st.maxTries);
    wrongLetters.forEach((ch) => useGameStore.getState().guessLetter(ch));

    st = useGameStore.getState();
    const p0 = st.currentGamePlayers[0];
    expect(p0.isCompleted).toBeTruthy();
  });
});
