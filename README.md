# ATLAS — Knowledge Workspace

A spatial notebook. Concepts are cards floating in a warm paper space, relationships
are thin lines between them, and every card opens into a full notebook sheet you can
type on and draw on.

One file: `index.html`. No build step, no framework, no account, no server.

## The map

- **Cards** are physical objects: a coloured category edge, a catalogue number, the
  title set in a serif, a short preview of the note, and a link count.
- **Select a card** (click or tap) and its outline turns cobalt, its direct
  connections light up, everything unrelated recedes, and the concept panel opens.
- **Hover** lifts a card slightly and strengthens its outline.
- **Drag** a card to move it through space; drag empty space to orbit; right-drag or
  two-finger drag to pan; scroll to zoom. Dragging a card never rotates the camera.
- **Groups** appear as a faint wash with a small caps plaque naming the category.
  Grouping comes from the category on each concept, and connections are free to cross
  groups.
- **Camera**: `Focus` frames the selected concept and its neighbourhood, `Fit` frames
  the whole map inside the space your panels leave free, `Reset` returns home. Any
  manual camera movement interrupts a camera move in progress.

## The notebook

Opening a card (double-click, or **Open notebook**) grows a sheet out of that card.
Inside you get the full editor: rich text, a 1000×1300 sketch page with ten paper
styles (ruled, grid, dot, isometric, Cornell, staff, engineering, dark…), pen,
highlighter, eraser and pan tools, adjustable stroke width and opacity, colour
swatches, zoom and pan, undo/redo, and clear. Coming back to the map saves
everything and returns the camera to that concept.

## Keys

| Where | Key | Action |
|---|---|---|
| Map | `N` | New concept |
| Map | `C` | Connect the selected concept to another |
| Map | `F` | Focus the selected concept |
| Map | `0` | Fit the whole map |
| Map | `O` | Open the selected concept's notebook |
| Map | `/` | Search |
| Map | `I` | Show/hide the index |
| Map | `Del` / `Backspace` | Delete (press twice to confirm) |
| Map | `Esc` | Cancel connect mode / clear selection |
| Notebook | `P` `L` `E` `H` | Pen, highlighter, eraser, pan |
| Notebook | `+` `-` `0` `F` | Zoom in, out, 100%, fit page |
| Notebook | `Ctrl/⌘ Z` / `Shift Ctrl/⌘ Z` | Undo / redo |
| Notebook | `Space` (hold) | Pan while drawing |
| Notebook | `Esc` | Back to the map |

## Your data

Everything is stored in this browser only, in IndexedDB (`atlas` → `kv` → `ws`).
Nothing is uploaded and there is no account.

- **Data** in the top bar copies the whole workspace as JSON, downloads it as a file,
  and merges a pasted workspace back in. Merging only ever adds — nothing you already
  have is replaced.
- Clearing site data for this page deletes the workspace, so export a backup now and
  then.
- Thai and English are both fine: the type stack falls back to Noto Sans Thai, and
  every label is real text with sensible system fallbacks if the web fonts fail.
- If the browser has no WebGL, the map says so and the index still opens every
  concept and notebook.

## Running it locally

It is a static page — open `index.html`, or serve the folder:

```bash
python3 -m http.server 3000
```

For the sandbox development environment use `docker-compose.base44.yml`
(see `AGENTS.md`). Three.js and the fonts load from public CDNs, so the first load
needs a network connection; after that the service worker keeps the app available
offline, serving fresh HTML from the network whenever it can.

## Publishing

The repository is plain static files, so GitHub Pages works as-is: push `index.html`,
`manifest.json`, `sw.js` and the icons to the root of a branch, then enable Pages for
that branch and the `/ (root)` folder.
