import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MultiplayerGame from './MultiplayerGame';
import { useGameStore } from '../stores/gameStore';

vi.mock('../utils/feedback', () => ({ wrongFeedback: vi.fn() }));

function resetStore() {
  useGameStore.setState({
    players: [],
    currentGamePlayers: [],
    currentPlayerIndex: 0,
    gamePhase: 'playing',
    gameStatus: 'playing',
    winner: null,
    maxTries: 11,
    wordInputIndex: 0,
  });
}

beforeEach(() => {
  resetStore();
});

describe('MultiplayerGame overlay and flow', () => {
  it('shows overlay on wrong guess and hands over to next player on Weiter', () => {
    // Two players, first is current
    const p1 = { id: '1', name: 'Alice', icon: '🧑‍🚀', wins: 0, active: true };
    const p2 = { id: '2', name: 'Bob', icon: '🧑‍🎨', wins: 0, active: true };
    useGameStore.setState((s) => ({
      ...s,
      players: [p1, p2],
      currentPlayerIndex: 0,
      currentGamePlayers: [
        { playerId: '1', wordToGuess: 'AB', displayWord: ['_', '_'], wrongLetters: [], isCompleted: false, hasWon: false },
        { playerId: '2', wordToGuess: 'CD', displayWord: ['_', '_'], wrongLetters: [], isCompleted: false, hasWon: false },
      ],
    }));

    render(<MultiplayerGame />);

    // Wrong guess: C is not in "AB"
    fireEvent.click(screen.getByRole('button', { name: 'Buchstabe C' }));

    expect(screen.getByText(/Falscher Buchstabe!/i)).toBeInTheDocument();
    expect(screen.getByText(/Übergabe an:/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob/)).toBeInTheDocument();

    // Proceed
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }));
    // Now Bob is current (indicator text shows Bob)
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
  });

  it('indicates loss when attempts are exhausted on wrong guess', () => {
    const p1 = { id: '1', name: 'Alice', icon: '🧑‍🚀', wins: 0, active: true };
    const p2 = { id: '2', name: 'Bob', icon: '🧑‍🎨', wins: 0, active: true };
    useGameStore.setState((s) => ({
      ...s,
      players: [p1, p2],
      currentPlayerIndex: 0,
      currentGamePlayers: [
        { playerId: '1', wordToGuess: 'AB', displayWord: ['_', '_'], wrongLetters: ['x','y','z','a','b','c','d','e','f','g'], isCompleted: false, hasWon: false },
        { playerId: '2', wordToGuess: 'CD', displayWord: ['_', '_'], wrongLetters: [], isCompleted: false, hasWon: false },
      ],
    }));

    render(<MultiplayerGame />);
    // One more wrong guess to exhaust to 11
    fireEvent.click(screen.getByRole('button', { name: 'Buchstabe H' }));

    expect(screen.getByText(/hat alle Versuche aufgebraucht und verloren/i)).toBeInTheDocument();
  });

  it('shows win when guessing last missing letter', () => {
    const p1 = { id: '1', name: 'Alice', icon: '🧑‍🚀', wins: 0, active: true };
    const p2 = { id: '2', name: 'Bob', icon: '🧑‍🎨', wins: 0, active: true };
    useGameStore.setState((s) => ({
      ...s,
      players: [p1, p2],
      currentPlayerIndex: 0,
      currentGamePlayers: [
        { playerId: '1', wordToGuess: 'AB', displayWord: ['A', '_'], wrongLetters: [], isCompleted: false, hasWon: false },
        { playerId: '2', wordToGuess: 'CD', displayWord: ['_', '_'], wrongLetters: [], isCompleted: false, hasWon: false },
      ],
    }));

    render(<MultiplayerGame />);
    // Guess B correctly to win
    fireEvent.click(screen.getByRole('button', { name: 'Buchstabe B' }));
    // Store switches to finished on win; component still shows completed state
    expect(screen.getByText(/Wort erraten/i)).toBeInTheDocument();
  });
});

