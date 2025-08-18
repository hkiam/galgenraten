import { useEffect } from 'react';
import PlayerSetup from './components/PlayerSetup';
import WordInput from './components/WordInput';
import MultiplayerGame from './components/MultiplayerGame';
import GameFinished from './components/GameFinished';
import UpdateNotification from './components/UpdateNotification';
import { useGameStore } from './stores/gameStore';
// Tailwind styles are imported in main.tsx


function App() {
  const { gamePhase, initializeStore } = useGameStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center p-4">
      <UpdateNotification />
      <main className="w-full container-app flex flex-col items-center gap-6">
        {gamePhase === 'setup' && <PlayerSetup />}
        {gamePhase === 'word-input' && <WordInput />}
        {gamePhase === 'playing' && <MultiplayerGame />}
        {gamePhase === 'finished' && <GameFinished />}
      </main>
    </div>
  );
}

export default App;
