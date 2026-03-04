# 🎨 BRIEF PROTOTYPAGE — Budget Swipe

> **Outil** : Google Stitch (stitch.withgoogle.com)
> **Projet** : Budget Swipe — mini-jeu pour nicoquipaie.co
> **Auteur** : Seb · Mars 2026
> **Statut** : Écrans existants = page Card + page Détail · Reste à maquetter = tout le reste

---

## Contexte produit (à coller en System Prompt Stitch)

Budget Swipe est un mini-jeu mobile-first de type « Tinder pour les dépenses publiques françaises ». Le joueur swipe des cartes de dépenses budgétaires : gauche = « OK pour moi » (🛡️), droite = « À revoir » (🪚). Le ton est irrévérencieux mais sourcé, le style visuel est moderne, dark mode, avec des accents néon/fluo (vert = garder, rouge/orange = couper). Le jeu fait partie de la plateforme nicoquipaie.co (Next.js / Tailwind). Public cible : 18-45 ans, mobile, français.

Palette suggérée : fond sombre (#0F172A ou #1A1A2E), cartes blanches ou dark card (#1E293B), accents : vert émeraude (#10B981), rouge corail (#EF4444), bleu info (#3B82F6), jaune warning (#F59E0B). Typo : Inter ou system sans-serif. Coins arrondis (16px), ombres douces, micro-animations (swipe physics, confettis).

---

## PARTIE 1 — Prompts Stitch écran par écran

Chaque section ci-dessous contient un **prompt optimisé** à copier-coller dans Stitch pour générer l'écran. Les prompts sont en anglais (Stitch fonctionne mieux en EN).

---

### ÉCRAN 0 — Landing / Home du jeu

**Ce qui est affiché** : Point d'entrée du jeu. Hero section avec le nom "Budget Swipe", un sous-titre accrocheur, un CTA principal "Commencer" et des stats communautaires (nb sessions jouées, nb cartes swipées). En bas : aperçu de 3 catégories de decks avec icônes.

**Prompt Stitch** :
```
Mobile app home screen for a budget game called "Budget Swipe — La Tronçonneuse de Poche". Dark theme (#0F172A background). 

Hero section with:
- A chainsaw emoji 🪚 and shield emoji 🛡️ flanking the title
- Subtitle: "Swipe les dépenses publiques. Coupe ou protège. Découvre ton profil."
- Large green CTA button "Commencer une session" 
- Below: small stats bar "12 847 sessions jouées · 154 208 cartes swipées"

Below hero: horizontal scrollable category chips/cards with emojis:
🛡️ Défense · ⚡ Énergie · 🏥 Santé · 👶 Social · 📚 Éducation · ⚖️ Justice · 🏛️ État · 🎭 Culture

Bottom navigation bar with 4 tabs: Jouer (active), Profil, Classement, À propos

Style: modern, rounded corners, subtle gradients, neon green (#10B981) accents on dark background. Mobile-first, iOS-like feel.
```

---

### ÉCRAN 1 — Sélection de deck / catégorie

**Ce qui est affiché** : Grille de 8 catégories thématiques. Chaque catégorie = une carte avec icône, nom, nombre de cartes, et une barre de progression (% joué). Un toggle "Mode aléatoire" en haut.

**Prompt Stitch** :
```
Mobile screen: deck/category selection for a budget card game. Dark theme (#0F172A).

Top: toggle switch "Mode aléatoire" (mixes all categories) with a shuffle icon.

Below: 2-column grid of 8 category cards. Each card has:
- Large emoji icon at top
- Category name in bold white
- "10 cartes" subtitle in gray
- Small progress bar (green fill) showing % completed
- Lock icon on categories not yet unlocked (if any)

Categories:
1. 🛡️ Défense & Souveraineté (10 cartes, 100% done ✓)
2. ⚡ Énergie & Transition (10 cartes, 60%)
3. 🏥 Santé & Hôpital (10 cartes, 0%)
4. 👶 Protection sociale (12 cartes, 0%)
5. 📚 Éducation & Recherche (10 cartes, 0%)
6. ⚖️ Sécurité & Justice (8 cartes, 0%)
7. 🏛️ Fonctionnement de l'État (10 cartes, 0%)
8. 🎭 Culture & Transports (10 cartes, 0%)

Bottom: green CTA "Lancer la session" button. Below: level selector pills: "Niveau 1" (active/green), "Niveau 2" (locked/gray), "Niveau 3" (locked/gray).

Style: cards with subtle border, dark card background (#1E293B), rounded 16px, modern.
```

---

### ÉCRAN 2 — Swipe Card (Niveau 1) ← EXISTANT, à affiner

**Ce qui est affiché** : La carte principale de jeu. Swipable gauche/droite. Affiche : catégorie (tag), titre de la dépense, montant, coût par citoyen, phrase de contexte, indicateurs de direction de swipe.

**Prompt Stitch** :
```
Mobile game screen: swipable budget card (Tinder-style). Dark background (#0F172A).

Top bar: progress dots (●●●○○○○○○○ — 3/10), category label "DÉFENSE" in a small tag, and a close X button.

Center: large floating card (white or #1E293B) with rounded corners (20px) and subtle shadow. Card content:
- Top: category tag "🛡️ DÉFENSE — NUCLÉAIRE" in small caps
- Title: "Dissuasion nucléaire" in bold 20px
- Subtitle: "Force de frappe · Sous-marins SNLE · Missiles"
- Large amount: "💰 ~7 Md€ / an" in bold green
- Per-citizen cost: "👤 ~103€ par Français / an" in gray
- Context text (2 lines): "La France est l'une des 5 puissances nucléaires. Ce budget garantit la crédibilité de la dissuasion."
- Equivalence: "📊 = le budget de 3 ministères de la Culture"

Below card: two action hints with arrows
- Left arrow + shield emoji: "OK pour moi"  (green tint)
- Right arrow + chainsaw emoji: "À revoir" (red/orange tint)

Bottom: "Tap la carte pour en savoir plus" in small gray text.

The card should look slightly tilted (2-3 degrees) as if being held, ready to swipe. Modern, gamified, clean design.
```

---

### ÉCRAN 2b — Swipe Card mid-gesture (feedback visuel)

**Ce qui est affiché** : La carte pendant un swipe, inclinée, avec un stamp overlay.

**Prompt Stitch** :
```
Same budget card as previous, but tilted 15 degrees to the right during a swipe gesture. 

Overlay stamp appearing on the card: "🪚 À REVOIR" in large red/orange rotated text (like a rubber stamp effect, 45 degree angle, semi-transparent).

Background card underneath slightly visible (next card in deck, peeking).

Red/orange glow on the right edge of the screen indicating "swipe right = cut" direction.

Dark background, same style as previous screen.
```

---

### ÉCRAN 3 — Détail de la carte (expand) ← EXISTANT, à affiner

**Ce qui est affiché** : Vue détaillée quand le joueur tape sur une carte. Slide up modal ou plein écran. Contexte complet, sources, liens vers Feed/Simulateur.

**Prompt Stitch** :
```
Mobile full-screen detail view for a budget card. Dark theme. Slide-up modal style with rounded top corners.

Content:
- Top: drag handle bar + close button
- Category tag: "🛡️ DÉFENSE — NUCLÉAIRE"
- Title: "Dissuasion nucléaire" (24px bold)
- Amount badge: "~7 Md€ / an" in a green pill
- Per-citizen: "~103€ par Français / an" in gray pill

Sections with subtle dividers:
1. "Contexte" — 3-4 lines of explanatory text about nuclear deterrence
2. "📊 Équivalence" — "= le budget annuel de 3 ministères de la Culture"
3. "📎 Sources" — clickable links: "Vie-publique.fr", "Sénat", "Ministère des Armées"

Bottom sticky bar with 2 buttons:
- "🛡️ OK pour moi" (green outline button)
- "🪚 À revoir" (red outline button)

And a text link: "Voir sur le Feed →" and "Combien JE paye → Simulateur"

Clean, informational, dark card style.
```

---

### ÉCRAN 4 — Swipe Card (Niveau 2 — 4 directions)

**Ce qui est affiché** : Carte enrichie avec les résultats communautaires du Niveau 1, et 4 directions de swipe au lieu de 2.

**Prompt Stitch** :
```
Mobile game screen: enhanced budget card with 4-direction swipe (Level 2). Dark background.

Same card layout as Level 1 but with additions:
- Community results bar below the context: "🗳️ Niveau 1 : 62% à revoir · 38% OK" with a horizontal bar chart (red/green split)
- "📊 Équivalence" line visible on the card itself

Four directional hints around the card (compass-style):
- ⬆️ Top: "📈 RENFORCER" (blue arrow up)
- ⬅️ Left: "🛡️ OK" (green arrow left)  
- ➡️ Right: "🪚 RÉDUIRE" (orange arrow right)
- ⬇️ Bottom: "❌ INJUSTIFIÉ" (red arrow down)

Progress indicator at top: "Niveau 2 · Carte 4/12"

The card is slightly larger to accommodate the extra info. Modern, dark, game UI.
```

---

### ÉCRAN 5 — Micro-audit (Niveau 3 — post-swipe)

**Ce qui est affiché** : Après le swipe en Niveau 3, un mini questionnaire apparaît (3 toggles + 1 choix).

**Prompt Stitch** :
```
Mobile screen: post-swipe micro-audit questionnaire (Level 3). Dark theme.

Top: card summary mini-preview (small, collapsed): "🪚 Dissuasion nucléaire — 7 Md€" with a red "À réduire" tag.

Below: 3 yes/no toggle questions, each on its own row with clean pill-style toggles:
1. "Le montant est proportionné ?" — [OUI] [NON]
2. "La mission est légitime ?" — [OUI] [NON] 
3. "Une alternative moins coûteuse existe ?" — [OUI] [NON]

Below toggles: "Quelle solution recommandes-tu ?" section with 4 selectable chips (single select):
- "Réduire de moitié"
- "Externaliser"  
- "Fusionner avec un autre poste"
- "Supprimer"

Bottom: green CTA "Valider mon audit →"

Progress: "Niveau 3 · Carte 2/8 · Audit"

Clean, form-like but gamified. Dark cards, green accents.
```

---

### ÉCRAN 6 — Résultats de session (Niveau 1)

**Ce qui est affiché** : Écran de fin après 10-12 cartes. Résumé rapide + archétype + CTA.

**Prompt Stitch** :
```
Mobile results screen after completing a budget card game session. Dark theme, celebratory feel.

Top: confetti/sparkle animation placeholder, "Session terminée !" in large text.

Archetype card (centered, highlighted):
- Large emoji: ⚖️
- Archetype name: "L'Équilibriste"  
- Quote: "Tu pèses le pour et le contre."
- Share button icon (share to social)

Stats summary:
- "10 cartes swipées en 1min 47s"
- Simple donut chart: 🛡️ OK 40% (green) · 🪚 À revoir 60% (red/orange)

Two prominent CTAs stacked:
1. "Continuer (nouveau deck)" — outline button
2. "Passer au Niveau 2 →" — filled green button with lock-unlock animation

Small text link: "Voir le détail de mes choix ↓"

Bottom: collapsible list of all 10 cards with their swipe direction (mini icons).

Modern, reward-screen style, dark with green/gold accents.
```

---

### ÉCRAN 7 — Résultats de session (Niveau 2 — enrichi)

**Prompt Stitch** :
```
Mobile results screen for Level 2 budget game. Dark theme, more detailed than Level 1.

Top: "Session Niveau 2 terminée" with star rating earned (3/5 stars).

Archetype (updated): 
- 🎯 "Le Chirurgien"
- "Tu coupes dans le gras, pas dans l'os."

Horizontal bar chart by category showing distribution:
- 🛡️ OK: 3 cartes (green bars)
- 🪚 Réduire: 4 cartes (orange bars)  
- 📈 Renforcer: 2 cartes (blue bars)
- ❌ Injustifié: 1 carte (red bars)

"Tes choix vs la communauté" comparison section:
- Small radar/spider chart comparing user profile to community average

Three CTAs:
1. "Nouveau deck Niveau 2" (outline)
2. "Passer au Niveau 3 — Mode Citoyen 🔓" (filled, green, after 3 sessions)
3. "Partager mon profil" (social share button)

Dark, data-rich but not cluttered.
```

---

### ÉCRAN 8 — Résultats Niveau 3 (rapport d'audit)

**Prompt Stitch** :
```
Mobile results screen for Level 3 "citizen audit" mode. Dark theme, report-style.

Top: "Audit citoyen terminé" with a badge icon "🏅 Auditeur".

Summary card:
- "Sur 8 dépenses auditées :"
- "4 réductions · 1 suppression · 1 fusion · 2 renforcées"
- "💰 Impact estimé : -12,4 Md€ d'économies, soit ~182€/contribuable"

Scrollable audit report: list of 8 items, each showing:
- Card title + amount
- Verdict icon (🪚/🛡️/📈/❌)
- Prescription tag ("Réduire de moitié" etc.)

Bottom CTAs:
1. "📊 Voir l'impact sur MA contribution → Simulateur" (blue button)
2. "📝 Publier cet audit sur le Feed (+XP)" (green button)
3. "🔄 Rejouer avec un autre deck" (outline)

Professional, dark, audit-report aesthetic.
```

---

### ÉCRAN 9 — Profil joueur

**Ce qui est affiché** : Page profil avec stats cumulées, archétype actuel, historique, badges.

**Prompt Stitch** :
```
Mobile profile screen for budget game player. Dark theme.

Top: user avatar placeholder + username + "Membre depuis mars 2026"

Two side-by-side stat boxes:
- Left: "🏆 XP Contributeur: 1 240 pts" (existing platform XP)
- Right: "🪚 Profil Tronçonneur" (game stats)

Archetype hero card:
- Current archetype: 🎯 "Le Chirurgien" 
- Level badge: "Niveau 2"
- "Affiné sur 47 cartes"

Game stats grid (2x3):
- "23 sessions jouées"
- "47 cartes swipées"  
- "12,4 Md€ coupés"
- "34,8 Md€ gardés"
- "5 catégories jouées"
- "3 audits Niveau 3"

Badges row (horizontal scroll):
- 🪚 "Première coupe" (earned, colored)
- ⚖️ "50/50" (earned)
- 📋 "Auditeur" (earned)
- 🗺️ "Globe-trotter" (locked/gray — play all categories)
- 💀 "Liquidateur" (locked)

"Historique de mes sessions →" link

Bottom nav: Jouer, Profil (active), Classement, À propos.

Clean, dashboard-like, dark with achievement colors.
```

---

### ÉCRAN 10 — Classement communautaire

**Prompt Stitch** :
```
Mobile leaderboard screen for budget game community. Dark theme.

Top tabs: "Archétypes" (active) | "Top coupeurs" | "Cette semaine"

Archetype distribution section:
- Horizontal stacked bar chart showing community distribution:
  🪚 Austéritaires 23% · 🛡️ Gardiens 18% · ⚖️ Équilibristes 34% · 🎯 Chirurgiens 15% · 📈 Investisseurs 10%

"Dépenses les plus coupées" ranking:
1. 🥇 Retraites fonctionnaires — 78% "à revoir"
2. 🥈 Subventions éolien — 71% "à revoir"  
3. 🥉 Audiovisuel public — 69% "à revoir"

"Dépenses les plus protégées" ranking:
1. 🥇 Hôpital public — 89% "OK"
2. 🥈 Éducation nationale — 84% "OK"
3. 🥉 Sécurité civile (pompiers) — 82% "OK"

Bottom: "Ces stats sont basées sur 12 847 sessions anonymisées"

Clean, data visualization focused, dark theme.
```

---

### ÉCRAN 11 — Onboarding / tutoriel (premier lancement)

**Prompt Stitch** :
```
Mobile onboarding screen for a budget swipe game (1 of 3 steps). Dark background with illustration.

Center: large illustration of a hand swiping a card left and right.

Text below:
- Title: "Swipe pour décider"
- Body: "Chaque carte = une dépense publique réelle. Swipe à gauche pour la garder 🛡️, à droite pour la revoir 🪚"

Bottom: 3 pagination dots (first active), "Suivant →" button in green.

Step 2 would show: "Découvre ton profil budgétaire — Es-tu plutôt tronçonneur ou gardien ?"
Step 3 would show: "Monte de niveau — Du swipe instinctif à l'audit citoyen complet"

Minimal, clean, dark, with playful illustrations.
```

---

### ÉCRAN 12 — Partage social (card OG)

**Prompt Stitch** :
```
Social share card (Open Graph image format, 1200x630px aspect ratio). Dark background.

Left side: Large archetype emoji ⚖️ with glowing effect.
Right side:
- "Mon profil Budget Swipe"
- Archetype: "L'Équilibriste"  
- "J'ai swipé 47 dépenses publiques"
- "🪚 28 Md€ coupés · 🛡️ 42 Md€ gardés"
- Small nicoquipaie.co logo + URL at bottom

Vibrant, shareable, eye-catching. Dark with neon green and coral accents. Would look good on Twitter/LinkedIn preview.
```

---

## PARTIE 2 — Inventaire complet des écrans à maquetter

### Vue d'ensemble du parcours utilisateur

```
PREMIER LANCEMENT
  └─ Écran 11 — Onboarding (3 steps)
      └─ Écran 0 — Home du jeu

FLUX PRINCIPAL
  └─ Écran 0 — Home / Landing
      ├─ Écran 1 — Sélection de deck + niveau
      │    └─ Écran 2 — Swipe Card Niveau 1
      │         ├─ Écran 2b — Card mid-swipe (feedback)
      │         ├─ Écran 3 — Détail carte (tap)
      │         └─ Écran 6 — Résultats Niveau 1
      │              ├─ → Nouveau deck (retour Écran 1)
      │              └─ → Passer Niveau 2
      │                   └─ Écran 4 — Swipe Card Niveau 2
      │                        └─ Écran 7 — Résultats Niveau 2
      │                             ├─ → Nouveau deck
      │                             └─ → Passer Niveau 3
      │                                  └─ Écran 2/4 — Swipe + Écran 5 — Micro-audit
      │                                       └─ Écran 8 — Résultats Niveau 3 (audit)
      │                                            ├─ → Simulateur (externe)
      │                                            └─ → Feed (externe)
      ├─ Écran 9 — Profil joueur
      ├─ Écran 10 — Classement communautaire
      └─ Écran 12 — Partage social (généré)

NAVIGATION
  └─ Bottom tab bar : Jouer | Profil | Classement | À propos
```

### Tableau récapitulatif

| # | Écran | Priorité | Statut | Complexité Stitch | Notes |
|---|-------|----------|--------|-------------------|-------|
| 0 | **Home / Landing du jeu** | 🔴 P0 | À faire | Simple | Hero + CTA + catégories — C'est cet écran que tu veux prototyper |
| 1 | **Sélection de deck** | 🔴 P0 | À faire | Simple | Grille 2 colonnes + toggle aléatoire |
| 2 | **Swipe Card Niv.1** | 🟢 Fait | Existant | — | Page "card" existante, à affiner |
| 2b | **Card mid-swipe** | 🟡 P1 | À faire | Moyenne | État intermédiaire du swipe (stamp overlay) |
| 3 | **Détail carte** | 🟢 Fait | Existant | — | Page "détail" existante, à affiner |
| 4 | **Swipe Card Niv.2** | 🟡 P1 | À faire | Moyenne | 4 directions, résultats communautaires |
| 5 | **Micro-audit Niv.3** | 🟡 P2 | À faire | Moyenne | 3 toggles + choix solution |
| 6 | **Résultats Niv.1** | 🔴 P0 | À faire | Simple | Archétype + stats + CTA |
| 7 | **Résultats Niv.2** | 🟡 P1 | À faire | Moyenne | Radar chart, comparaison communauté |
| 8 | **Résultats Niv.3** | 🟡 P2 | À faire | Élevée | Rapport d'audit, passerelles |
| 9 | **Profil joueur** | 🟡 P1 | À faire | Moyenne | Dashboard, badges, stats |
| 10 | **Classement** | 🟡 P2 | À faire | Moyenne | Leaderboard, distributions |
| 11 | **Onboarding** | 🟡 P1 | À faire | Simple | 3 écrans tutoriel |
| 12 | **Share card OG** | 🟡 P2 | À faire | Simple | Image de partage social |

### Priorisation suggérée par sprint

**Sprint 1 — MVP jouable (4-5 écrans)**
1. Écran 0 — Home ← **priorité Stitch maintenant**
2. Écran 1 — Sélection de deck
3. Écran 2 — Swipe Card Niv.1 (affiner l'existant)
4. Écran 3 — Détail (affiner l'existant)
5. Écran 6 — Résultats Niv.1

**Sprint 2 — Niveau 2 + gamification (4 écrans)**
6. Écran 4 — Swipe Card Niv.2
7. Écran 7 — Résultats Niv.2
8. Écran 9 — Profil joueur
9. Écran 11 — Onboarding

**Sprint 3 — Niveau 3 + social (4 écrans)**
10. Écran 5 — Micro-audit Niv.3
11. Écran 8 — Résultats Niv.3
12. Écran 10 — Classement
13. Écran 12 — Share card OG

---

## Notes pour Stitch

**Limites connues de Stitch :**
- Stitch génère 1 écran à la fois → un prompt par écran
- Le mode "Prototypes" (déc. 2025) permet de lier les écrans entre eux
- Export possible vers Figma (one-click) et en HTML/CSS
- 350 générations/mois en mode Standard, 200 en mode Pro Screen
- Pour les interactions de swipe (animations, physics), Stitch ne les simule pas — c'est à implémenter en code (framer-motion / @use-gesture)

**Workflow recommandé :**
1. Générer chaque écran avec les prompts ci-dessus
2. Affiner via l'outil "Annotate" de Stitch (feedback visuel)
3. Exporter vers Figma pour ajustements fins
4. Utiliser le mode "Interactive/Prototypes" pour lier les écrans en un flow cliquable
5. Exporter le code HTML/CSS comme base pour l'intégration Next.js

---

*— Seb · Mars 2026*
