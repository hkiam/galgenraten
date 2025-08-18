# 🎯 Galgenraten – Mehrspieler PWA

Ein modernes Galgenraten-Spiel für mehrere Spieler, entwickelt mit React + TypeScript + Vite. Als PWA installierbar und offline spielbar.

## 🎮 Features

- Mehrspieler mit Namen + Emoji-Icons
- Sichere Wortverteilung (Derangement): Niemand bekommt sein eigenes Wort
- Persistente Highscores (LocalStorage)
- PWA mit Update-Prompt und Offline-Support
- Responsive UI, deutsche QWERTZ-Tastatur (inkl. Ä/Ö/Ü)
- Spieler aktivieren/deaktivieren statt löschen
- Deutliche Rückmeldung bei Fehlversuch (Overlay, Übergabe-Hinweis, Hangman)
- Haptik + kurzer Beep bei falschem Buchstaben (wenn verfügbar)
- Spiel vorzeitig abbrechen (mit Bestätigung)

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
npm run dev            # Entwicklungsserver starten
npm run build          # Produktions-Build erstellen
npm run preview        # Build lokal testen
npm run lint           # ESLint prüfen
npm run format         # Prettier-Formatierung anwenden
npm run test           # Vitest (watch)
npm run test:run       # Vitest (einmalig)
npm run test:coverage  # Vitest mit Coverage (text/html/lcov)
npm run deploy         # Manuelles Deployment auf GitHub Pages
```

## 🎯 Spielregeln

1. **Setup**: Mindestens 2 Spieler mit Namen und Icons hinzufügen
2. **Wort-Eingabe**: Jeder Spieler gibt reihum ein geheimes Wort ein (min. 3 Buchstaben)
3. **Spielbeginn**: Wörter werden zufällig verteilt - niemand erhält sein eigenes Wort
4. **Raten**: Spieler sind abwechselnd dran und raten Buchstaben ihres zugewiesenen Wortes
5. **Gewinn**: Der erste Spieler, der sein Wort vollständig errät, gewinnt die Runde
6. **Highscore**: Siege werden dauerhaft gespeichert und in der Rangliste angezeigt

## 🏗️ Technologie-Stack

- Frontend: React 18/19 mit TypeScript
- Build: Vite
- State: Zustand
- Styling: Tailwind CSS (zentrale Utility-Klassen in `src/styles/tailwind.css`)
- PWA: `vite-plugin-pwa` (Update-Prompt via `useRegisterSW`), base-aware SW
- Tests: Vitest + Testing Library (jsdom), V8 Coverage
- Qualität: ESLint (inkl. Tailwind-Plugin), Prettier, Husky + lint-staged
- CI/CD: GitHub Actions (CI mit Lint/Tests/Coverage, Pages-Deploy)

## 📱 PWA & Deployment

- Offline spielbar, installierbar als App
- Update-Management mit Prompt (UpdateNotification)
- Base-Pfad: `vite.config.ts` setzt `base` dynamisch; SW-URL ist base-aware
- GitHub Pages: für Forks `package.json.homepage` und ggf. `BASE` anpassen

## 🔄 Versionierung und Updates

Das Projekt verwendet semantische Versionierung. Bei neuen Versionen erhalten Nutzer eine Benachrichtigung mit der Option:

- **"Jetzt aktualisieren"**: Lädt die neue Version sofort
- **"Später"**: Behält die aktuelle Version bei

## 🚢 Deployment

### Automatisches Deployment

GitHub Actions Workflows:

- `ci.yml`: Lint, Tests, Coverage (HTML als Artefakt)
- `deploy.yml`: Build und Deploy auf GitHub Pages (bei Push auf `main`)

### Manuelle Deployment

```bash
npm run build
npm run deploy
```

## 📂 Projektstruktur (Auszug)

```
src/
├── components/
│   ├── MultiplayerGame.tsx      # Spiel-UI, Overlay, Abbruch-Modal
│   ├── PlayerSetup.tsx          # Verwaltung, Aktiv/Deaktiv, Hinzufügen/Löschen (mit Modal)
│   ├── WordInput.tsx            # Wort-Eingabe (Val. + Fortschritt)
│   ├── UpdateNotification.tsx   # PWA-Update-Prompt (useRegisterSW)
│   ├── HangmanCanvas.tsx        # Canvas-Zeichnung (für Tests gemockt)
│   └── ...
├── stores/
│   └── gameStore.ts             # Zustand, Derangement-Start, abortGame()
├── styles/
│   └── tailwind.css             # Tailwind + zentrale Utility-Klassen (btn/card/...)
├── utils/
│   ├── wordDistribution.ts      # Sichere Wortverteilung (kein eigenes Wort)
│   ├── storage.ts               # LocalStorage
│   └── feedback.ts              # Vibration + Audio-Beep
└── test/
    └── setup.ts                 # jest-dom, PWA-Mock, Canvas-Mock, Cleanup

Tests (Auszug):
├── components/*.test.tsx        # UI-Tests (Overlay, Eingabe)
├── stores/gameStore.test.ts     # Flow- und Verlusttests
└── utils/wordDistribution.test.ts
```

## 🤝 Beitragen

- Pre-commit Hook formatiert & lintet automatisch (Husky + lint-staged)
- Bitte `npm run lint` und `npm run test:run` lokal grün halten
- PRs: Kurzbeschreibung, Screenshots (UI-Änderungen), ggf. Tests ergänzen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:

- Öffne ein Issue auf GitHub
- Beschreibe das Problem detailliert
- Füge Screenshots hinzu, falls hilfreich

---

**Viel Spaß beim Spielen! 🎉**
