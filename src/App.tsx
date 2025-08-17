import { useEffect } from 'react';
import PlayerSetup from './components/PlayerSetup';
import WordInput from './components/WordInput';
import MultiplayerGame from './components/MultiplayerGame';
import GameFinished from './components/GameFinished';
import UpdateNotification from './components/UpdateNotification';
import AppVersion from './components/AppVersion';
import { useGameStore } from './stores/gameStore';
import './App.css';

// Get version from package.json
const APP_VERSION = '1.0.0';

function App() {
  const { gamePhase, initializeStore } = useGameStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="app">
      <UpdateNotification />
      
      <header className="app-header">
        <h1>Galgenraten - Mehrspieler</h1>
        <AppVersion version={APP_VERSION} />
      </header>
      
      <main className="app-main">
        {gamePhase === 'setup' && <PlayerSetup />}
        {gamePhase === 'word-input' && <WordInput />}
        {gamePhase === 'playing' && <MultiplayerGame />}
        {gamePhase === 'finished' && <GameFinished />}
      </main>
    </div>
  );
}

export default App;
