export interface Player {
  id: string;
  name: string;
  icon: string;
  wins: number;
  active?: boolean; // optional for backward compatibility; default true
}

export interface PlayerGameState {
  playerId: string;
  wordToGuess: string;
  displayWord: string[];
  wrongLetters: string[];
  isCompleted: boolean;
  hasWon: boolean;
}

export interface GameState {
  players: Player[];
  currentGamePlayers: PlayerGameState[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'word-input' | 'playing' | 'finished';
  gameStatus: 'waiting' | 'playing' | 'won' | 'lost';
  winner: Player | null;
  maxTries: number;
  wordInputIndex: number; // Track which player is entering word
}

export interface KeyboardButton {
  letter: string;
  isPressed: boolean;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; player: Omit<Player, 'id' | 'wins'> }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'START_WORD_INPUT' }
  | { type: 'SET_PLAYER_WORD'; playerId: string; word: string }
  | { type: 'START_GAME' }
  | { type: 'GUESS_LETTER'; letter: string }
  | { type: 'NEXT_PLAYER' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_HIGHSCORE'; playerId: string };
