import React from 'react';
import { useGameStore } from '../stores/gameStore';
import HangmanCanvas from './HangmanCanvas';
import VirtualKeyboard from './VirtualKeyboard';

const MultiplayerGame: React.FC = () => {
  const {         
    getCurrentPlayer,
    getCurrentPlayerData,
    guessLetter,
    nextPlayer,
    gameStatus
  } = useGameStore();

  const currentPlayer = getCurrentPlayer();
  const currentPlayerData = getCurrentPlayerData();
  
  if (!currentPlayer || !currentPlayerData) {
    return <div>Fehler: Kein aktiver Spieler gefunden</div>;
  }

  const handleLetterGuess = (letter: string) => {
    guessLetter(letter);
    
    // Auto-advance to next player after a wrong guess or completed word
    setTimeout(() => {
      const updatedCurrentPlayer = getCurrentPlayer();
      if (updatedCurrentPlayer && (
        updatedCurrentPlayer.isCompleted || 
        currentPlayer.wrongLetters.length < updatedCurrentPlayer.wrongLetters.length
      )) {
        nextPlayer();
      }
    }, 1000);
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
          />
        )}

        {currentPlayer.isCompleted && (
          <div className="player-completed text-center mt-4">
            {currentPlayer.hasWon ? (
              <div className="won">🎉 Wort erraten! 🎉</div>
            ) : (
              <div className="lost">😞 Galgen komplett 😞</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default MultiplayerGame;
