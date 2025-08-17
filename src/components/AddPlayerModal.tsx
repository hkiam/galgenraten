import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useGameStore } from '../stores/gameStore';
import { getAvailableIcons } from '../utils/storage';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose }) => {
  const { players, addPlayer } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🤖');
  
  const availableIcons = getAvailableIcons();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPlayerName('');
      setSelectedIcon('🤖');
    }
  }, [isOpen]);

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
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Neuen Spieler hinzufügen"
      size="medium"
    >
      <div className="add-player-modal-content">
        <div className="form-group">
          <label htmlFor="player-name">Name:</label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spielername eingeben"
            maxLength={20}
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label>Icon wählen:</label>
          <div className="icon-selector">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
                onClick={() => setSelectedIcon(icon)}
                type="button"
                aria-label={`Icon ${icon} auswählen`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-button secondary"
            onClick={handleCancel}
          >
            Abbrechen
          </button>
          <button 
            className="modal-button primary"
            onClick={handleAddPlayer}
          >
            Spieler hinzufügen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlayerModal;