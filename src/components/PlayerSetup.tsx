import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import AddPlayerModal from './AddPlayerModal';
import Modal from './Modal';
import AppVersion from './AppVersion';

const PlayerSetup: React.FC = () => {
  const { players, removePlayer, startWordInput, togglePlayerActive } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const askRemovePlayer = (playerId: string, name: string) => {
    setPendingDelete({ id: playerId, name });
    setConfirmOpen(true);
  };
  const confirmDelete = () => {
    if (pendingDelete) {
      removePlayer(pendingDelete.id);
    }
    setConfirmOpen(false);
    setPendingDelete(null);
  };
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  return (
    <div className="card">
      <header className="mb-8 flex flex-col items-center">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Galgenraten - Mehrspieler</h1>
        <AppVersion version={__APP_VERSION__} />
      </header>

      {players.filter((p) => p.active ?? true).length >= 2 && (
        <div className="mt-6 text-center">
          <button className="btn btn-accent btn-lg" onClick={startWordInput}>
            Spiel starten ({players.filter((p) => p.active ?? true).length} Spieler)
          </button>
        </div>
      )}
      {players.filter((p) => p.active ?? true).length < 2 && (
        <p className="mt-2 text-center italic text-slate-500">Mindestens 2 Spieler erforderlich</p>
      )}
      <br />

      <h2 className="section-title">Spieler-Verwaltung</h2>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Spieler ({players.length})</h3>
          <button
            className="icon-btn"
            onClick={openModal}
            aria-label="Neuen Spieler hinzufügen"
            title="Spieler hinzufügen"
          >
            ➕
          </button>
        </div>
        {players.length === 0 ? (
          <p className="p-8 text-center italic text-slate-500">Noch keine Spieler hinzugefügt</p>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <div key={player.id} className="card-row">
                <span className="text-3xl">{player.icon}</span>
                <span
                  className={`flex-1 font-semibold ${(player.active ?? true) ? 'text-slate-800' : 'text-slate-400 line-through'}`}
                >
                  {player.name}
                </span>
                <span className="font-bold text-warn">🏆 {player.wins}</span>
                <button
                  className={`icon-btn ${(player.active ?? true) ? 'text-green-600' : 'text-slate-400'}`}
                  onClick={() => togglePlayerActive(player.id)}
                  title={(player.active ?? true) ? 'Spieler deaktivieren' : 'Spieler aktivieren'}
                  aria-label={`${player.name} ${(player.active ?? true) ? 'deaktivieren' : 'aktivieren'}`}
                >
                  {(player.active ?? true) ? '🟢' : '⚪'}
                </button>
                <button
                  className="icon-btn"
                  onClick={() => askRemovePlayer(player.id, player.name)}
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

      <AddPlayerModal isOpen={isModalOpen} onClose={closeModal} />

      <Modal isOpen={confirmOpen} onClose={cancelDelete} title="Spieler löschen" size="small">
        <p className="muted">
          Möchtest du den Spieler
          {pendingDelete ? ` "${pendingDelete.name}" ` : ' '}
          wirklich löschen?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={cancelDelete}>
            Abbrechen
          </button>
          <button className="btn btn-accent" onClick={confirmDelete}>
            Löschen
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PlayerSetup;
