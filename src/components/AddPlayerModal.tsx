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
  const [error, setError] = useState<string | null>(null);

  const availableIcons = getAvailableIcons();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPlayerName('');
      setSelectedIcon('🤖');
    }
  }, [isOpen]);

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) {
      setError('Bitte gib einen Namen ein.');
      return;
    }
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Ein Spieler mit diesem Namen existiert bereits.');
      return;
    }
    setError(null);
    addPlayer(name, selectedIcon);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Neuen Spieler hinzufügen" size="medium">
      <div>
        <div className="mb-4">
          <label htmlFor="player-name" className="mb-2 block font-bold text-slate-800">
            Name:
          </label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Spielername eingeben"
            maxLength={20}
            autoFocus
            className="input"
          />
          {error && (
            <p className="mt-2 text-danger" aria-live="polite">
              {error}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold text-slate-800">Icon wählen:</label>
          <div className="flex flex-wrap gap-2">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                className={`rounded-lg border-2 bg-white px-3 py-2 text-xl transition ${selectedIcon === icon ? 'scale-105 border-primary bg-blue-50' : 'border-slate-200 hover:border-primary'}`}
                onClick={() => setSelectedIcon(icon)}
                type="button"
                aria-label={`Icon ${icon} auswählen`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Abbrechen
          </button>
          <button className="btn btn-primary" onClick={handleAddPlayer}>
            Spieler hinzufügen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlayerModal;
