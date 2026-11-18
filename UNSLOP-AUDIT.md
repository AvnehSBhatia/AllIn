# Unslop audit

Method:
- Screenshots at 375, 768, 1024, 1440 and 1920. Full-page captures wheel through the page first, so every scroll-triggered entrance has played (`scripts/shots.mjs`).
- A grep sweep of all shipped copy for the banned words, exclamation marks, em dashes and emoji.
- Lighthouse on the production build, desktop and mobile presets.
- Every tell below is fixed. The file:line points at where the fix lives now.

## Layout and colour

| Tell | Fixed at |
| --- | --- |
| Centred hero lockup over a gradient with floating chips (the stock "AI landing page" frame) | `components/sections/Hero.tsx:105`: text on the left 45%, a tilted 8-seat table bleeding off the right edge |
| Four identical prize cards in a row | `components/sections/Prizes.tsx:47`: chip stacks on felt. First place gets a 1.5fr column and a 15-chip stack; the rest scale down |
| Three equal workshop cards with icons | `components/sections/Workshops.tsx:28`: a flat list of plaques. Each reads "Seat open" until a speaker confirms |
| Judging criteria as a symmetric card grid | `components/sections/Judging.tsx:45`: ledger rows, each dealing its hand from the hand-rankings card |
| Sponsor logo wall of grey placeholders | `components/sections/House.tsx:76`: a top-down seating chart with empty chairs named as such |
| Format facts as icon tiles | `components/sections/Format.tsx:48`: a house-rules ledger. TBA is set in mono, so "undecided" reads differently from "decided" |
| Three surfaces stacked (page, card, inner card) | Two surfaces only: page felt and the `.felt` panel. Cards were cut wherever a third layer appeared |
| Gold on every heading, border and icon | Gold is a token (`app/globals.css:12`), used 19 times: CTAs, the prize-pool line, focus rings and hairlines |
| Component CSS silently overriding Tailwind utilities, so chips ignored their colour and buttons their padding | `app/globals.css:1`: explicit layer order with components in `@layer comp` (`app/globals.css:142`) below utilities |
| Faint manifesto words at 1.5:1 contrast | `components/sections/Manifesto.tsx:20`: unlit words start at 40%, about 3.2:1, which passes for text this large |
| Decorative footer wordmark failing contrast checks | `components/sections/Footer.tsx:39`: drawn as generated content, so it reads as ornament rather than text |
| Static chips over the nav and captions under reduced motion | `components/hero/HeroChips.tsx:13`: home positions stay clear of the nav strip and the caption row |
| Hero cards overlapping nav links and the "Click the felt" caption | `components/sections/Hero.tsx:17` and `:18` |

## Copy

| Tell | Fixed at |
| --- | --- |
| "Not just win rate" (the "not just X, it's Y" pattern) | `lib/config.ts:136`, now "Win rate is one of four judging criteria." |
| Note pointing "below" at a list above it | `lib/config.ts:87` |
| Triplet taglines, exclamation marks, rhetorical openers | The sweep finds none in `app/`, `components/` or `lib/`. The only em dash is in a code comment |
| Hype verbs (unleash, elevate, seamless, journey, dive into) | Zero hits. The voice is a dry card-room regular: "Every chair is open. For now." |
| Emoji suits | `components/ui/Suit.tsx:15`: glyphs map to SVG suits, so iOS never swaps in emoji |

## Motion

| Tell | Fixed at |
| --- | --- |
| Every section fading up 40px on the same ease | Each section has its own verb: cards dealt (`Judging.tsx:15`), chips dropped with bounce (`Prizes.tsx:20`), plaques flipped on X (`Workshops.tsx:12`), a split-flap rattle (`Stats.tsx:18`), a timeline drawn by scroll (`Format.tsx:70`) |
| Scramble that could freeze on a wrong digit | `components/sections/Stats.tsx:16`: the real digit lives in `data-v` and is restored on cleanup (`:33`) |
| Reduced motion meaning "nothing" | `app/globals.css:430`: every effect has a still state that looks finished, and the hero still shows a full hand on the table |

Every one-shot motion is 1.2s or less; the preloader (2.2s or less, once per session) is the only exception. The marquee and dust are ambient loops, not transitions.

## Craft details
- "Seat open" empty states: `House.tsx:36`, `Workshops.tsx:32`.
- 404 as a folded hand: `app/not-found.tsx:16`.
- Selection colour: `app/globals.css:89`.
- Scrollbar: `app/globals.css:65`.
- Console note: `components/ui/Extras.tsx:12`.
- Hidden-tab title: `components/ui/Extras.tsx:19`.

## Three bold upgrades
1. **Prizes**: physical chip stacks that drop onto felt. Stack height shows rank without inventing a prize amount.
2. **Stats**: a split-flap tote board instead of four big numbers with labels.
3. **The House**: a seating chart. With no sponsors confirmed, it shows empty chairs rather than fake logos.

## Results
- `tsc`, `eslint --max-warnings 0` and `next build`: zero warnings.
- Lighthouse desktop: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse mobile: Performance 89, Accessibility 100, Best Practices 100, SEO 100.
- Horizontal overflow: 0px at 375, 768, 1024, 1440 and 1920.
