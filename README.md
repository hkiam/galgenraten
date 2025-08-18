# 🎯 Galgenraten - Mehrspieler PWA

Ein modernes Galgenraten-Spiel für mehrere Spieler, entwickelt mit React, TypeScript und Vite. Spielbar als Progressive Web App (PWA) mit Offline-Unterstützung.

## 🎮 Features

- **Mehrspieler-Unterstützung**: Beliebig viele Spieler mit individuellen Namen und Emoji-Icons
- **Zufällige Wortverteilung**: Jeder Spieler erhält ein fremdes Wort zum Raten
- **Persistente Highscores**: Lokale Speicherung der Gewinn-Statistiken
- **PWA-Funktionalität**: Installierbar und offline spielbar
- **Automatische Updates**: Benachrichtigung über neue Versionen
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Deutsche QWERTZ-Tastatur**: Unterstützung für Umlaute (Ä, Ö, Ü)

## 🚀 Live Demo

Die App ist verfügbar unter: `https://hkiam.github.io/galgenraten/`

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone https://github.com/hkiam/galgenraten.git
cd galgenraten/galgenraten-react

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Verfügbare Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run preview      # Build lokal testen
npm run lint         # Code-Qualität prüfen
npm run deploy       # Manuelles Deployment zu GitHub Pages
```

## 🎯 Spielregeln

1. **Setup**: Mindestens 2 Spieler mit Namen und Icons hinzufügen
2. **Wort-Eingabe**: Jeder Spieler gibt reihum ein geheimes Wort ein (min. 3 Buchstaben)
3. **Spielbeginn**: Wörter werden zufällig verteilt - niemand erhält sein eigenes Wort
4. **Raten**: Spieler sind abwechselnd dran und raten Buchstaben ihres zugewiesenen Wortes
5. **Gewinn**: Der erste Spieler, der sein Wort vollständig errät, gewinnt die Runde
6. **Highscore**: Siege werden dauerhaft gespeichert und in der Rangliste angezeigt

## 🏗️ Technologie-Stack

- **Frontend**: React 18 mit TypeScript
- **Build-Tool**: Vite
- **State Management**: Zustand
- **PWA**: Vite PWA Plugin mit Workbox
- **Deployment**: GitHub Actions → GitHub Pages
- **Styling**: Vanilla CSS mit CSS Grid und Flexbox

## 📱 PWA-Features

- **Offline-Funktionalität**: Vollständig spielbar ohne Internetverbindung
- **App-Installation**: Installierbar auf Desktop und Mobile
- **Update-Management**: Automatische Erkennung neuer Versionen
- **Background-Sync**: Service Worker für zuverlässige Performance

## 🔄 Versionierung und Updates

Das Projekt verwendet semantische Versionierung. Bei neuen Versionen erhalten Nutzer eine Benachrichtigung mit der Option:

- **"Jetzt aktualisieren"**: Lädt die neue Version sofort
- **"Später"**: Behält die aktuelle Version bei

## 🚢 Deployment

### Automatisches Deployment

Das Projekt verwendet GitHub Actions für automatisches Deployment:

1. Push zu `main` Branch triggert Build
2. Automatische Code-Qualitätsprüfung
3. Build-Erstellung mit Produktionseinstellungen
4. Deployment zu GitHub Pages

### Manuelle Deployment

```bash
npm run build
npm run deploy
```

## 📂 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── AppVersion.tsx   # Versionsanzeige
│   ├── UpdateNotification.tsx  # PWA-Update-Management
│   ├── PlayerSetup.tsx  # Spieler-Verwaltung
│   ├── WordInput.tsx    # Wort-Eingabe-Phase
│   ├── MultiplayerGame.tsx  # Hauptspiel-Interface
│   ├── GameFinished.tsx # Ergebnis-Anzeige
│   ├── HangmanCanvas.tsx    # Canvas-Galgen-Zeichnung
│   └── VirtualKeyboard.tsx  # QWERTZ-Tastatur
├── stores/              # Zustand State Management
│   └── gameStore.ts     # Zentraler Spielzustand
├── types/               # TypeScript-Definitionen
│   └── game.ts          # Spiel-Interfaces
├── utils/               # Hilfsfunktionen
│   ├── storage.ts       # LocalStorage-Management
│   └── wordDistribution.ts  # Wort-Verteilungslogik
└── App.tsx              # Hauptkomponente
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Öffne ein Issue auf GitHub
- Beschreibe das Problem detailliert
- Füge Screenshots hinzu, falls hilfreich

---

**Viel Spaß beim Spielen! 🎉**
