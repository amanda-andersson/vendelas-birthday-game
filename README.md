# KILL, MARRY, KÄÄRIJÄ — Vendela's Birthday Massacre

A small birthday visual novel / retro boss-battle game made with React, TypeScript and Vite.

## Start the game

1. Unzip this folder.
2. Open the folder in VS Code.
3. Open a terminal in the folder.
4. Run `npm install` (first time only).
5. Run `npm run dev`.
6. Open the local URL Vite prints, usually `http://localhost:5173`.

## Edit the game

- **Dialogue, chapters, choices and boss attacks:** `src/story.ts`
- **Game layout and interactions:** `src/main.tsx`
- **Colors, backgrounds, animations:** `src/style.css`
- **Character pictures:** `public/assets/`

The character images were cropped from the reference collages supplied for the birthday game. They are **not** transparent sprites, so the first version uses portrait cards rather than complicated body-part animation. They can be replaced with better isolated sprites later.

## Notes

- Click the dialogue box (or press Space / Enter) to advance. First click finishes the typing animation.
- Sound starts muted and can be turned on with the speaker icon.
- Every choice leads back to the same story so all scenes are playable.
- Works on mobile and desktop.
- `npm run build` checks TypeScript and builds the site into `dist/`.
- Vite is configured with a relative base path for flexible static hosting.

## Version 2 changes
- Separate dance-floor and wedding backgrounds.
- Käärijä stays hidden until his reveal outside Brovakten.
- The dialogue portrait belongs to the current speaker, including a new fictional pixel-art friend.
- Several characters switch between available facial expressions automatically.
- Amanda's default portrait is a tighter crop without decorative hearts.
