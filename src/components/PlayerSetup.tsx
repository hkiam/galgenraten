import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import AddPlayerModal from './AddPlayerModal';
import AppVersion from './AppVersion';

const PlayerSetup: React.FC = () => {
  const { players, removePlayer, startWordInput } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="player-setup">
      <header className="app-header">
        <h1>Galgenraten - Mehrspieler</h1>
        <AppVersion version={__APP_VERSION__} />
      </header>

      <h2>Spieler-Verwaltung</h2>
      
      <div className="players-list">
        <h3>Spieler ({players.length})</h3>
        {players.length === 0 ? (
          <p className="no-players">Noch keine Spieler hinzugefügt</p>
        ) : (
          <div className="players-grid">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                <span className="player-icon">{player.icon}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-wins">🏆 {player.wins}</span>
                <button
                  className="remove-button"
                  onClick={() => removePlayer(player.id)}
                  title="Spieler entfernen"
                  aria-label={`${player.name} entfernen`}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="add-player-section">
        <button 
          className="add-player-button"
          onClick={openModal}
          aria-label="Neuen Spieler hinzufügen"
        >
          <span className="add-icon">➕</span>
          <span className="add-text">Spieler hinzufügen</span>
        </button>
      </div>      

      {players.length >= 2 && (
        <div className="start-game-section">
          <button className="start-game-button" onClick={startWordInput}>
            Spiel starten ({players.length} Spieler)
          </button>
        </div>
      )}
      
      {players.length === 1 && (
        <p className="help-text">Mindestens 2 Spieler erforderlich</p>
      )}

      <AddPlayerModal 
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default PlayerSetup;