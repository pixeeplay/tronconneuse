# 🪚 BRIEF CLAUDE CODE — Budget Swipe (La Tronçonneuse de Poche)

> **Repo** : https://github.com/pixeeplay/tronconneuse/
> **Deploy** : nicoquipaie.pixeeplay.fr (Coolify, Docker)
> **Auteur** : Seb · Mars 2026
> **Objectif** : Prototype jouable Niveau 1 complet

---

## CLAUDE.md — Fichier de contexte projet

Colle ce fichier à la racine du repo. Claude Code le lira automatiquement à chaque session.

```markdown
# CLAUDE.md — Budget Swipe

## Projet
Mini-jeu mobile-first "Tinder des dépenses publiques" pour nicoquipaie.co.
Le joueur swipe des cartes de dépenses budgétaires françaises : gauche = garder (🛡️), droite = à revoir (🪚).
3 niveaux de profondeur : Niv.1 (2 directions), Niv.2 (4 directions), Niv.3 (micro-audit).
À la fin d'une session (10-12 cartes), le joueur obtient un archétype budgétaire et ses stats.

## Stack technique
- **Framework** : Next.js 15 (App Router, RSC)
- **UI** : Tailwind CSS 4 + shadcn/ui
- **Animations swipe** : framer-motion (useMotionValue, useTransform, animate, drag)
- **Gestes tactiles** : @use-gesture/react (fallback si framer-motion drag insuffisant)
- **State** : Zustand (store de session de jeu)
- **Data** : fichiers JSON statiques pour le MVP (pas de DB), structure prête pour Drizzle + PostgreSQL
- **Deploy** : Docker → Coolify sur nicoquipaie.pixeeplay.fr

## Conventions
- TypeScript strict, pas de `any`
- Composants dans `src/components/` (PascalCase)
- Pages dans `src/app/` (App Router)
- Types dans `src/types/`
- Data/cartes dans `src/data/`
- Stores Zustand dans `src/stores/`
- Hooks custom dans `src/hooks/`
- Mobile-first : toujours designer pour 375px d'abord, responsive ensuite
- Dark theme par défaut (#0F172A fond, #1E293B cards)
- Pas de localStorage pour le MVP (state en mémoire, perdu au refresh — OK pour un proto)

## Palette
- Fond : #0F172A (slate-950)
- Card : #1E293B (slate-800)
- Garder (OK) : #10B981 (emerald-500)
- Couper (À revoir) : #EF4444 (red-500)
- Renforcer : #3B82F6 (blue-500)
- Injustifié : #F59E0B (amber-500)
- Texte principal : #F8FAFC (slate-50)
- Texte secondaire : #94A3B8 (slate-400)

## Commandes
- `npm run dev` — dev server
- `npm run build` — build production
- `npm run lint` — ESLint
- `docker build -t tronconneuse .` — build Docker
- `docker run -p 3000:3000 tronconneuse` — run local

## Fichiers clés à connaître
- `src/data/decks.json` — master deck 80 cartes (8 catégories)
- `src/types/card.ts` — types Card, Deck, Session, Vote, Archetype
- `src/stores/gameStore.ts` — état de la session de jeu (Zustand)
- `src/components/SwipeCard.tsx` — composant carte swipable (cœur du jeu)
- `src/components/ResultScreen.tsx` — écran de fin de session
```

---

## Structure du repo à bootstrapper

