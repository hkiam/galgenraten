import { describe, it, expect } from 'vitest';
import type { Player } from '../types/game';
import { distributeWordsRandomly, type WordEntry } from './wordDistribution';

function makePlayers(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    name: `P${i + 1}`,
    icon: '😀',
    wins: 0,
    active: true,
  }));
}

function makeEntries(players: Player[]): WordEntry[] {
  return players.map((p, i) => ({ playerId: p.id, word: `WORD_${i + 1}` }));
}

describe('distributeWordsRandomly', () => {
  it('creates a derangement (no one gets own word) for n from 2..8', () => {
    for (let n = 2; n <= 8; n++) {
      const players = makePlayers(n);
      const entries = makeEntries(players);
      const result = distributeWordsRandomly(players, entries);
      expect(result).toHaveLength(n);

      // No own word assigned
      result.forEach((pg, i) => {
        expect(pg.playerId).toBe(players[i].id);
        expect(pg.wordToGuess).not.toBe(entries[i].word);
      });

      // All words used exactly once
      const words = result.map((r) => r.wordToGuess).sort();
      const expected = entries.map((e) => e.word).sort();
      expect(words).toEqual(expected);
    }
  });

  it('is robust under many runs', () => {
    const players = makePlayers(5);
    const entries = makeEntries(players);
    for (let i = 0; i < 200; i++) {
      const result = distributeWordsRandomly(players, entries);
      result.forEach((pg, idx) => {
        expect(pg.wordToGuess).not.toBe(entries[idx].word);
      });
    }
  });
});

