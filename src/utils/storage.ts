import type { Player } from '../types/game';

const STORAGE_KEYS = {
  PLAYERS: 'galgenraten-players',
  HIGHSCORE: 'galgenraten-highscore'
};

export const savePlayersToStorage = (players: Player[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players to localStorage:', error);
  }
};

export const loadPlayersFromStorage = (): Player[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading players from localStorage:', error);
    return [];
  }
};

export const updatePlayerWins = (playerId: string, players: Player[]): Player[] => {
  return players.map(player => 
    player.id === playerId 
      ? { ...player, wins: player.wins + 1 }
      : player
  );
};

export const getAvailableIcons = (): string[] => {
  return ['🤖', '👤', '🎯', '🎮', '🏆', '⭐', '🎪', '🎨', '🎭', '🎸', '🎲', '🃏'];
};