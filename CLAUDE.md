# CLAUDE.md — La Tronçonneuse de Poche (Budget Swipe)

## Projet
Mini-jeu mobile-first "Tinder des dépenses publiques" pour nicoquipaie.co.
Le joueur swipe des cartes de dépenses budgétaires françaises : gauche = garder (🛡️), droite = à revoir (🪚).
3 niveaux de profondeur : Niv.1 (2 directions), Niv.2 (4 directions), Niv.3 (micro-audit).
À la fin d'une session (10-12 cartes), le joueur obtient un archétype budgétaire et ses stats.

Repo : https://github.com/pixeeplay/tronconneuse/
Deploy : nicoquipaie.pixeeplay.fr (Coolify, Docker)

## Stack technique
- **Framework** : Next.js 15 (App Router, RSC)
- **UI** : Tailwind CSS 4 + shadcn/ui
- **Animations swipe** : framer-motion (useMotionValue, useTransform, animate, drag)
- **Gestes tactiles** : @use-gesture/react (fallback si framer-motion drag insuffisant)
- **State** : Zustand (store de session de jeu)
- **Data** : fichiers JSON statiques pour le MVP (pas de DB), structure prête pour Drizzle + PostgreSQL
- **Deploy** : Docker (output: standalone) → Coolify

## Conventions
- TypeScript strict, pas de `any`
- Composants dans `src/components/` (PascalCase)
- Pages dans `src/app/` (App Router)
- Types dans `src/types/`
- Data/cartes dans `src/data/`
- Stores Zustand dans `src/stores/`
- Hooks custom dans `src/hooks/`
- Utils dans `src/lib/`
- Mobile-first : designer pour 375px d'abord, responsive ensuite
- Dark theme par défaut
- Pas de localStorage pour le MVP (state en mémoire)

## Palette de couleurs
- Fond principal : #0F172A (slate-950)
- Cards : #1E293B (slate-800)
- Garder/OK : #10B981 (emerald-500)
- Couper/À revoir : #EF4444 (red-500)
- Renforcer : #3B82F6 (blue-500)
- Injustifié : #F59E0B (amber-500)
- Texte principal : #F8FAFC (slate-50)
- Texte secondaire : #94A3B8 (slate-400)
- Accent neon (hover/CTA) : #34D399 (emerald-400)

## Structure des fichiers
```
src/
├── app/
│   ├── layout.tsx           # root layout, dark theme, fonts
│   ├── page.tsx             # home / landing du jeu
│   ├── play/
│   │   ├── page.tsx         # sélection de deck
│   │   └── [deckId]/
│   │       └── page.tsx     # session de jeu (swipe)
│   ├── results/
│   │   └── page.tsx         # résultats post-session
│   └── profile/
│       └── page.tsx         # profil joueur
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── SwipeCard.tsx        # carte swipable
│   ├── SwipeStack.tsx       # pile de cartes + logique session
│   ├── CardDetail.tsx       # bottom sheet détail
│   ├── ResultScreen.tsx     # résultats + archétype
│   ├── DeckSelector.tsx     # grille catégories
│   ├── ProgressBar.tsx      # progression session
│   ├── ArchetypeCard.tsx    # archétype partageable
│   └── BottomNav.tsx        # navigation mobile
├── data/
│   ├── decks.json           # 80 cartes, 8 catégories
│   └── archetypes.json      # archétypes par niveau
├── stores/
│   └── gameStore.ts         # Zustand session state
├── hooks/
│   ├── useSwipeGesture.ts   # logique swipe
│   └── useArchetype.ts      # calcul archétype
├── types/
│   └── index.ts             # Card, Deck, Vote, Session, Archetype
└── lib/
    ├── deckUtils.ts         # shuffle, draw, filter
    └── archetype.ts         # classification archétype
```

## Commandes
- `npm run dev` — dev server (port 3000)
- `npm run build` — build production
- `npm run lint` — ESLint
- `docker build -t tronconneuse .` — build Docker
- `docker run -p 3000:3000 tronconneuse` — run container

## Gameplay Niveau 1 (MVP)
- Session = 10-12 cartes tirées d'un deck thématique ou en mode aléatoire
- Swipe gauche (🛡️ OK) / droite (🪚 À revoir) — seuil 100px
- Feedback visuel : stamp overlay + teinte colorée progressive pendant le drag
- Tap carte = ouvrir détail (bottom sheet)
- Fin de session → écran résultats + archétype
- Archétypes Niv.1 : Austéritaire (>80% couper), Gardien (>80% garder), Équilibriste (40-60%), Speedrunner (<60s)

## Données
Le master deck (80 cartes, 8 catégories) est documenté dans Briefs/MASTER-DECK-BUDGET-SWIPE.md.
Les données sont factuelles, sourcées, neutres. Pas de ton militant.
Montants en milliards d'euros (Md€), coût par citoyen basé sur ~68M habitants.
Sources : PLF/LFSS 2025-2026, Cour des comptes, Sénat, ministères, vie-publique.fr.

## Maquettes
Les maquettes HTML des écrans sont dasn Maquettes

## Notes d'implémentation
- Le swipe doit être fluide à 60fps sur mobile moyen de gamme
- Rotation de la carte proportionnelle au déplacement X (max ±15°)
- Carte suivante visible en dessous (scale 0.95, opacity 0.7)
- Animation de sortie : spring + overshoot + fade
- Bottom sheet : drag-to-dismiss, overlay semi-transparent
- Confettis résultats : animation CSS légère (pas de lib lourde)
