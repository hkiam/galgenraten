import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getAvailableIcons } from '../utils/storage';

const PlayerSetup: React.FC = () => {
  const { players, addPlayer, removePlayer, startWordInput } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🤖');
  const [isAddPlayerExpanded, setIsAddPlayerExpanded] = useState(false);
  
  const availableIcons = getAvailableIcons();

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      alert('Bitte geben Sie einen Namen ein!');
      return;
    }
    
    if (players.some(p => p.name.toLowerCase() === playerName.trim().toLowerCase())) {
      alert('Ein Spieler mit diesem Namen existiert bereits!');
      return;
    }

    addPlayer(playerName.trim(), selectedIcon);
    setPlayerName('');
    setSelectedIcon('🤖');
    setIsAddPlayerExpanded(false); // Collapse after adding
  };

  const toggleAddPlayer = () => {
    setIsAddPlayerExpanded(!isAddPlayerExpanded);
    if (!isAddPlayerExpanded) {
      // Reset form when expanding
      setPlayerName('');
      setSelectedIcon('🤖');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="player-setup">
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
          className={`toggle-add-player ${isAddPlayerExpanded ? 'expanded' : ''}`}
          onClick={toggleAddPlayer}
          aria-expanded={isAddPlayerExpanded}
          aria-controls="add-player-form"
        >
          <span className="toggle-icon">{isAddPlayerExpanded ? '➖' : '➕'}</span>
          <span className="toggle-text">
            {isAddPlayerExpanded ? 'Abbrechen' : 'Neuen Spieler hinzufügen'}
          </span>
        </button>

        {isAddPlayerExpanded && (
          <div className="add-player-form" id="add-player-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Spielername eingeben"
                maxLength={20}
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label>Icon:</label>
              <div className="icon-selector">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="add-button" onClick={handleAddPlayer}>
              Spieler hinzufügen
            </button>
          </div>
        )}
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
    </div>
  );
};

export default PlayerSetup;