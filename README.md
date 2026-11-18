# ALL IN

The site for ALL IN, The Algorithmic Tournament by ExeaLabs (co-hosted with YRI): a one-day AI poker-bot competition, January 30, 2027, at Zoho HQ in Pleasanton, CA.

Built with Next.js 16 (App Router), TypeScript in strict mode, Tailwind v4, GSAP (ScrollTrigger, SplitText) and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, should finish with zero warnings
npm run lint
npm run check      # sanity checks for the hand evaluator and equity sampler in lib/poker.ts
```

## Edit the content

All copy and every event fact live in `lib/config.ts`. Sections read from it, so most updates need no component changes.

- **Date.** Set `date` to an ISO string. `dateWindow` is only shown while it is `null`.
- **Venue.** Set `venue` and `venueCity`.
- **Sponsors.** Add `{ name, href }` to `sponsors.title | gold | silver | community`. `sponsors.slots` controls how many empty "Seat open" chairs show per tier.
- **Speakers.** Fill `speaker` and `title` in `workshops`. Until then the plaque reads "Seat open".
- **Co-hosts.** Add names to `coHosts` only once they are confirmed.
- **Open call.** `reach` holds the ExeaLabs band after the hero: heading and body. Its City row reads `venueCity`.
- **Contact.** Setting `sponsorEmail` turns on the "Take a seat at the house" mail link.

Never put an unconfirmed name in the config. The page shows exactly what is there.

## Applications

The form validates on both sides with the same zod schema (`lib/apply.ts`) and POSTs to `app/api/apply/route.ts`.

**The route does not store anything yet.** It validates the payload, logs the email and role, and returns `{ ok: true }`. Pick a store (a sheet, a database, a form service) and write to it where the route says so.

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
