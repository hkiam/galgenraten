import type { Player, PlayerGameState } from '../types/game';

export interface WordEntry {
  playerId: string;
  word: string;
}

export function distributeWordsRandomly(players: Player[], wordEntries: WordEntry[]): PlayerGameState[] {
  if (players.length !== wordEntries.length) {
    throw new Error('Number of players must match number of word entries');
  }

  const n = players.length;
  if (n < 2) {
    throw new Error('Need at least 2 players for word distribution');
  }

  // Build a random permutation of word entries, then fix any self-assignments (derangement).
  const indices = Array.from({ length: n }, (_, i) => i);
  // Fisher–Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Collect positions where a player would get their own word
  const fixed: number[] = [];
  for (let i = 0; i < n; i++) {
    if (wordEntries[indices[i]].playerId === players[i].id) fixed.push(i);
  }

  if (fixed.length === n) {
    // Completely fixed (very unlikely): rotate last two
    [indices[n - 1], indices[n - 2]] = [indices[n - 2], indices[n - 1]];
  } else if (fixed.length === 1) {
    // Swap with some other position
    const i = fixed[0];
    const j = (i + 1) % n; // safe since n>=2 and players have unique ids
    [indices[i], indices[j]] = [indices[j], indices[i]];
  } else if (fixed.length > 1) {
    // Rotate the assignments among fixed positions
    const firstIndexValue = indices[fixed[0]];
    for (let k = 0; k < fixed.length - 1; k++) {
      indices[fixed[k]] = indices[fixed[k + 1]];
    }
    indices[fixed[fixed.length - 1]] = firstIndexValue;
  }

  // Build result using the deranged assignment
  const result: PlayerGameState[] = [];
  for (let i = 0; i < n; i++) {
    const assigned = wordEntries[indices[i]];
    // Safety check: ensure no one gets their own word
    if (assigned.playerId === players[i].id) {
      // As a final guard (should not happen), swap with the next index
      const j = (i + 1) % n;
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }
    const word = wordEntries[indices[i]].word;
    const displayWord = createDisplayWord(word);
    result.push({
      playerId: players[i].id,
      wordToGuess: word,
      displayWord,
      wrongLetters: [],
      isCompleted: false,
      hasWon: false,
    });
  }

  return result;
}

function createDisplayWord(word: string): string[] {
  const displayWord = Array(word.length).fill('_');
  
  // Auto-reveal non-keyboard characters
  const validChars = 'qwertzuiopüasdfghjklöäyxcvbnm';
  const invalidChars = word.toLowerCase().split('').filter(char => !validChars.includes(char));
  
  invalidChars.forEach(char => {
    word.toLowerCase().split('').forEach((c, index) => {
      if (c === char) {
        displayWord[index] = word[index];
      }
    });
  });

  return displayWord;
}
