import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

const WordInput: React.FC = () => {
  const { 
    players, 
    currentGamePlayers, 
    wordInputIndex, 
    setPlayerWord, 
    startGame 
  } = useGameStore();
  
  const [word, setWord] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const activePlayers = players.filter(p => p.active ?? true);
  const currentInputPlayer = activePlayers[wordInputIndex];
  
  const wordsEntered = currentGamePlayers.filter(gp => gp.wordToGuess !== '').length;
  const allWordsEntered = wordsEntered === activePlayers.length;

  useEffect(() => {
    if (allWordsEntered) {
      const timer = setTimeout(() => {
        startGame();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allWordsEntered, startGame]);

  const handleSubmitWord = () => {
    const value = word.trim();
    if (!value) {
      setError('Bitte gib ein Wort ein.');
      return;
    }
    if (value.length < 3) {
      setError('Das Wort muss mindestens 3 Zeichen lang sein.');
      return;
    }
    setError(null);
    setPlayerWord(currentInputPlayer.id, value);
    setWord('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitWord();
    }
  };

  if (allWordsEntered) {
    return (
      <div className="panel panel-center">
        <h2 className="section-title">Alle Wörter eingegeben! 🎯</h2>
        <p className="muted">Das Spiel startet gleich...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2 className="section-title">Wörter eingeben</h2>
      
      <div className="progress">
        <div className="progress-text">
          {wordsEntered} von {activePlayers.length} Wörtern eingegeben
        </div>
        <div className="progress-track">
          <div className="progress-value" style={{ width: `${(wordsEntered / players.length) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-slate-50 p-6">
        <div className="player-indicator">
          <span className="text-2xl">{currentInputPlayer?.icon}</span>
          <span className="font-semibold text-slate-800">{currentInputPlayer?.name}</span>
          <span className="muted pl-6">gibt ein Wort für die anderen Spieler ein</span>
        </div>

        <div className="word-input-form">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Wort eingeben (min. 3 Buchstaben)"
            maxLength={30}
            autoFocus
            className="input"
          />
          <button className="btn btn-primary" onClick={handleSubmitWord}>Wort bestätigen</button>
          {error && (
            <p className="text-danger" aria-live="polite">{error}</p>
          )}
        </div>
      </div>

      <div className="players-status">
        <h3>Status der Spieler:</h3>
        <div className="players-status-grid">
          {activePlayers.map((player, index) => {
            const gamePlayer = currentGamePlayers.find(gp => gp.playerId === player.id);
            const hasEnteredWord = gamePlayer?.wordToGuess !== '';
            const isCurrentPlayer = index === wordInputIndex;
            
            return (
              <div 
                key={player.id} 
                className={`player-status ${isCurrentPlayer ? 'current' : ''} ${hasEnteredWord ? 'completed' : ''}`}
              >
                <span className="text-2xl">{player.icon}</span>
                <span className="font-semibold text-slate-800">{player.name}</span>
                <span className="text-lg">
                  {hasEnteredWord ? '✅' : isCurrentPlayer ? '⏳' : '⏸️'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WordInput;
