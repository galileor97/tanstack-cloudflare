# TanStack Start + Cloudflare Boilerplate

A minimal full-stack starter using [TanStack Start](https://tanstack.com/start/latest) deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Stack

- **TanStack Start / Router / Query** — SSR, type-safe file-based routing, data fetching
- **React 19** with the React Compiler
- **Cloudflare Workers** — D1 (SQLite), KV, R2 bindings
- **Drizzle ORM** on D1
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives)
- **Biome** for lint/format, **Vitest** for tests
- **Better Auth** — email/password + Google OAuth, database sessions on D1

## Getting started

1. Replace the D1 database, KV namespace and R2 bucket in `wrangler.jsonc` with your own (create them with `wrangler d1 create`, `wrangler kv namespace create` and `wrangler r2 bucket create`).
2. Set your production URL and site name in `src/lib/site.ts`.
3. Install, configure secrets and set up the database:

```bash
pnpm install
cp .dev.vars.example .dev.vars   # fill in the values
pnpm db:generate                 # create the initial migration from the schema
pnpm db:migrate                  # apply it to local D1
pnpm dev
```

Run `pnpm cf-typegen` whenever you change `wrangler.jsonc` or `.dev.vars.example`.

> **Local vs remote bindings:** the bindings in `wrangler.jsonc` have `"remote": true`, so `pnpm dev` talks to your real Cloudflare D1, KV and R2. In that setup, run `pnpm db:migrate:remote` instead of `pnpm db:migrate`. Remove `"remote": true` from a binding to develop against a local copy instead.

## Auth

