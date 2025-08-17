import React, { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

const UpdateNotification: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [wb, setWb] = useState<Workbox | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const workbox = new Workbox('/sw.js');
      
      workbox.addEventListener('installed', (event) => {
        if (!event.isUpdate) {
          setOfflineReady(true);
        }
      });

      workbox.addEventListener('waiting', () => {
        setShowUpdatePrompt(true);
      });

      workbox.register().catch((error) => {
        console.error('Service worker registration failed:', error);
      });

      setWb(workbox);
    }
  }, []);

  const handleUpdate = async () => {
    if (!wb) return;
    
    setIsUpdating(true);
    try {
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      
      wb.messageSW({ type: 'SKIP_WAITING' });
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  const handleOfflineReady = () => {
    setOfflineReady(false);
  };

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

  if (showUpdatePrompt) {
    return (
      <div className="update-notification update-available">
        <div className="notification-content">
          <h3>🚀 Neue Version verfügbar!</h3>
          <p>Eine neue Version der App ist verfügbar. Möchten Sie jetzt aktualisieren?</p>
          <div className="notification-buttons">
            <button 
              className="notification-button primary"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Wird aktualisiert...' : 'Jetzt aktualisieren'}
            </button>
            <button 
              className="notification-button secondary"
              onClick={handleDismiss}
              disabled={isUpdating}
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