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
    <div className="finished-card">
      <div className="result-section">
        {gameStatus === 'won' && winner ? (
          <div>
            <h2 className="section-title">🎉 Spiel beendet! 🎉</h2>
            <div className="winner-card">
              <span className="text-3xl">{winner.icon}</span>
              <div>
                <h3 className="m-0 text-xl font-semibold text-green-800">{winner.name} hat gewonnen!</h3>
                <p className="muted">Gesamtsiege: {winner.wins}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="section-title">Spiel beendet</h2>
            <p className="muted">Alle Spieler haben ihre Wörter verloren</p>
          </div>
        )}
      </div>

      <div className="mb-8">
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
                <span className="text-2xl">{playerData.icon}</span>
                <span className="font-semibold text-slate-800">{playerData.name}</span>
                <span>
                  Wort: <strong>{gamePlayer.wordToGuess}</strong>
                </span>
                <span>
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

      <div className="mb-6">
        <h3>🏆 Gesamtwertung</h3>
        <div className="highscore-list">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`highscore-entry ${index === 0 ? 'first-place' : ''} ${player.id === winner?.id ? 'recent-winner' : ''}`}
            >
              <span className="text-slate-500">#{index + 1}</span>
              <span className="text-2xl">{player.icon}</span>
              <span className="font-semibold text-slate-800">{player.name}</span>
              <span className="font-medium">{player.wins} Siege</span>
              {index === 0 && <span>👑</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="btn btn-accent btn-lg" onClick={resetGame}>
          Neues Spiel starten
        </button>
      </div>
    </div>
  );
};

export default GameFinished;