```
tronconneuse/
├── CLAUDE.md                    ← contexte Claude Code (ci-dessus)
├── README.md
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.example
├── .gitignore
│
├── public/
│   └── favicon.ico
│
└── src/
    ├── app/
    │   ├── layout.tsx           ← root layout, dark theme, fonts
    │   ├── page.tsx             ← home / landing du jeu
    │   ├── play/
    │   │   ├── page.tsx         ← sélection de deck
    │   │   └── [deckId]/
    │   │       └── page.tsx     ← session de jeu (swipe)
    │   ├── results/
    │   │   └── page.tsx         ← résultats post-session
    │   └── profile/
    │       └── page.tsx         ← profil joueur (v2)
    │
    ├── components/
    │   ├── ui/                  ← shadcn/ui components
    │   ├── SwipeCard.tsx        ← carte swipable (framer-motion drag)
    │   ├── SwipeStack.tsx       ← pile de cartes + logique session
    │   ├── CardDetail.tsx       ← vue détail (bottom sheet)
    │   ├── ResultScreen.tsx     ← écran résultats + archétype
    │   ├── DeckSelector.tsx     ← grille de sélection catégories
    │   ├── ProgressBar.tsx      ← progression dans la session
    │   ├── ArchetypeCard.tsx    ← affichage archétype (partageable)
    │   └── BottomNav.tsx        ← navigation mobile
    │
    ├── data/
    │   ├── decks.json           ← 80 cartes, 8 catégories
    │   └── archetypes.json      ← définitions des archétypes
    │
    ├── stores/
    │   └── gameStore.ts         ← Zustand : session, votes, progression
    │
    ├── hooks/
    │   ├── useSwipeGesture.ts   ← logique swipe encapsulée
    │   └── useArchetype.ts      ← calcul archétype depuis votes
    │
    ├── types/
    │   └── index.ts             ← Card, Deck, Vote, Session, Archetype
    │
    └── lib/
        ├── deckUtils.ts         ← shuffle, draw, filter par catégorie
        └── archetype.ts         ← algorithme de classification archétype
```

---

## Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

## docker-compose.yml (pour Coolify)

```yaml
version: "3.8"
services:
  tronconneuse:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
```

---

## Types de données

```typescript
// src/types/index.ts

export type SwipeDirection = "left" | "right" | "up" | "down";
export type VoteLevel1 = "ok" | "a_revoir";
export type VoteLevel2 = "ok" | "reduire" | "renforcer" | "injustifie";
export type Prescription = "reduire_moitie" | "externaliser" | "fusionner" | "supprimer";

export interface Card {
  id: string;
  category: string;
  categoryEmoji: string;
  title: string;
  subtitle?: string;
  amountLabel: string;        // "~7 Md€ / an"
  amountValue: number;        // 7000000000 (pour les calculs)
  perCitizen: string;         // "~103€ par Français / an"
  context: string;            // 2-3 phrases factuelles
  equivalence?: string;       // "= le budget de 3 ministères de la Culture"
  sources: Source[];
  level2CommunityData?: {     // rempli après agrégation Niv.1
    ok: number;               // pourcentage
    aRevoir: number;
  };
}

export interface Source {
  label: string;
  url?: string;
}

export interface Deck {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  cardIds: string[];
}

export interface Vote {
  cardId: string;
  direction: SwipeDirection;
  level: 1 | 2 | 3;
  voteLevel1?: VoteLevel1;
  voteLevel2?: VoteLevel2;
  prescription?: Prescription;  // Niv.3 only
  audit?: {                     // Niv.3 only
    proportioned: boolean;
    legitimate: boolean;
    alternativeExists: boolean;
  };
  timestamp: number;
  durationMs: number;           // temps passé sur la carte
}

export interface GameSession {
  id: string;
  deckId: string;
  level: 1 | 2 | 3;
  votes: Vote[];
  startedAt: number;
  completedAt?: number;
  archetype?: Archetype;
}

export interface Archetype {
  id: string;
  emoji: string;
  name: string;
  quote: string;
  level: 1 | 2 | 3;
}

export interface PlayerProfile {
  totalSessions: number;
  totalCards: number;
  totalCut: number;           // Md€ cumulés "à revoir"
  totalKept: number;          // Md€ cumulés "OK"
  currentArchetype?: Archetype;
  unlockedLevel: 1 | 2 | 3;
  categoriesPlayed: string[];
  badges: string[];
}
```

---

## Données des cartes — format JSON

Le master deck complet (80 cartes, 8 catégories) est documenté dans `MASTER-DECK-BUDGET-SWIPE.md`.
Voici la structure JSON à générer pour `src/data/decks.json` :

