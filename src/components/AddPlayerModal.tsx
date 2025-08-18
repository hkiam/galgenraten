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
      <div>
        <div className="mb-4">
          <label htmlFor="player-name" className="block mb-2 font-bold text-slate-800">Name:</label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spielername eingeben"
            maxLength={20}
            autoFocus
            className="input"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-bold text-slate-800">Icon wählen:</label>
          <div className="flex flex-wrap gap-2">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                className={`px-3 py-2 text-xl border-2 rounded-lg bg-white transition ${selectedIcon === icon ? 'border-primary bg-blue-50 scale-105' : 'border-slate-200 hover:border-primary'}`}
                onClick={() => setSelectedIcon(icon)}
                type="button"
                aria-label={`Icon ${icon} auswählen`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button className="btn btn-secondary" onClick={handleCancel}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleAddPlayer}>Spieler hinzufügen</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlayerModal;
