import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import HangmanCanvas from './HangmanCanvas';
import { wrongFeedback } from '../utils/feedback';
import VirtualKeyboard from './VirtualKeyboard';

const MultiplayerGame: React.FC = () => {
  const {         
    getCurrentPlayer,
    getCurrentPlayerData,
    guessLetter,
    nextPlayer,
    gameStatus,
    players,
  } = useGameStore();

  const currentPlayer = getCurrentPlayer();
  const currentPlayerData = getCurrentPlayerData();
  const [wrongOverlay, setWrongOverlay] = useState<null | { letter: string; nextName: string; nextIcon: string }>(null);
  const keyboardDisabled = !!wrongOverlay || gameStatus !== 'playing' || (currentPlayer?.isCompleted ?? false);

  if (!currentPlayer || !currentPlayerData) {
    return <div>Fehler: Kein aktiver Spieler gefunden</div>;
  }

  const handleLetterGuess = (letter: string) => {
    const wasCorrect = currentPlayer.wordToGuess.toLowerCase().includes(letter.toLowerCase());
    guessLetter(letter);

    // If wrong, show explicit overlay with next player's info
    if (!wasCorrect) {
      wrongFeedback();
      // Read updated game state to compute next player (skip completed)
      const { currentPlayerIndex, currentGamePlayers } = useGameStore.getState();
      let nextIndex = (currentPlayerIndex + 1) % currentGamePlayers.length;
      let attempts = 0;
      while (currentGamePlayers[nextIndex]?.isCompleted && attempts < currentGamePlayers.length) {
        nextIndex = (nextIndex + 1) % currentGamePlayers.length;
        attempts++;
      }
      const nextGamePlayer = currentGamePlayers[nextIndex];
      const nextData = players.find(p => p.id === nextGamePlayer?.playerId);
      setWrongOverlay({
        letter,
        nextName: nextData?.name ?? 'Nächster Spieler',
        nextIcon: nextData?.icon ?? '➡️',
      });
    }
  };


  return (
    <div className="game-card">
      <div>
        <div className="current-player-info">
          <span className="text-2xl">{currentPlayerData.icon}</span>
          <span className="font-semibold text-slate-800">{currentPlayerData.name}</span>
          <span className="muted">ist dran</span>
        </div>

        <div className="game-area">
          <HangmanCanvas wrongGuesses={currentPlayer.wrongLetters.length} />
          
          <div className="word-display">
            {currentPlayer.displayWord.length > 0 ? 
              currentPlayer.displayWord.join(' ') : 
              '_ _ _'
            }
          </div>
          
          {currentPlayer.wrongLetters.length > 0 && (
            <div className="wrong-letters">
              <span>Falsche Buchstaben: </span>
              {currentPlayer.wrongLetters.join(' ')}
            </div>
          )}

          <div className="tries-remaining">
            Verbleibende Versuche: {11 - currentPlayer.wrongLetters.length}
          </div>
        </div>

        {gameStatus === 'playing' && !currentPlayer.isCompleted && (
          <VirtualKeyboard 
            onLetterClick={handleLetterGuess}
            usedLetters={[
              ...currentPlayer.displayWord.map(char => char.toLowerCase()),
              ...currentPlayer.wrongLetters
            ]}
            disabled={keyboardDisabled}
          />
        )}

        {currentPlayer.isCompleted && (
          <div className="player-completed mt-4 text-center">
            {currentPlayer.hasWon ? (
              <div className="won">🎉 Wort erraten! 🎉</div>
            ) : (
              <div className="lost">😞 Galgen komplett 😞</div>
            )}
          </div>
        )}
    </div>

      {wrongOverlay && (
        <div className="notify-backdrop" role="dialog" aria-modal="true">
          <div className="notify-card update max-w-lg text-left">
            <h3 className="mb-2 text-xl font-semibold">Falscher Buchstabe!</h3>
            <p className="muted mb-4">„{wrongOverlay.letter.toUpperCase()}“ kommt nicht vor. Übergabe an:</p>
            <div className="mb-4 flex items-center gap-2 text-lg">
              <span>{wrongOverlay.nextIcon}</span>
              <span className="font-semibold">{wrongOverlay.nextName}</span>
            </div>
            <div className="mb-4 flex justify-center">
              <HangmanCanvas wrongGuesses={getCurrentPlayer()?.wrongLetters.length ?? 0} />
            </div>
            <div className="flex justify-end gap-3">
              <button className="btn btn-accent" onClick={() => { setWrongOverlay(null); nextPlayer(); }}>
                Weiter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MultiplayerGame;
