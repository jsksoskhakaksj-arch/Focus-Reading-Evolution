# AGENTS.md

## What this repo is
A single-file static web app (Thai reading-timer PWA). There is **no build step, no package manager, no dependency install**. The whole app lives in `index.html` (~350 KB, inline CSS/JS/canvas). Supporting files: `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

## Running it (Base44 sandbox)
`docker compose -f docker-compose.base44.yml up -d` → http://localhost:3000

- `web` is `nginx:alpine` serving the repo files bind-mounted into `/usr/share/nginx/html` (read-only, one mount per file so `.git` is not exposed). Edits to those files appear on the next page load — no restart needed, no watcher.
- Healthcheck probes `/index.html` with the image's busybox `wget` (nginx:alpine has no curl).
- SPA note: nginx only maps `/` and the real filenames. The app has no client-side routes, so no `try_files` fallback is needed.

## Non-obvious behaviours
- **Service worker caching**: `sw.js` (`CACHE = 'fre-v2'`) serves the cached copy first, so a returned visitor may see a stale `index.html` after an edit. A hard reload (cache `reload`) bypasses it; bumping `CACHE` in `sw.js` busts it. The app also shows a "new version" bar when `sw.js` changes.
- **State is all local**: app data lives in `localStorage` (`fre.state.v1`, `fre.skin`, `fre.deco`, …). Nothing is server-side, so verification must read/write `localStorage` and restore what a test changed.
- **Cloud features are optional and already configured**: `var CLOUD = { url, key }` near the top of the script holds a public Supabase URL + publishable (anon) key. Login/leaderboard only work if that Supabase project has run `supabase.sql` — that file is **not in this repo**, so those screens fall back to a "not connected" card when it is missing. The rest of the app is fully usable without it. No external credential is needed to run or preview the app.
- `README.md` is the user-facing Thai doc; keep its instructions (GitHub Pages, PWA install) accurate rather than replacing them.
