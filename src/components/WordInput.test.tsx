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

  it('accepts a valid word and advances progress', async () => {
    render(<WordInput />);
    const input = screen.getByPlaceholderText(/Wort eingeben/i);
    fireEvent.change(input, { target: { value: 'Hallo' } });
    fireEvent.click(screen.getByRole('button', { name: /Wort bestätigen/i }));
    expect(screen.getByText(/1 von 2 Wörtern eingegeben/i)).toBeInTheDocument();
  });
});

