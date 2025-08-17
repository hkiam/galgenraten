import React from 'react';
import { useGameStore } from '../stores/gameStore';
import HangmanCanvas from './HangmanCanvas';
import VirtualKeyboard from './VirtualKeyboard';

const MultiplayerGame: React.FC = () => {
  const { 
    players,
    currentGamePlayers,
    currentPlayerIndex,
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

  const activePlayersCount = currentGamePlayers.filter(p => !p.isCompleted).length;

  return (
    <div className="multiplayer-game">
      <div className="game-header">
        <h2>Galgenraten - Mehrspieler</h2>
        <div className="active-players-info">
          {activePlayersCount} von {currentGamePlayers.length} Spielern noch aktiv
        </div>
      </div>

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

      <div className="all-players-overview">
        <h3>Spieler-Übersicht</h3>
        <div className="players-overview-grid">
          {currentGamePlayers.map((gamePlayer, index) => {
            const playerData = players.find(p => p.id === gamePlayer.playerId);
            if (!playerData) return null;
            
            const isCurrent = index === currentPlayerIndex;
            
            return (
              <div 
                key={gamePlayer.playerId}
                className={`player-overview ${isCurrent ? 'current' : ''} ${gamePlayer.isCompleted ? 'completed' : ''}`}
              >
                <div className="player-info">
                  <span className="player-icon">{playerData.icon}</span>
                  <span className="player-name">{playerData.name}</span>
                </div>
                
                <div className="player-word">
                  {gamePlayer.displayWord.join(' ') || '_ _ _'}
                </div>
                
                <div className="player-status">
                  {gamePlayer.isCompleted ? (
                    gamePlayer.hasWon ? '🏆 Gewonnen' : '💀 Verloren'
                  ) : (
                    `${gamePlayer.wrongLetters.length}/11 Fehler`
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="game-controls">
        <button 
          className="next-player-button"
          onClick={nextPlayer}
          disabled={currentPlayer.isCompleted}
        >
          Nächster Spieler
        </button>
      </div>
    </div>
  );
};

export default MultiplayerGame;