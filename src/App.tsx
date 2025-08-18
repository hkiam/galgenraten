import { useEffect } from 'react';
import PlayerSetup from './components/PlayerSetup';
import WordInput from './components/WordInput';
import MultiplayerGame from './components/MultiplayerGame';
import GameFinished from './components/GameFinished';
import UpdateNotification from './components/UpdateNotification';
import { useGameStore } from './stores/gameStore';
import './App.css';


function App() {
  const { gamePhase, initializeStore } = useGameStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="app">
      <UpdateNotification />
            
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
