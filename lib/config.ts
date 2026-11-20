/**
 * ALL IN — site content.
 * Every fact, date and line of copy lives here. Edit this file only.
 * Anything marked // TBA is a placeholder until it's confirmed.
 */

export const config = {
  name: "ALL IN",
  umbrella: "The Algorithmic Tournament · by ExeaLabs",
  organizer: "ExeaLabs",
  organizerUrl: "https://www.exealabs.org/",
  url: "https://allin.exealabs.com", // TBA: final domain (used for SEO + share images)

  tagline: "Write a poker bot in a day, then send it up against every other team's.",
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
    heading: "Open to *all.*",
    body: "No need to know poker beforehand.",
    facts: ["High schoolers and researchers", "Teams of up to three", "About 150 seats"],
  },

  game: {
    heading: "Why it's *poker.*",
    body: "Poker is an imperfect information game.",
    note: "Our variant is going to require complex bot algorithms to dominate.",
    hand: ["E♠", "X♦", "E♣", "A♥"], // our deck: real suits, lettered indices. The fifth card stays face down
  },

  win: {
    heading: "How the bracket *works.*",
    body: "The top two at each table move up, round after round.",
    steps: [
      { title: "Baseline", body: "Your bot plays ours." },
      { title: "Leaderboard", body: "Results set your seeding." },
      { title: "Tables", body: "Top two advance." },
      { title: "Winner", body: "Until one bot is left." },
    ],
  },

  day: {
    heading: "One *Saturday.*",
    body: "January 30 at Zoho HQ in Pleasanton. Lunch and dinner included.",
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
    heading: "$1,900 in *prizes.*",
    // Same card, same size: none of these reads as the lesser prize.
    items: [
      { how: "Wins the bracket", title: "First place", amount: "$1,200", extra: "Cash and glass trophies", suit: "s" },
      { how: "Judges' pick", title: "Most technical", amount: "$300", extra: "Cash and a trophy", suit: "d" },
      { how: "Judges' pick", title: "Most unique", amount: "$300", extra: "Cash and a trophy", suit: "h" },
    ] as { how: string; title: string; amount: string; extra: string; suit: "s" | "h" | "d" | "c" }[],
    raffle: "Plus one $100 raffle prize.",
  },

  // The organizers. Founders sit in the first row; everyone gets the same card.
  team: {
    heading: "Who's *running it.*",
    body: "ExeaLabs, with YRI and California STEM Innovators.",
    // Co-Lead where two people share the same area; Lead otherwise.
    rows: [
      [
        { name: "Avneh", title: "Co-Founder of Exea Labs" },
        { name: "Joshua", title: "Co-Founder of Exea Labs" },
      ],
      [
        { name: "Andre", title: "Lead of Management" },
        { name: "Devom", title: "Technical Capital Acquisition Advisor" },
        { name: "Amar", title: "Co-Lead of Venue Coordination" },
        { name: "Sahil", title: "Co-Lead of Venue Coordination" },
      ],
      [
        { name: "Jasraj", title: "Lead of Interface & Partnerships" },
        { name: "Svanik", title: "Co-Lead of Sponsor Management" },
        { name: "Shlok", title: "Lead of Logistics" },
        { name: "Avyank", title: "Lead of Outreach and Planning" },
        { name: "Wesley", title: "Lead of Operations" },
        { name: "Nicole", title: "Lead of Outreach" },
      ],
    ] as { name: string; title: string }[][],

    /**
     * Shown on plates under the organizers. Files live in public/partners, flattened to ink so they read on the card stock.
     * `logo` is a complete lockup and stands alone; `mark` is a symbol that sits above the name; neither means the name is
     * set in the label face on its own.
     */
    partnersLabel: "In partnership with",
    partners: [
      { name: "Exea_Labs", href: "https://www.exealabs.org/" },
      { name: "YRI Fellowship", href: "https://www.yriscience.com/", mark: "/partners/yri-fellowship.png" },
      { name: "California STEM Innovators", href: "https://californiasteminnovators.org/", logo: "/partners/ca-stem-innovators.png" },
    ] as { name: string; href: string; logo?: string; mark?: string }[],
  },

  apply: {
    heading: "Apply for a *seat.*",
    body: "Every application is read by a person.",
    deadline: null as string | null, // TBA
    maxLinks: 3,
  },

  faq: [
    { q: "Who can apply?", a: "High schoolers and researchers. If you write code and you're curious about game theory or AI, you're who we're looking for." },
    { q: "Do I need to know poker?", a: "No. We play our own version of the game, which is new to everyone. Being comfortable in one programming language is enough, and some probability helps." },
    { q: "How big are teams?", a: "Up to three people. You can also come alone." },
    { q: "How is the winner decided?", a: "Your bot plays our baseline bot to get on the leaderboard. Then bots are seated at tables, the top two at each table advance, and it repeats until one bot is left. Most technical and Most unique are picked by judges." },
    { q: "Where and when?", a: "Saturday, January 30, 2027, at Zoho HQ in Pleasanton, CA. Doors open 8:30 AM and close 8:30 PM. No overnight. Bring a laptop and charger." },
    { q: "Is there gambling?", a: "No. Virtual chips only. This is a game-theory and AI competition." },
  ],

  safety: "Virtual chips only. No real-money gambling. This is a game-theory and AI competition.",
};

export type Config = typeof config;
