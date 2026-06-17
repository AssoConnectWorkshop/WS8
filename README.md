# WS1

Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript, with Supabase as the
database, deployed on Netlify.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (legacy JWT) |

These must also be set in **Netlify → Site → Environment variables** before the
first deploy.

## Stack notes

- **App Router** — server components by default; add `'use client'` only where
  interactivity is needed.
- **Tailwind v4** — configured via `@import "tailwindcss"` in
  `src/app/globals.css`.
- **Supabase** — `@supabase/ssr` clients live in `src/lib/supabase/`
  (`server.ts` for server components/actions, `client.ts` for the browser).
- **AssoConnect** — server-only client in `src/lib/assoconnect.ts`. See
  [`docs/assoconnect-api.md`](docs/assoconnect-api.md) for the API reference.
- **Config-driven** — navigation and site metadata come from
  `src/config/site.ts`.

## Deployment

Netlify builds with `@netlify/plugin-nextjs` (see `netlify.toml`). The
production branch is `main`.
