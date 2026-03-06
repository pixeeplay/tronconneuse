# Plan d'Action -- La Tronconneuse de Poche

**Derniere mise a jour :** 2026-03-07

---

## Sprints termines (3-26) -- 160 items

| Sprint | Objectif                                                           | Items |
| ------ | ------------------------------------------------------------------ | ----- |
| 3-9    | Core game, auth, community, 330 cartes                             | 38    |
| 10     | Refacto data (split decks.json)                                    | 1     |
| 11     | Hotfixes critiques (store atomique, archetypes, guards)            | 10    |
| 12     | Securite (headers, Zod, rate limiting, error boundaries)           | 8     |
| 13     | Accessibilite WCAG 2.1 AA (clavier, focus, reduced motion)         | 9     |
| 14     | Contenu & progression (badges, achievements, localStorage v2)      | 6     |
| 15     | Performance & DX (lazy load, RSC, favicon, tutoriel)               | 7     |
| 16     | DB & migrations (9 index, connection pool, Drizzle migrations)     | 3     |
| 17     | Communaute donnees reelles + 5 bugfixes                            | 9     |
| 18     | Sync multi-device + Analytics self-hosted + fix liens infos        | 8     |
| 19     | SEO-03 OG dynamique profil + UX-30 Leaderboard vitesse             | 2     |
| 20     | Landing page polish, SEO ouverture, onboarding fix                 | 10    |
| 21     | Conformite & Qualite (RGPD, tests, CI, sitemap, archetype fix)     | 9     |
| 22     | Securite & SEO (CSP, auth dashboard, canonical, JSON-LD, DB fixes) | 10    |
| 23     | Accessibilite & UX (skip nav, aria, reduced motion, skeletons)     | 9     |
| 24     | Performance & Architecture (lazy load, split, cleanup, barrel)     | 9     |
| 25     | PWA & Resilience (offline, install, SW update, timeouts, API std)  | 10    |
| 26     | Polish & Tests (75 tests, cardId validation, OG decks, sourceUrls) | 6     |

---

## Items deferes

| Ref     | Description                                                         |
| ------- | ------------------------------------------------------------------- |
| A11Y-02 | Audit contrastes : rehausser muted text, amber/blue sur fond sombre |
| TEST-06 | Tests E2E Playwright : flow complet swipe -> results                |
| RGPD-04 | Cookie consent banner (pas requis, analytics sans cookies)          |
| SEC-07  | CSRF tokens (deja protege par NextAuth + CORS same-origin)          |
| PWA-06  | Background sync (Periodic Sync API, support limite)                 |

---

## Post-MVP / V2

| Item                  | Effort | Ref    | Description                                           |
| --------------------- | ------ | ------ | ----------------------------------------------------- |
| Mode Duel (2 joueurs) | L      | UX-31  | Swipe simultane + comparaison resultats (WebSocket)   |
| Rate limiting Redis   | M      | SEC-08 | Remplacer Map in-memory par Redis (scalabilite)       |
| Monitoring erreurs    | S      | ERR-04 | Integration Sentry ou equivalent                      |
| API ouverte           | L      | API-03 | Endpoints publics documentees pour reutilisation data |
