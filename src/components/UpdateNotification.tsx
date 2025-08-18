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
      <div className="update-notification offline-ready">
        <div className="notification-content">
          <h3>🎉 App bereit für Offline-Nutzung!</h3>
          <p>Die App wurde erfolgreich installiert und kann jetzt auch ohne Internetverbindung verwendet werden.</p>
          <button 
            className="notification-button primary"
            onClick={handleOfflineReady}
          >
            Verstanden
          </button>
        </div>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="update-notification update-available">
        <div className="notification-content">
          <h3>🚀 Neue Version verfügbar!</h3>
          <p>Eine neue Version der App ist verfügbar. Möchten Sie jetzt aktualisieren?</p>
          <div className="notification-buttons">
            <button 
              className="notification-button primary"
              onClick={handleUpdate}
            >
              Jetzt aktualisieren
            </button>
            <button 
              className="notification-button secondary"
              onClick={handleDismiss}
            >
              Später
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UpdateNotification;
