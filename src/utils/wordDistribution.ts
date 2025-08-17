import type { Player, PlayerGameState } from '../types/game';

export interface WordEntry {
  playerId: string;
  word: string;
}

export function distributeWordsRandomly(players: Player[], wordEntries: WordEntry[]): PlayerGameState[] {
  if (players.length !== wordEntries.length) {
    throw new Error('Number of players must match number of word entries');
  }

  if (players.length < 2) {
    throw new Error('Need at least 2 players for word distribution');
  }

  // Create a copy of word entries to shuffle
  const availableWords = [...wordEntries];
  const result: PlayerGameState[] = [];

  // For each player, find a word that's not their own
  for (const player of players) {
    // Filter out words that belong to this player
    const validWords = availableWords.filter(entry => entry.playerId !== player.id);
    
    if (validWords.length === 0) {
      // This should not happen with proper game logic, but handle edge case
      throw new Error(`No valid word available for player ${player.name}`);
    }

    // Randomly select a word from valid options
    const randomIndex = Math.floor(Math.random() * validWords.length);
    const selectedWord = validWords[randomIndex];

    // Remove the selected word from available words
    const wordIndex = availableWords.findIndex(entry => 
      entry.playerId === selectedWord.playerId && entry.word === selectedWord.word
    );
    availableWords.splice(wordIndex, 1);

    // Create display word with non-keyboard characters revealed
    const displayWord = createDisplayWord(selectedWord.word);

    // Create player game state
    result.push({
      playerId: player.id,
      wordToGuess: selectedWord.word,
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