```json
{
  "cards": [
    {
      "id": "def-01",
      "category": "Défense",
      "categoryEmoji": "🛡️",
      "title": "Dissuasion nucléaire",
      "subtitle": "Force de frappe · SNLE · Missiles",
      "amountLabel": "~7 Md€ / an",
      "amountValue": 7000000000,
      "perCitizen": "~103€ / Français / an",
      "context": "La France maintient une force de dissuasion nucléaire autonome...",
      "equivalence": "= le budget annuel de 3 ministères de la Culture",
      "sources": [
        { "label": "LPM 2024-2030", "url": "https://..." },
        { "label": "Vie-publique.fr" }
      ]
    }
  ],
  "decks": [
    {
      "id": "defense",
      "name": "Défense",
      "emoji": "🛡️",
      "description": "Armée, nucléaire, OPEX, cyber, OTAN",
      "cardIds": ["def-01", "def-02", "..."]
    }
  ],
  "archetypes": {
    "level1": [
      {
        "id": "austere",
        "emoji": "🪚",
        "name": "L'Austéritaire",
        "quote": "Pour toi, tout est à revoir.",
        "condition": "aRevoir > 80%"
      }
    ]
  }
}
```

---

## Prompts Claude Code — Sprint 1

Utilise ces prompts séquentiellement dans Claude Code. Chaque prompt = une session de travail.

### Prompt 1 — Bootstrap du projet

```
Initialise le projet Next.js 15 avec App Router dans le repo courant.

Stack : TypeScript strict, Tailwind CSS 4, shadcn/ui, framer-motion, zustand, @use-gesture/react.

Crée la structure de fichiers décrite dans CLAUDE.md.
Crée le Dockerfile et docker-compose.yml pour un deploy Coolify (output: standalone).
Configure next.config.ts avec output: "standalone".
Configure tailwind avec la palette dark définie dans CLAUDE.md.
Initialise shadcn/ui avec le thème dark.

Ne crée PAS encore les composants métier, juste le squelette :
- Layout root avec la font (Geist ou Space Grotesk), dark bg, metadata
- Pages vides avec des placeholders pour : /, /play, /play/[deckId], /results, /profile
- BottomNav component avec 4 onglets (Jouer, Profil, Classement, À propos)
- Les types TypeScript complets (src/types/index.ts)
- Le fichier JSON vide avec la structure des decks (src/data/decks.json) — mets 3 cartes exemple

Vérifie que `npm run build` passe et que le Dockerfile build correctement.
```

### Prompt 2 — Composant SwipeCard (le cœur)

```
Crée le composant SwipeCard.tsx — c'est le composant central du jeu.

Spécifications :
- Carte draggable avec framer-motion (useMotionValue + useDragControls ou drag prop)
- Physique de swipe : spring animation, rotation proportionnelle au déplacement horizontal
- Seuil de déclenchement : 100px de déplacement = vote validé
- Feedback visuel pendant le drag :
  - Swipe gauche : teinte verte progressive + icône 🛡️ "OK" qui apparaît en stamp
  - Swipe droite : teinte rouge/orange progressive + icône 🪚 "À revoir" en stamp
- Animation de sortie : la carte s'envole dans la direction du swipe (overshoot + fade)
- Carte suivante visible en dessous (scale 0.95, opacity 0.7) pour donner l'effet "pile"
- Tap sur la carte = ouvre le détail (callback onTap)

La carte affiche :
- Tag catégorie (emoji + nom) en haut à gauche
- Titre de la dépense (bold, 20px)
- Sous-titre optionnel (gray)
- Montant (gros, vert émeraude)
- Coût par citoyen (plus petit, gris)
- Texte de contexte (2-3 lignes, 14px)
- Indicateurs gauche/droite en bas

Mobile-first, optimisé touch. Doit être fluide à 60fps.
Teste avec les 3 cartes exemple du JSON.

note : les maquettes HTML des pages sont dans Maquettes/
```

