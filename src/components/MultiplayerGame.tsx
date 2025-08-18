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
    <div className="multiplayer-game">
      <div className="current-player-section">
        <div className="current-player-info">
          <span className="player-icon">{currentPlayerData.icon}</span>
          <span className="player-name">{currentPlayerData.name}</span>
          <span className="player-label">ist dran</span>
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
          <div className="player-completed">
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