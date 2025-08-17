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
  
  const currentInputPlayer = players[wordInputIndex];
  
  const wordsEntered = currentGamePlayers.filter(gp => gp.wordToGuess !== '').length;
  const allWordsEntered = wordsEntered === players.length;

  useEffect(() => {
    if (allWordsEntered) {
      const timer = setTimeout(() => {
        startGame();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allWordsEntered, startGame]);

  const handleSubmitWord = () => {
    if (!word.trim()) {
      alert('Bitte geben Sie ein Wort ein!');
      return;
    }
    
    if (word.trim().length < 3) {
      alert('Das Wort muss mindestens 3 Zeichen lang sein!');
      return;
    }

    setPlayerWord(currentInputPlayer.id, word.trim());
    setWord('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitWord();
    }
  };

  if (allWordsEntered) {
    return (
      <div className="word-input-complete">
        <h2>Alle Wörter eingegeben! 🎯</h2>
        <p>Das Spiel startet gleich...</p>
        <div className="loading-animation">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-input">
      <h2>Wörter eingeben</h2>
      
      <div className="progress-bar">
        <div className="progress-text">
          {wordsEntered} von {players.length} Wörtern eingegeben
        </div>
        <div className="progress-fill">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(wordsEntered / players.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="current-player-input">
        <div className="player-indicator">
          <span className="player-icon">{currentInputPlayer?.icon}</span>
          <span className="player-name">{currentInputPlayer?.name}</span>
          <span className="instruction">gibt ein Wort für die anderen Spieler ein</span>
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
          />
          <button onClick={handleSubmitWord}>
            Wort bestätigen
          </button>
        </div>
      </div>

      <div className="players-status">
        <h3>Status der Spieler:</h3>
        <div className="players-status-grid">
          {players.map((player, index) => {
            const gamePlayer = currentGamePlayers.find(gp => gp.playerId === player.id);
            const hasEnteredWord = gamePlayer?.wordToGuess !== '';
            const isCurrentPlayer = index === wordInputIndex;
            
            return (
              <div 
                key={player.id} 
                className={`player-status ${isCurrentPlayer ? 'current' : ''} ${hasEnteredWord ? 'completed' : ''}`}
              >
                <span className="player-icon">{player.icon}</span>
                <span className="player-name">{player.name}</span>
                <span className="status-indicator">
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