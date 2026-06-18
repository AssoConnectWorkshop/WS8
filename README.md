# WS8

Next.js 15 App Router · TypeScript · Tailwind CSS v4 · Supabase · AssoConnect API · Deployed on Vercel.

**Live:** https://assoconnect-ws1.vercel.app

## Prompt de démarrage

Donne ce prompt à Claude Code (claude.ai/code) pour commencer à coder :

> Lis le README du repo AssoConnectWorkshop/WS8 et aide-moi à construire [décris ton idée ici].

## Stack

| Élément | Détail |
|---|---|
| Framework | Next.js 15 App Router — Server Components par défaut |
| Style | Tailwind CSS v4 — `@import "tailwindcss"` dans `globals.css`, pas de `@apply` sans `@reference` |
| Base de données | Supabase (`@supabase/ssr`) — client server : `src/lib/supabase/server.ts` |
| API CRM | AssoConnect API — client server-only : `src/lib/assoconnect.ts` |
| Config | Navigation et métadonnées dans `src/config/site.ts` |
| Déploiement | Vercel — push sur `main` → production automatique |

## Ce qui est déjà en place

- Table **`ws1_prenoms`** dans Supabase (quelques prénoms de test)
- Client Supabase server-side prêt à l'emploi
- Client AssoConnect API server-side prêt à l'emploi (scope CRM uniquement)
- Page d'accueil avec vérification des connexions Supabase et AssoConnect
- Migrations SQL automatiques au build via `scripts/migrate.mjs`

## Ajouter une table

Crée un fichier dans `supabase/migrations/` avec un timestamp horodaté :

```sql
-- supabase/migrations/20260618120000_ma_table.sql
create table ma_table (
  id bigint generated always as identity primary key,
  nom text not null
);
```

La migration sera appliquée automatiquement au prochain déploiement.

## Variables d'environnement

Déjà configurées dans Vercel — ne pas committer de secrets.

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_PROJECT_REF` | Référence projet (pour les migrations) |
| `SUPABASE_ACCESS_TOKEN` | Token d'accès Supabase (migrations) |
| `ASSOCONNECT_API_KEY` | Clé API AssoConnect (server-only) |
| `ASSOCONNECT_ORGANIZATION_ULID` | ULID de l'organisation AssoConnect (server-only) |

## API AssoConnect

Voir [`docs/assoconnect-api.md`](docs/assoconnect-api.md) pour la référence complète.

Résumé :
- Base URL : `https://app.assoconnect.com/api/v1`
- Auth : header `X-AUTH-TOKEN` (géré automatiquement par `src/lib/assoconnect.ts`)
- Scope : CRM uniquement (contacts, adhérents, organisations)
- Rate limit : 30 req/s
- Les clés sont **server-only** — jamais de `NEXT_PUBLIC_` pour ces variables

## Règles

- `'use client'` seulement si la page a besoin d'interactivité (formulaires, hooks, événements)
- Les secrets ne sont jamais exposés côté client
- Pas de commentaires sauf si le "pourquoi" est non-obvious
