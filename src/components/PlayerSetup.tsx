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
    <div className="card">
      <header className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Galgenraten - Mehrspieler</h1>
        <AppVersion version={__APP_VERSION__} />
      </header>

      <h2 className="section-title">Spieler-Verwaltung</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Spieler ({players.length})</h3>
        {players.length === 0 ? (
          <p className="text-center text-slate-500 italic p-8">Noch keine Spieler hinzugefügt</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {players.map((player) => (
              <div key={player.id} className="card-row">
                <span className="text-3xl">{player.icon}</span>
                <span className="flex-1 font-semibold text-slate-800">{player.name}</span>
                <span className="text-warn font-bold">🏆 {player.wins}</span>
                <button
                  className="icon-btn"
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

      <div className="mb-6 text-center">
        <button 
          className="btn btn-primary btn-lg"
          onClick={openModal}
          aria-label="Neuen Spieler hinzufügen"
        >
          <span className="text-lg">➕</span>
          <span>Spieler hinzufügen</span>
        </button>
      </div>      

      {players.length >= 2 && (
        <div className="text-center mt-6">
          <button className="btn btn-accent btn-lg" onClick={startWordInput}>
            Spiel starten ({players.length} Spieler)
          </button>
        </div>
      )}
      
      {players.length === 1 && (
        <p className="text-center text-slate-500 italic mt-2">Mindestens 2 Spieler erforderlich</p>
      )}

      <AddPlayerModal 
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default PlayerSetup;
