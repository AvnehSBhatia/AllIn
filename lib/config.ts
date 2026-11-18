/**
 * ALL IN — site content.
 * Every fact, date and line of copy lives here. Edit this file only.
 * Anything marked // TBA is a placeholder until it's confirmed.
 * Leave a field as null or "" and the site shows "Announcing soon" instead.
 */

export type Tier = "title" | "gold" | "silver" | "community";

export const config = {
  name: "ALL IN",
  umbrella: "The Research Hackathon · by ExeaLabs",
  organizer: "ExeaLabs",
  url: "https://allin.exealabs.com", // TBA: final domain (used for SEO + share images)

  tagline: "Build a bot. Bluff the machine. Go all in.",
  sub: "ExeaLabs' Research Hackathon, an AI poker-bot algorithm competition.",

  /** ISO string with timezone, e.g. "2027-01-30T09:00:00-08:00". null shows "Date locking soon". */
  date: null as string | null, // TBA: late January or early February
  dateWindow: "Late Jan / early Feb", // shown while date is null
  durationLabel: "One day",
  format: "In person", // TBA: hybrid not decided
  capacity: 150, // approximate. Never advertise 200+.

  /** When the classified rules unseal on their own. null = sealed until you change it. */
  rulesRevealAt: null as string | null, // TBA: kickoff time

  /** Leave null to show "Announcing soon". */
  venue: null as string | null, // TBA
  venueCity: null as string | null, // TBA
  food: "Lunch and dinner provided", // confirmed: food is provided
  foodPartner: null as string | null, // TBA
  coHosts: [] as string[], // TBA: outreach in progress, add only when confirmed

  /** Set to a real address to turn on the mailto buttons. "" hides them gracefully. */
  contactEmail: "", // TBA
  sponsorEmail: "", // TBA

  /** NEXT_PUBLIC_APPLY_URL (env var) overrides this and swaps the form for a link. */
  applyUrl: process.env.NEXT_PUBLIC_APPLY_URL ?? "",

  socials: [
    // TBA: e.g. { label: "Instagram", href: "https://instagram.com/..." }
  ] as { label: string; href: string }[],

  nav: [
    { label: "Game", href: "#game" },
    { label: "Format", href: "#format" },
    { label: "Prizes", href: "#prizes" },
    { label: "Judging", href: "#judging" },
    { label: "Schedule", href: "#schedule" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "FAQ", href: "#faq" },
  ],

  reach: {
    label: "ExeaLabs · Open call",
    heading: "Built anywhere. Played in one room.",
    body: "Applications are open to undergrads and researchers wherever they are. The event is one day, in person, with about 150 seats, and every application is reviewed.",
    glitch: "Shuffle up and deal.",
  },

  manifesto: {
    lead: "Chess shows you the whole board. Poker shows you two cards and the way someone bet.",
    body: [
      "Everything else you infer. That gap is the interesting part: acting well on partial information, against an opponent who is trying to mislead you, with a clock running.",
      "Plain Hold'em is close enough to solved that you can download a strong bot.",
    ],
    turn: "So we changed the game.",
    close: "You learn the rules at kickoff. You have one day to build something that plays them well, and then you explain why it works.",
  },

  classified: {
    heading: "The variant is secret until kickoff.",
    body: [
      "No-limit Texas Hold'em has been studied to death. Strong solvers are a download away, so a straight Hold'em bracket would mostly test who found the best repo.",
      "Instead we twist the game. A custom variant, or something we invent outright. The rules arrive at kickoff and nobody has a head start. Your bot has to adapt.",
    ],
    // These lines sit under the redaction bars. Replace them with the real rules at kickoff.
    redacted: [
      "VARIANT ........ [ sealed until kickoff ]",
      "DECK ........... [ sealed until kickoff ]",
      "BETTING ........ [ sealed until kickoff ]",
      "INFORMATION .... [ sealed until kickoff ]",
      "MATCH FORMAT ... [ sealed until kickoff ]",
    ],
  },

  /** The Streets. Times are TBA until the schedule is set. */
  streets: [
    { street: "Pre-flop", title: "Doors & kickoff", time: "TBA", body: "Check in, find your team, coffee. Opening remarks and a short primer on bots and game theory." },
    { street: "Flop", title: "Rules revealed. Build.", time: "TBA", body: "The variant unseals. You get the engine, the API and the clock. Start building." },
    { street: "Turn", title: "Scrimmage rounds", time: "TBA", body: "Practice matches against other teams. See what breaks, patch it, try again." },
    { street: "River", title: "Final tournament", time: "TBA", body: "Bots lock. The bracket runs head to head on fixed seeds. No hands-on fixes." },
    { street: "Showdown", title: "Pitches & awards", time: "TBA", body: "Short strategy pitches to the judges. Then the results, and the awards." },
  ],

  judging: {
    intro: "Win rate matters. It isn't the whole score. This rewards people who think fast, prove their work in a short window, and can explain it under pressure.",
    note: "Weights TBA. The order above is not a ranking.",
    criteria: [
      { hand: "Royal flush", cards: ["A♠", "K♠", "Q♠", "J♠", "T♠"], title: "Bot performance", body: "How your bot does in the final bracket. Chips won, consistency across seeds." },
      { hand: "Straight flush", cards: ["9♥", "8♥", "7♥", "6♥", "5♥"], title: "Novelty of approach", body: "Did you try something that isn't the obvious baseline? Interesting failures count." },
      { hand: "Four of a kind", cards: ["Q♦", "Q♣", "Q♥", "Q♠", "4♦"], title: "Progress in a day", body: "Where you started at kickoff, where you ended. Show the iterations." },
      { hand: "Full house", cards: ["J♣", "J♦", "J♠", "3♥", "3♣"], title: "Presentation", body: "A short pitch to judges. Clear idea, honest results, good answers to hard questions." },
    ],
  },

  prizes: {
    note: "Prize pool TBA",
    items: [
      { title: "Grand Champion Bot", body: "Top of the final bracket.", chip: "gold" },
      { title: "Best Research Insight", body: "The most novel idea, win or lose.", chip: "blue" },
      { title: "Best Pitch", body: "Best strategy presentation to the judges.", chip: "red" },
      { title: "Best Rookie Team", body: "Strongest first-time team.", chip: "white" },
    ] as { title: string; body: string; chip: "gold" | "blue" | "red" | "white" }[],
  },

  workshops: [
    { kind: "Research talk", title: "Announcing soon", speaker: null as string | null, time: "TBA" },
    { kind: "Workshop", title: "Announcing soon", speaker: null as string | null, time: "TBA" },
    { kind: "Research talk", title: "Announcing soon", speaker: null as string | null, time: "TBA" },
  ],

  sponsors: {
    // Add confirmed sponsors only: { name: "Firm", href: "https://..." }
    title: [] as { name: string; href?: string }[],
    gold: [] as { name: string; href?: string }[],
    silver: [] as { name: string; href?: string }[],
    community: [] as { name: string; href?: string }[],
    slots: { title: 1, gold: 2, silver: 3, community: 4 } as Record<Tier, number>,
  },

  faq: [
    { q: "Who can apply?", a: "Undergrads and researchers. If you can write code and you're curious about game theory or AI, apply. Applications are reviewed." },
    { q: "How big are teams?", a: "TBA. We'll publish team sizes before applications close." },
    { q: "How much does it cost?", a: "TBA." },
    { q: "What skills do I need?", a: "Comfort programming in at least one language. Some probability helps. You don't need to know poker theory; the variant is new to everyone." },
    { q: "Which languages can we use?", a: "TBA. The engine API and language rules will be announced before the event." },
    { q: "Is it in person?", a: "In person is the plan. Hybrid is not decided yet. One day, location TBA." },
    { q: "What should I bring?", a: "A laptop, charger, and anything you need to work for a full day. Lunch and dinner are provided." },
    { q: "What's the research component?", a: "Win rate is one of four judging criteria. The other three are novelty, progress made during the day and a short pitch. Research talks and workshops run between hands." },
    { q: "Is there gambling?", a: "No. Virtual chips only. No real-money gambling. This is a game-theory and AI competition." },
    { q: "How does selection work?", a: "We review every application and aim for about 150 people. Tell us what you've built and why this interests you. That matters more than credentials." },
  ],

  apply: {
    heading: "Pull up a chair.",
    body: "About 150 seats. Every application is read by a person.",
    deadline: null as string | null, // TBA
  },

  /** Hidden-aces puzzle. Shown when someone finds all four. */
  puzzle: {
    title: "You've got the nuts.",
    message: "Four of four. Screenshot this. What it's worth gets announced closer to the day.", // TBA: real bonus
  },

  safety: "Virtual chips only. No real-money gambling. This is a game-theory and AI competition.",

  marquee: ["Expected value", "Nash equilibrium", "Monte Carlo", "Counterfactual regret", "Pot odds", "Bluff frequency", "Exploit", "All in"],
};

export type Config = typeof config;
