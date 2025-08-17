import React from 'react';
import { useGameStore } from '../stores/gameStore';

const GameFinished: React.FC = () => {
  const { 
    winner, 
    players, 
    currentGamePlayers, 
    resetGame,
    gameStatus 
  } = useGameStore();

  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);

  return (
    <div className="game-finished">
      <div className="result-section">
        {gameStatus === 'won' && winner ? (
          <div className="winner-announcement">
            <h2>🎉 Spiel beendet! 🎉</h2>
            <div className="winner-card">
              <span className="winner-icon">{winner.icon}</span>
              <div className="winner-info">
                <h3>{winner.name} hat gewonnen!</h3>
                <p>Gesamtsiege: {winner.wins}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-winner">
            <h2>Spiel beendet</h2>
            <p>Alle Spieler haben ihre Wörter verloren</p>
          </div>
        )}
      </div>

      <div className="round-summary">
        <h3>Runden-Zusammenfassung</h3>
        <div className="round-results">
          {currentGamePlayers.map((gamePlayer) => {
            const playerData = players.find(p => p.id === gamePlayer.playerId);
            if (!playerData) return null;
            
            return (
              <div 
                key={gamePlayer.playerId}
                className={`round-result ${gamePlayer.hasWon ? 'won' : 'lost'}`}
              >
                <span className="player-icon">{playerData.icon}</span>
                <span className="player-name">{playerData.name}</span>
                <span className="player-word">
                  Wort: <strong>{gamePlayer.wordToGuess}</strong>
                </span>
                <span className="player-result">
                  {gamePlayer.hasWon ? (
                    <span className="won-badge">🏆 Gewonnen</span>
                  ) : (
                    <span className="lost-badge">💀 Verloren ({gamePlayer.wrongLetters.length}/11)</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="highscore-section">
        <h3>🏆 Gesamtwertung</h3>
        <div className="highscore-list">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`highscore-entry ${index === 0 ? 'first-place' : ''} ${player.id === winner?.id ? 'recent-winner' : ''}`}
            >
              <span className="rank">#{index + 1}</span>
              <span className="player-icon">{player.icon}</span>
              <span className="player-name">{player.name}</span>
              <span className="wins-count">{player.wins} Siege</span>
              {index === 0 && <span className="crown">👑</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button className="new-game-button" onClick={resetGame}>
          Neues Spiel starten
        </button>
      </div>
    </div>
  );
};

export default GameFinished;