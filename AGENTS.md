# ATLAS — working notes

Single-file browser app: `index.html` (Three.js r128 + OrbitControls from jsDelivr,
IndexedDB). **No build step, no package manager, no framework.** Keep it that way —
the artifact must stay openable as a plain published page.

## Run it here

```bash
docker compose -f docker-compose.base44.yml up -d
```

A static file server exposes the cloned source on host port 3000. There is no
hot reload: after editing `index.html`, reload the preview. `docker compose ps`
must show `web` as healthy; it probes `/index.html` over HTTP.

## Data — do not break this

- IndexedDB `atlas`, version 1, object store `kv`, single key `ws`.
- `ws = { id, name, nodes[], links[], prefs{} }`
- `node = { id, title, cat, color, pos[3], body, created, modified, draw{h, strokes[]}, paper, view{z,x,y} }`
- `link = { id, a, b, label }` — `a`/`b` are node ids.
- `prefs = { hidden[], navShut, tool{t,c,W,a}, pinch, cam{p,t} }`

Any new field is optional and must degrade gracefully when absent; never rename or
re-shape existing keys, and never change the database name or store. A workspace is
only seeded when `kv.get('ws')` returns nothing, so existing work is never replaced.
`clean()`/`cleanDraw()`/`cleanView()` sanitise untrusted input on load and import —
route anything merged from JSON through them.

## Non-obvious implementation notes

- **Drawing space** is a fixed 1000×1300 sheet (`PW`/`PH`); zoom and pan are a view
  transform only. Strokes with `v: 2` store their real width; legacy strokes keep the
  old ×4 multiplier for highlighter/eraser. Keep both paths.
- **Card faces** are canvas textures painted by `paintFace()`, which early-returns
  unless the node's signature (title, category, colour, body, link count) changed.
  Redrawing every frame is the fastest way to make this app feel slow.
- **Rendering is on demand**: `frame()` only calls `renderer.render` when the camera
  moved, a tween is running, or `need` was set by a mutation. Preserve that flag
  discipline when adding state changes.
- **Cards yaw-billboard** toward the camera with a clamped pitch, so text stays
  readable while the cards still read as objects. Link endpoints are trimmed to the
  card border with the card's own world basis.
- **Pointer model**: `pointerdown` is captured on the canvas *before* OrbitControls
  sees it, so dragging a card never orbits, and orbiting never moves a card. Card
  hits disable `ctl.enabled` and re-enable it on release.
- **Camera framing** targets the band left free by the panels (`visibleRect()` /
  `viewPan()`), not the window centre — a fit must not hide cards under the rail.
- Notebook transitions are pure CSS transforms from the card's projected rect
  (`cardScreenRect`); everything is skipped when `prefers-reduced-motion` is set.

## Verify before claiming a change works

Drive the app, don't just read the code. In the preview, at minimum:

1. Load with an empty profile → the seed workspace appears (4 concepts, 3 links).
2. Click a card → panel opens, cobalt outline, unrelated cards dim, links emphasise.
3. Drag a card → position changes, camera does not; drag empty space → camera
   orbits, cards do not.
4. Fit / Focus / Reset keep every card inside the band the panels leave visible.
5. Double-click a card → notebook grows out of the card; draw a stroke, undo it,
   change paper, go back to the map; reload and confirm the note and drawing persist.
6. Delete a concept (button or `Del`, twice) → its links disappear too.

`index.html` can also be exercised headlessly against the running container with
`ghcr.io/puppeteer/puppeteer` (`--network host`) when the preview budget is spent.
