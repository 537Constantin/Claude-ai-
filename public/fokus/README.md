# 🍅 Fokus — Pomodoro Timer

Eine kleine, eigenständige Seite: ein ablenkungsfreier Pomodoro-Timer in einer
einzigen HTML-Datei. Kein Build, keine Abhängigkeiten.

## Erreichbar

Liegt unter `public/fokus/`, wird also von der Next.js-App (z. B. auf Vercel)
statisch ausgeliefert unter:

```
/fokus
```

Lokal auch per Doppelklick auf `public/fokus/index.html` zu öffnen.

## Features

- **Drei Modi:** Fokus (25 min), kurze Pause (5 min), lange Pause (15 min)
- **Animierter Fortschrittsring** mit Restzeit-Anzeige
- **Automatischer Wechsel:** nach 4 Fokus-Runden folgt eine lange Pause
- **Rundenzähler** für abgeschlossene Fokus-Einheiten
- **Signalton** am Ende jeder Runde (Web Audio API)
- **Tastatur:** Leertaste startet/pausiert
- Funktioniert komplett offline, in jedem modernen Browser

> Hinweis: Dateien in `public/` werden von Next.js statisch unter dem Root-Pfad
> serviert. Ein Verzeichnis wie `mini-site/` außerhalb von `public/` würde von der
> App **nicht** ausgeliefert — deshalb liegt der Timer hier.
