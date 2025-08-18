import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdateNotification: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('Service worker registration failed:', error);
    },
  });

  const handleUpdate = () => updateServiceWorker(true);
  const handleDismiss = () => setNeedRefresh(false);
  const handleOfflineReady = () => setOfflineReady(false);

  if (offlineReady) {
    return (
      <div className="notify-backdrop">
        <div className="notify-card success">
          <h3 className="mb-2 text-xl font-semibold">🎉 App bereit für Offline-Nutzung!</h3>
          <p className="muted mb-4">Die App wurde erfolgreich installiert und kann jetzt auch ohne Internetverbindung verwendet werden.</p>
          <button className="btn btn-primary" onClick={handleOfflineReady}>Verstanden</button>
        </div>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="notify-backdrop">
        <div className="notify-card update">
          <h3 className="mb-2 text-xl font-semibold">🚀 Neue Version verfügbar!</h3>
          <p className="muted mb-4">Eine neue Version der App ist verfügbar. Möchten Sie jetzt aktualisieren?</p>
          <div className="flex justify-center gap-3">
            <button className="btn btn-accent" onClick={handleUpdate}>Jetzt aktualisieren</button>
            <button className="btn btn-secondary" onClick={handleDismiss}>Später</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UpdateNotification;
