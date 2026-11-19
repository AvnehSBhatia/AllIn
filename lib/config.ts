/**
 * ALL IN — site content.
 * Every fact, date and line of copy lives here. Edit this file only.
 * Anything marked // TBA is a placeholder until it's confirmed.
 */

export const config = {
  name: "ALL IN",
  umbrella: "The Algorithmic Tournament · by ExeaLabs",
  organizer: "ExeaLabs",
  url: "https://allin.exealabs.com", // TBA: final domain (used for SEO + share images)

  tagline: "Build a bot. Bluff the machine. Go all in.",
  sub: "A one-day AI poker-bot tournament.",

  /** ISO string with timezone, e.g. "2027-01-30T09:00:00-08:00". null shows dateWindow instead. */
  date: "2027-01-30T08:30:00-08:00" as string | null, // doors open
  dateWindow: "Jan 30, 2027",
  capacity: 150, // approximate. Never advertise 200+.

  venue: "Zoho HQ" as string | null,
  venueCity: "Pleasanton, CA" as string | null,
  coHosts: ["YRI", "California STEM Innovators"] as string[],
  teamSize: 3, // max per team

  /** Set to a real address to show it in the footer. "" hides it. */
  contactEmail: "", // TBA

  /** NEXT_PUBLIC_APPLY_URL (env var) overrides this and swaps the form for a link. */
  applyUrl: process.env.NEXT_PUBLIC_APPLY_URL ?? "",

  socials: [
    // TBA: e.g. { label: "Instagram", href: "https://instagram.com/..." }
  ] as { label: string; href: string }[],

  /** Sections after the hero, in page order. */
  panels: [{ id: "game" }, { id: "win" }, { id: "day" }, { id: "prizes" }, { id: "team" }, { id: "apply" }],

  open: {
    heading: "No barrier to *entry.*",
    body: "One application. No poker required.",
    facts: ["High schoolers and researchers", "Teams of up to three", "About 150 seats"],
  },

  game: {
    heading: "Poker is the *wild card.*",
    body: "The best bot can still lose the hand.",
    note: "Our own variant. No solver to download.",
    hand: ["E♠", "X♦", "E♣", "A♥"], // our deck: real suits, lettered indices. The fifth card stays face down
  },

  win: {
    heading: "Last bot *standing.*",
    body: "Top two at every table move on.",
    steps: [
      { title: "Baseline", body: "Your bot plays ours." },
      { title: "Leaderboard", body: "Your results rank you." },
      { title: "Tables", body: "Top two advance." },
      { title: "Winner", body: "One bot is left." },
    ],
  },

  day: {
    heading: "One *Saturday.*",
    body: "January 30 at Zoho HQ, Pleasanton. Lunch and dinner are on us.",
    schedule: [
      ["8:30 AM", "Doors open"],
      ["9:30 AM", "Building starts"],
      ["12:00 PM", "Lunch"],
      ["6:00 PM", "Code freeze, dinner"],
      ["6:45 PM", "Bracket and demos"],
      ["8:15 PM", "Awards"],
    ] as [string, string][],
  },

  prizes: {
    heading: "$1,900 on the *table.*",
    // Same card, same size: none of these reads as the lesser prize.
    items: [
      { how: "Wins the bracket", title: "Last bot standing", amount: "$1,200", extra: "Cash and glass trophies", suit: "s" },
      { how: "Judges' pick", title: "Most technical", amount: "$300", extra: "Cash and a trophy", suit: "d" },
      { how: "Judges' pick", title: "Most unique", amount: "$300", extra: "Cash and a trophy", suit: "h" },
    ] as { how: string; title: string; amount: string; extra: string; suit: "s" | "h" | "d" | "c" }[],
    raffle: "And a raffle: one $100 prize.",
  },

  // The organizers. Founders sit in the first row; everyone gets the same card.
  team: {
    heading: "The *house.*",
    body: "ExeaLabs, with YRI and California STEM Innovators.",
    rows: [
      [
        { name: "Avneh", title: "Chief Capital & Adjudication Officer", founder: true },
        { name: "Joshua", title: "Chief Treasury & Partnerships Officer", founder: true },
      ],
      [
        { name: "Andre", title: "Chief Fiscal & Operations Officer" },
        { name: "Devom", title: "Principal, Capital Formation" },
        { name: "Amar", title: "Head of Physical Infrastructure" },
        { name: "Sahil", title: "VP, Real Estate Acquisition" },
      ],
      [
        { name: "Jasraj", title: "Chief Interface & Operations Officer" },
        { name: "Svanik", title: "Director of Caloric Logistics" },
        { name: "Shlok", title: "Director of Operational Logistics" },
        { name: "Avyank", title: "Chief Narrative Officer" },
        { name: "Wesley", title: "VP, Signal Amplification" },
        { name: "Nicole", title: "Head of Social Presence" },
      ],
    ] as { name: string; title: string; founder?: boolean }[][],
  },

  apply: {
    heading: "Pull up a *chair.*",
    body: "Every application is read by a person.",
    deadline: null as string | null, // TBA
    maxLinks: 3,
  },

  faq: [
    { q: "Who can apply?", a: "High schoolers and researchers. If you can write code and you're curious about game theory or AI, apply." },
    { q: "Do I need to know poker?", a: "No. We play our own version of the game, so it's new to everyone. Comfort in one programming language is enough, and some probability helps." },
    { q: "How big are teams?", a: "Up to three people. You can also come alone." },
    { q: "How is the winner decided?", a: "Your bot plays our baseline bot to get on the leaderboard. Then bots are seated at tables, the top two at each table advance, and it repeats until one bot is left. Most technical and Most unique are picked by judges." },
    { q: "Where and when?", a: "Saturday, January 30, 2027, at Zoho HQ in Pleasanton, CA. Doors open 8:30 AM and close 8:30 PM. No overnight. Bring a laptop and charger." },
    { q: "Is there gambling?", a: "No. Virtual chips only. This is a game-theory and AI competition." },
  ],

  safety: "Virtual chips only. No real-money gambling. This is a game-theory and AI competition.",
};

export type Config = typeof config;
