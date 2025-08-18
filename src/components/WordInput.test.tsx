import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WordInput from './WordInput';
import { useGameStore } from '../stores/gameStore';

function setupStateWithPlayers(names: string[]) {
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
  const add = useGameStore.getState().addPlayer;
  names.forEach((n, i) => add(n, `😀${i}`));
  useGameStore.getState().startWordInput();
}

beforeEach(() => {
  setupStateWithPlayers(['A', 'B']);
});

describe('WordInput UI', () => {
  it('shows error when submitting empty', async () => {
    render(<WordInput />);
    fireEvent.click(screen.getByRole('button', { name: /Wort bestätigen/i }));
    expect(await screen.findByText(/Bitte gib ein Wort ein\./i)).toBeInTheDocument();
  });

  it('accepts a valid word and stores it for the current player', async () => {
    render(<WordInput />);
    const input = screen.getAllByPlaceholderText(/Wort eingeben/i)[0];
    fireEvent.change(input, { target: { value: 'Hallo' } });
    fireEvent.click(screen.getByRole('button', { name: /Wort bestätigen/i }));
    const state = useGameStore.getState();
    const firstPlayerId = state.players[0].id;
    const gp = state.currentGamePlayers.find((g) => g.playerId === firstPlayerId);
    expect(gp?.wordToGuess).toBe('Hallo');
  });
});