[Better Auth](https://www.better-auth.com/) is configured in `src/features/auth/server/auth.ts` and mounted at `/api/auth/*`.

- `/sign-in` — email/password sign-in & sign-up, plus "Continue with Google"
- `/dashboard` — example protected page
- Put pages under `src/routes/_authed/` to require a signed-in user (the layout redirects to `/sign-in`)
- `getSession()` (`src/features/auth/functions.ts`) reads the session on the server; `authClient` (`src/features/auth/client.ts`) is the browser client

### Google OAuth

1. Create an OAuth client (type "Web application") in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-domain>/api/auth/callback/google`
3. Put the client ID and secret in `.dev.vars` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

## SEO

Pages are server-rendered, and SEO settings live in one place: **`src/lib/site.ts`** (site name, production URL, description, share image, Twitter handle). Set `url` to your production domain before deploying.

- **Per-page tags:** add `head: () => seo({ title, description })` to a route. `seo()` (`src/lib/seo.ts`) outputs the title, description, Open Graph and Twitter tags.
- **Automatic on every page:** canonical URL and `og:url` (query string removed), `og:site_name`, theme color, icons, and `WebSite` + `Organization` JSON-LD (in `src/routes/__root.tsx`).
- **Private pages:** `seo({ noindex: true })`, or put them under `_authed/`, which is `noindex` by default.
- **`/sitemap.xml`:** generated from the router. It includes every page without path params. Opt a route out with `staticData: { sitemap: false }`, and add dynamic URLs (e.g. from D1) in `getDynamicEntries()` in `src/routes/sitemap[.]xml.ts`.
- **`/robots.txt`:** allows everything except `/api/` and points to the sitemap.
- **Images:** replace `public/og.png` (1200×630), `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png` and `public/favicon.ico` with your own, and update `public/manifest.json`.

## UI

[shadcn/ui](https://ui.shadcn.com/) components (built on [Radix](https://www.radix-ui.com/)) live in `src/components/ui/`: button, input, textarea, label, select, checkbox, radio-group, switch, field, card, dialog, alert-dialog, sheet, dropdown-menu, popover, tooltip, tabs, accordion, table, badge, alert, avatar, separator, skeleton and scroll-area. Toasts use [Sonner](https://sonner.emilkowal.ski/) (`toast()` from `sonner`).

```bash
pnpm dlx shadcn@latest add <component>   # add more components
```

These files are generated; they're excluded from linting and can be overwritten by the CLI.

## Database

Each feature defines its tables in `src/features/<name>/schema.ts`, and `src/db/schema.ts` re-exports them (Better Auth's tables are in `src/features/auth/schema.ts`).

```bash
pnpm db:generate         # generate SQL migrations into ./drizzle
pnpm db:migrate          # apply migrations to local D1
pnpm db:migrate:remote   # apply migrations to remote D1
pnpm db:studio           # browse the local D1 database
```

## Scripts

| Command                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| `pnpm dev`               | Start the dev server on port 3000            |
| `pnpm build`             | Production build                             |
| `pnpm preview`           | Build and preview the production bundle      |
| `pnpm deploy`            | Build and deploy to Cloudflare Workers       |
| `pnpm typecheck`         | TypeScript check                             |
| `pnpm check`             | Biome lint + format check (incl. architecture rules) |
| `pnpm test`              | Run tests                                    |
| `pnpm db:generate`       | Generate a migration from the schema         |
| `pnpm db:migrate`        | Apply migrations to local D1                 |
| `pnpm db:migrate:remote` | Apply migrations to remote D1                |
| `pnpm db:studio`         | Browse the local D1 database                 |
| `pnpm cf-typegen`        | Regenerate Cloudflare `Env` types            |

## Project structure

Code is organized by feature. Routes stay thin and import from features.

```
src/
  routes/                # file-based routes: URLs, loaders, head(), guards
  features/
    auth/
      components/        # sign-in-form, sign-out-button, ...
      server/            # server-only: Better Auth config
      functions.ts       # server functions callable from client code (getSession)
      client.ts          # Better Auth browser client
      schema.ts          # Drizzle tables for this feature
  components/            # shared components (shadcn/ui in components/ui)
  db/                    # D1 client + schema.ts (re-exports feature schemas)
  lib/                   # shared utils: site config, seo, cn
  integrations/          # TanStack Query setup
  router.tsx             # router setup
  server.ts              # Cloudflare Worker entry
```

### Adding a feature

1. Create `src/features/<name>/` with the parts you need (`components/`, `server/`, `functions.ts`, `schema.ts`, ...).
2. Re-export its tables from `src/db/schema.ts`, then run `pnpm db:generate`.
3. Add routes under `src/routes/` that import from the feature.

Conventions (the import rules are enforced by `pnpm check`; see `biome.json`):

- Import feature modules by their direct path (e.g. `@/features/auth/components/sign-in-form`). There are no barrel `index.ts` files, because they pull a whole feature into the main bundle and defeat per-route code splitting.
- Anything that touches `cloudflare:workers`, D1 or secrets goes in `server/`. Client code reaches it only through server functions (`createServerFn`) in `functions.ts`.
- Features don't import each other's internals. Move shared code to `lib/` or `components/`.

## Deployment

1. Set `url` in `src/lib/site.ts` to your production domain.
2. Add production secrets:

   ```bash
   wrangler secret put BETTER_AUTH_SECRET     # openssl rand -base64 32
   wrangler secret put BETTER_AUTH_URL        # e.g. https://your-domain.com
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   ```

3. Add `https://<your-domain>/api/auth/callback/google` as a redirect URI in your Google OAuth client.
4. Apply migrations and deploy:

   ```bash
   pnpm db:migrate:remote
   pnpm deploy
   ```

## AI coding agents

Project conventions for AI agents (Claude Code, Codex, Cursor, …) are in [`AGENTS.md`](AGENTS.md). `CLAUDE.md` just imports it, so there's one file to keep up to date. Update `AGENTS.md` when you change the architecture or commands.

## Credits

Started from [TanStack Faster](https://github.com/Vijayabaskar56/tanstack-start-faster) by [@Vijayabaskar56](https://github.com/Vijayabaskar56), itself inspired by [NextFaster](https://github.com/ethanniser/NextFaster).