### Prompt 3 — SwipeStack + logique de session

```
Crée SwipeStack.tsx et le store Zustand gameStore.ts.

SwipeStack :
- Gère la pile de cartes (affiche la carte courante + la suivante en dessous)
- Barre de progression en haut (X/10 cartes)
- Tag du niveau en cours ("Niveau 1")
- Bouton fermer (X) pour quitter la session
- Quand toutes les cartes sont swipées → redirige vers /results

gameStore (Zustand) :
- État : session courante, deck chargé, carte courante (index), votes[], niveau, profil joueur
- Actions : startSession(deckId, level), recordVote(cardId, direction), nextCard(), completeSession()
- Computed : currentCard, progress, sessionStats (nb OK, nb à revoir, totalCut, totalKept)
- Calcul d'archétype à la fin de session (basé sur les ratios de votes)

Hooks :
- useSwipeGesture.ts : encapsule la logique de détection de direction + seuil
- useArchetype.ts : retourne l'archétype basé sur les votes de la session

Crée aussi src/lib/deckUtils.ts :
- shuffleDeck(cardIds) — Fisher-Yates shuffle
- drawSession(deck, count=10) — tire N cartes aléatoires d'un deck
- getCardsByCategory(cards, category) — filtre

Intègre le tout dans /play/[deckId]/page.tsx : charge le deck, démarre la session, affiche SwipeStack.
```

### Prompt 4 — Écran résultats + archétype

```
Crée ResultScreen.tsx et la page /results.

Écran de résultats Niveau 1 :
1. Header festif : "Session terminée !" avec des confettis (animation CSS ou canvas léger)
2. Carte archétype centrée :
   - Grand emoji
   - Nom de l'archétype
   - Citation entre guillemets
   - Bouton partager (icône, non fonctionnel pour l'instant)
3. Stats de session :
   - "10 cartes swipées en Xmin Ys"
   - Donut chart simple (CSS conic-gradient) : % OK (vert) vs % à revoir (rouge)
   - Montant total coupé / gardé
4. Deux CTA empilés :
   - "Continuer (nouveau deck)" → outline button → retour /play
   - "Passer au Niveau 2 →" → filled green button (disabled pour le MVP, badge 🔒)
5. Liste dépliable des 10 cartes avec le verdict (mini icône par carte)

Archétypes Niveau 1 à implémenter :
- 🪚 L'Austéritaire (à_revoir > 80%)
- 🛡️ Le Gardien (ok > 80%)
- ⚖️ L'Équilibriste (~50/50, entre 40-60%)
- 🔥 Le Speedrunner (session < 60 secondes)
- Default : ⚖️ L'Équilibriste

Utilise le gameStore pour récupérer les données de session.
Le bouton "Continuer" relance une session avec un nouveau shuffle du même deck.

Maquette html page résultats = Maquettes/6-RESULTATS.html
```

### Prompt 5 — Home + sélection de deck

```
Crée la page d'accueil (/) et la page de sélection (/play). (voir modèles maquettes html dans Maquettes/)

Page Home :
- Hero section : emoji 🪚 + titre "Budget Swipe" + sous-titre "La Tronçonneuse de Poche"
- Texte d'accroche : "Swipe les dépenses publiques. Coupe ou protège. Découvre ton profil."
- Grand CTA vert "Commencer une session →"
- Stats placeholder : "X sessions jouées · Y cartes swipées" (valeurs en dur pour le proto)
- Chips scrollables horizontalement avec les 8 catégories (emoji + nom)
- BottomNav en bas

Page /play (sélection de deck) :
- Toggle "Mode aléatoire" en haut (mélange toutes les catégories)
- Grille 2 colonnes des 8 catégories
- Chaque carte : emoji, nom, "X cartes", mini barre de progression
- Sélecteur de niveau (pills) : "Niveau 1" (actif), "Niveau 2" (🔒), "Niveau 3" (🔒)
- CTA "Lancer la session" en bas

Quand le joueur clique sur une catégorie + "Lancer" → navigue vers /play/[deckId]
Le mode aléatoire tire 10-12 cartes de toutes les catégories.
```

