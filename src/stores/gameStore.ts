import { create } from 'zustand';
import type { GameState, Player, PlayerGameState } from '../types/game';
import { savePlayersToStorage, loadPlayersFromStorage, updatePlayerWins } from '../utils/storage';
import { distributeWordsRandomly, type WordEntry } from '../utils/wordDistribution';

interface GameStore extends GameState {
  addPlayer: (name: string, icon: string) => void;
  removePlayer: (playerId: string) => void;
  togglePlayerActive: (playerId: string) => void;
  startWordInput: () => void;
  setPlayerWord: (playerId: string, word: string) => void;
  startGame: () => void;
  guessLetter: (letter: string) => void;
  nextPlayer: () => void;
  resetGame: () => void;
  getCurrentPlayer: () => PlayerGameState | null;
  getCurrentPlayerData: () => Player | null;
  getActivePlayers: () => Player[];
  initializeStore: () => void;
}

const initialState: GameState = {
  players: [],
  currentGamePlayers: [],
  currentPlayerIndex: 0,
  gamePhase: 'setup',
  gameStatus: 'waiting',
  winner: null,
  maxTries: 11,
  wordInputIndex: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initializeStore: () => {
    const savedPlayers = loadPlayersFromStorage();
    set({ players: savedPlayers.map((p) => ({ ...p, active: p.active ?? true })) });
  },

  addPlayer: (name: string, icon: string) => {
    const state = get();
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: name.trim(),
      icon,
      wins: 0,
      active: true,
    };

    const updatedPlayers = [...state.players, newPlayer];
    set({ players: updatedPlayers });
    savePlayersToStorage(updatedPlayers);
  },

  removePlayer: (playerId: string) => {
    const state = get();
    const updatedPlayers = state.players.filter((p) => p.id !== playerId);
    set({ players: updatedPlayers });
    savePlayersToStorage(updatedPlayers);
  },

  togglePlayerActive: (playerId: string) => {
    const state = get();
    const updated = state.players.map((p) =>
      p.id === playerId ? { ...p, active: !(p.active ?? true) } : p,
    );
    set({ players: updated });
    savePlayersToStorage(updated);
  },

  startWordInput: () => {
    const state = get();
    const activePlayers = state.players.filter((p) => p.active ?? true);
    if (activePlayers.length < 2) {
      // Guard: nicht starten, wenn zu wenige aktive Spieler
      return;
    }

    const currentGamePlayers: PlayerGameState[] = activePlayers.map((player) => ({
      playerId: player.id,
      wordToGuess: '',
      displayWord: [],
      wrongLetters: [],
      isCompleted: false,
      hasWon: false,
    }));

    set({
      gamePhase: 'word-input',
      currentGamePlayers,
      wordInputIndex: 0,
    });
  },

  setPlayerWord: (playerId: string, word: string) => {
    const state = get();

    if (!word || word.trim().length < 3) {
      // Ungültige Eingabe wird auf UI-Ebene validiert
      return;
    }

    const trimmedWord = word.trim();

    // Store the word entry temporarily - we'll distribute randomly when all words are collected
    const updatedGamePlayers = state.currentGamePlayers.map((player) =>
      player.playerId === playerId ? { ...player, wordToGuess: trimmedWord } : player,
    );

    const activeCount = state.currentGamePlayers.length;
    const nextIndex = Math.min(state.wordInputIndex + 1, activeCount);

    set({
      currentGamePlayers: updatedGamePlayers,
      wordInputIndex: nextIndex,
    });
  },

  startGame: () => {
    const state = get();

    // Create word entries from collected words
    const wordEntries: WordEntry[] = state.currentGamePlayers
      .filter((player) => player.wordToGuess !== '')
      .map((player) => ({
        playerId: player.playerId,
        word: player.wordToGuess,
      }));

    // Distribute words ensuring no player gets their own word
    const distributedGamePlayers = distributeWordsRandomly(state.players, wordEntries);
    set({
      currentGamePlayers: distributedGamePlayers,
      gamePhase: 'playing',
      gameStatus: 'playing',
      currentPlayerIndex: 0,
    });
  },

  guessLetter: (letter: string) => {
    const state = get();

    if (state.gameStatus !== 'playing') return;

    const currentPlayer = state.currentGamePlayers[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isCompleted) return;

    const lowerLetter = letter.toLowerCase();

    // Prevent duplicate guesses
    if (
      currentPlayer.displayWord.includes(letter) ||
      currentPlayer.wrongLetters.includes(lowerLetter)
    ) {
      return;
    }

    const wordToGuessLower = currentPlayer.wordToGuess.toLowerCase();
    let updatedCurrentPlayer = { ...currentPlayer };

    if (wordToGuessLower.includes(lowerLetter)) {
      // Correct guess - update display word
      const newDisplayWord = [...currentPlayer.displayWord];
      wordToGuessLower.split('').forEach((char, index) => {
        if (char === lowerLetter) {
          newDisplayWord[index] = currentPlayer.wordToGuess[index];
        }
      });

      const hasWon = currentPlayer.wordToGuess === newDisplayWord.join('');

      updatedCurrentPlayer = {
        ...currentPlayer,
        displayWord: newDisplayWord,
        isCompleted: hasWon,
        hasWon,
      };

      if (hasWon) {
        // Player won - update highscore and end game
        const winnerData = state.players.find((p) => p.id === currentPlayer.playerId);
        const updatedPlayers = updatePlayerWins(currentPlayer.playerId, state.players);

        set({
          currentGamePlayers: state.currentGamePlayers.map((p, i) =>
            i === state.currentPlayerIndex ? updatedCurrentPlayer : p,
          ),
          gamePhase: 'finished',
          gameStatus: 'won',
          winner: winnerData || null,
          players: updatedPlayers,
        });

        savePlayersToStorage(updatedPlayers);
        return;
      }
    } else {
      // Wrong guess
      const newWrongLetters = [...currentPlayer.wrongLetters, lowerLetter];
      const gameLost = newWrongLetters.length >= state.maxTries;

      updatedCurrentPlayer = {
        ...currentPlayer,
        wrongLetters: newWrongLetters,
        isCompleted: gameLost,
        hasWon: false,
      };
    }

    set({
      currentGamePlayers: state.currentGamePlayers.map((p, i) =>
        i === state.currentPlayerIndex ? updatedCurrentPlayer : p,
      ),
    });
  },

  nextPlayer: () => {
    const state = get();
    const nextIndex = (state.currentPlayerIndex + 1) % state.currentGamePlayers.length;

    // Skip completed players
    let finalIndex = nextIndex;
    let attempts = 0;
    while (
      state.currentGamePlayers[finalIndex]?.isCompleted &&
      attempts < state.currentGamePlayers.length
    ) {
      finalIndex = (finalIndex + 1) % state.currentGamePlayers.length;
      attempts++;
    }

    // Check if all players are completed
    const allCompleted = state.currentGamePlayers.every((p) => p.isCompleted);
    if (allCompleted) {
      set({
        gamePhase: 'finished',
        gameStatus: 'lost',
      });
      return;
    }

    set({ currentPlayerIndex: finalIndex });
  },

  getCurrentPlayer: () => {
    const state = get();
    return state.currentGamePlayers[state.currentPlayerIndex] || null;
  },

  getCurrentPlayerData: () => {
    const state = get();
    const currentPlayer = state.currentGamePlayers[state.currentPlayerIndex];
    return currentPlayer
      ? state.players.find((p) => p.id === currentPlayer.playerId) || null
      : null;
  },

  getActivePlayers: () => {
    return get().players.filter((p) => p.active ?? true);
  },

  resetGame: () => {
    set({
      ...initialState,
      players: get().players, // Keep existing players
    });
  },
}));
