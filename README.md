# ALL IN

The site for ALL IN, The Algorithmic Tournament by ExeaLabs (co-hosted with YRI): a one-day AI poker-bot competition, January 30, 2027, at Zoho HQ in Pleasanton, CA.

Built with Next.js 16 (App Router), TypeScript in strict mode, Tailwind v4 and anime.js v4.

## How the page works

- **The way in.** The first screen is a filmed camera move from above the table down onto the felt, cut into 149 stills in `public/intro/`. On large screens the first screen is pinned and scrolling scrubs the stills on a canvas (`components/sections/Hero.tsx`). Phones, narrow windows and reduced motion get the opening frame as a still, with the pitch as an ordinary block under it.
- **Re-cutting the film.** `scripts/intro-frames.sh take.mp4 [frames] [width]` (needs `ffmpeg` and `cwebp`), then set `FRAMES` in `lib/intro.ts`. The current take was generated with Wan 3.0 from two anchor stills of our own table, so the layout and the E X E A 1 board are ours.
- **Sections.** After the hero the page scrolls normally. Each section's entrance plays once when it arrives (`components/deck/Deck.tsx`, anime.js). Left and right arrow keys step between sections.
- **Look.** One fixed lamp and one fixed vignette for the whole page (`.room` in `app/globals.css`), so sections never show a seam. Gold is satin and flat. Cards carry their own stains (`lib/stain.ts`).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, should finish with zero warnings
npm run lint
```

## Edit the content

All copy and every event fact live in `lib/config.ts`. Sections read from it, so most updates need no component changes.

- **Date.** Set `date` to an ISO string. `dateWindow` is only shown while it is `null`.
- **Venue.** Set `venue` and `venueCity`.
- **Co-hosts.** Add names to `coHosts` only once they are confirmed.
- **Team.** `team.rows` is three rows: founders, then the rest. Every card is the same size.
- **Prizes.** `prizes.items` are shown on three identical cards.

Never put an unconfirmed name in the config. The page shows exactly what is there.

## Applications

The form validates on both sides with the same zod schema (`lib/apply.ts`) and POSTs to `app/api/apply/route.ts`.

**The route does not store anything yet.** It validates the payload, logs the email and role, and returns `{ ok: true }`, so every application is currently dropped. The plan is a Postgres database from the Vercel Marketplace; it needs the Vercel team chosen and the project linked first.

To use an external form instead, set:

```bash
NEXT_PUBLIC_APPLY_URL=https://forms.example.com/allin
```

The Apply section then shows a link in place of the form.

## Screenshots

With the dev server running on port 3100:

```bash
node scripts/shots.mjs screenshots http://localhost:3100 375,768,1024,1440,1920 full
```

The script writes one PNG per width and prints any horizontal overflow and console errors. With `full`, it wheels through the page before capturing.

## Motion
Kept small on purpose. The hero fades in, and its table deals hands to eight bot laptops whose screens show each decision. A dithered light (`components/motion/Dither.tsx`) sways slowly behind the hero, Reach, Why poker and Apply; it draws at 20fps on a tiny canvas. The bench deals one hand at a time. Everything stops when it scrolls out of view, and all of it is under `prefers-reduced-motion`.

## Still TBA
These are undecided, so the site says TBA rather than guessing:
- Exact date (late January or early February) and kickoff time.
- Venue and city. Whether the event goes hybrid.
- Allowed languages, cost and the application deadline.
- Prize pool. The four award names are proposals.
- Judging weights.
- Sponsors, co-hosts, food partner, speakers and session times.
- Contact and sponsor emails. Application deadline.
- Final domain. `url` in the config is a placeholder used for SEO and share images.
- Storage for applications.

Virtual chips only. No real-money gambling. This is a game-theory and AI competition.
