# La Tronconneuse de Poche

Mini-jeu mobile-first "Tinder des depenses publiques" pour [nicoquipaie.co](https://nicoquipaie.co).

Le joueur swipe des cartes de depenses budgetaires francaises :
- Gauche = Garder (bouclier)
- Droite = A revoir (tronconneuse)

3 niveaux de profondeur :
- **Niveau 1** : 2 directions (garder / couper)
- **Niveau 2** : 4 directions (OK / reduire / renforcer / injustifie)
- **Niveau 3** : micro-audit (a venir)

A la fin d'une session (10-12 cartes), le joueur obtient un archetype budgetaire et ses stats.

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **UI** : Tailwind CSS 4
- **Animations** : framer-motion (drag, spring, transforms)
- **State** : Zustand
- **Data** : JSON statique (MVP)
- **PWA** : serwist (service worker, offline)
- **Deploy** : Docker (output: standalone) via Coolify

## Demarrage

```bash
npm install
npm run dev
```

Le serveur de dev demarre sur http://localhost:3000.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de dev (Turbopack) |
| `npm run build` | Build production (webpack, requis pour PWA) |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |

## Build Docker

```bash
docker build -t tronconneuse .
docker run -p 3000:3000 tronconneuse
```

## Structure

```
src/
  app/          # Pages (App Router)
  components/   # Composants React
  data/         # Cartes et decks JSON
  stores/       # Zustand stores
  hooks/        # Hooks custom
  lib/          # Utils, analytics, achievements
  types/        # Types TypeScript
```

## Donnees

80 cartes reparties en 8+ categories thematiques. Montants en milliards d'euros (Md euros), sources officielles (PLF/LFSS 2025-2026, Cour des comptes, Senat).

## Deploy

Heberge sur nicoquipaie.pixeeplay.fr via Coolify (Docker).