### Prompt 6 — Intégration des 80 cartes

```
Convertis le master deck complet (80 cartes) en JSON.

Le fichier source est MASTER-DECK-BUDGET-SWIPE.md dans le repo (je vais le copier).
Parse chaque carte et génère src/data/decks.json avec :
- 80 objets Card avec tous les champs (id, category, title, amounts, context, sources, equivalence)
- 8 objets Deck avec leurs cardIds respectifs
- Les archétypes par niveau

IDs des cartes : catégorie abrégée + numéro (def-01, ene-01, san-01, soc-01, edu-01, sec-01, eta-01, cul-01)
IDs des decks : defense, energie, sante, social, education, securite, etat, culture

Vérifie que le jeu fonctionne avec les 80 cartes.
```

### Prompt 7 — CardDetail (bottom sheet)

```
Crée CardDetail.tsx — vue détail qui s'ouvre quand on tape sur une carte. (voir 3-DETAIL.html)

Bottom sheet animé (framer-motion AnimatePresence) :
- Slide up depuis le bas, fond overlay semi-transparent
- Drag handle en haut pour fermer (drag down to dismiss)
- Contenu scrollable :
  1. Tag catégorie
  2. Titre + montant (pill verte)
  3. Coût par citoyen (pill grise)
  4. Section "Contexte" — texte complet
  5. Section "Équivalence" — avec icône 📊
  6. Section "Sources" — liens cliquables (ouvrent dans un nouvel onglet)
  7. Barre d'actions en bas (sticky) : boutons "🛡️ OK" et "🪚 À revoir"

Les boutons de la barre d'actions déclenchent le vote ET ferment le bottom sheet.
Le swipe reste possible même quand le detail est fermé.
```

---

## Checklist de validation Sprint 1

À la fin du Sprint 1, le proto doit permettre de :

- [ ] Ouvrir la home et comprendre le concept en 5 secondes
- [ ] Choisir une catégorie ou le mode aléatoire
- [ ] Swiper 10 cartes avec un feedback visuel fluide (60fps)
- [ ] Taper une carte pour voir le détail + sources
- [ ] Voir son résultat + archétype à la fin
- [ ] Relancer une session
- [ ] Le tout fonctionne sur mobile (iPhone Safari + Android Chrome)
- [ ] Le tout se build dans Docker et se déploie sur Coolify

---

## Workflow quotidien Claude Code

```
# Matin : pull + session Claude Code
cd tronconneuse
git pull
claude  # lance Claude Code

# Copier-coller le prompt du jour (Prompt 1, 2, 3...)
# Claude Code travaille, tu review en live
# Tester : npm run dev → ouvrir sur mobile (ngrok ou réseau local)

# Fin de session : commit + push
git add -A
git commit -m "feat: [description du prompt]"
git push

# Coolify : auto-deploy sur push (configurer le webhook GitHub)
```

---

## Config Coolify

Dans Coolify, crée un nouveau service :
- **Type** : Docker Compose
- **Repo** : https://github.com/pixeeplay/tronconneuse/
- **Branch** : main
- **Build Pack** : Docker Compose
- **Port** : 3000
- **Domain** : nicoquipaie.pixeeplay.fr
- **Auto-deploy** : ON (sur push GitHub)

---

## Ce qui est hors scope Sprint 1 (= Sprint 2 & 3)

- Niveau 2 (4 directions de swipe)
- Niveau 3 (micro-audit post-swipe)
- Persistance en base de données (Drizzle + PostgreSQL)
- Authentification
- Profil joueur persistant
- Classement communautaire
- Partage social (OG image generation)
- Onboarding / tutoriel
- Analytics / tracking
- PWA / offline

---

*Brief prêt pour Claude Code. Copie CLAUDE.md à la racine du repo et lance les prompts dans l'ordre.*

*— Seb · Mars 2026*
