/**
 * ALL IN — site content.
 * Every fact, date and line of copy lives here. Edit this file only.
 * Anything marked // TBA is a placeholder until it's confirmed.
 * Leave a field as null or "" and the site shows "Announcing soon" instead.
 */

export type Tier = "title" | "gold" | "silver" | "community";

export const config = {
  name: "ALL IN",
  umbrella: "The Algorithmic Tournament · by ExeaLabs",
  organizer: "ExeaLabs",
  url: "https://allin.exealabs.com", // TBA: final domain (used for SEO + share images)

  tagline: "Build a bot. Bluff the machine. Go all in.",
  sub: "ExeaLabs' algorithmic tournament: an AI poker-bot competition on a variant we wrote.",

  /** ISO string with timezone, e.g. "2027-01-30T09:00:00-08:00". null shows "Date locking soon". */
  date: "2027-01-30T08:30:00-08:00" as string | null, // doors open
  dateWindow: "Jan 30, 2027", // shown while date is null
  durationLabel: "One day",
  format: "In person", // one day, no overnight
  capacity: 150, // approximate. Never advertise 200+.

  /** When the classified rules unseal on their own. null = sealed until you change it. */
  rulesRevealAt: null as string | null, // TBA: kickoff time

  /** Leave null to show "Announcing soon". */
  venue: "Zoho HQ" as string | null,
  venueCity: "Pleasanton, CA" as string | null,
  food: "Lunch and dinner provided", // confirmed: food is provided
  foodPartner: null as string | null, // TBA
  coHosts: ["YRI"] as string[],
  teamSize: 3, // max per team; about 50 teams at 150 seats

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
    { label: "Team", href: "#team" },
    { label: "FAQ", href: "#faq" },
  ],

  reach: {
    label: "ExeaLabs · Open call",
    heading: "Built anywhere. Played in one room.",
    body: "Applications are open to high schoolers and researchers wherever they are. It's one day in Pleasanton, about 150 seats in teams of up to three, and every application is reviewed.",
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
      "Instead we twist the game. A custom variant, or something we invent outright. The rules arrive at kickoff with a basic baseline bot, so nobody has a head start. Your bot has to adapt.",
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

  /** The Streets: the day as a hand. Times are from the run of show below. */
  streets: [
    { street: "Pre-flop", title: "Doors & opening", time: "8:30 AM", body: "Check in, find your team, coffee. The opening ceremony starts at 9:00." },
    { street: "Flop", title: "Rules revealed. Build.", time: "9:30 AM", body: "The variant unseals. You get the engine, the API and a basic baseline bot. Submit to the live leaderboard as often as you like." },
    { street: "Turn", title: "Train, resubmit, climb", time: "12:00 PM", body: "Lunch, then two workshops while the leaderboard keeps running. See what breaks, patch it, resubmit." },
    { street: "River", title: "Code freeze. Playoffs.", time: "6:00 PM", body: "Bots lock with dinner. The bracket seats about six bots a table; the top two at each table advance until one is left." },
    { street: "Showdown", title: "Demos & awards", time: "6:45 PM", body: "Short demos to the judges, then awards at 8:15. Doors close at 8:30." },
  ],

  /** Run of show, Saturday Jan 30. */
  schedule: [
    ["8:30 AM", "Doors open"],
    ["9:00 AM", "Opening ceremony"],
    ["9:30 AM", "Rules unsealed, building starts"],
    ["12:00 PM", "Lunch"],
    ["1:30 PM", "Workshop 1"],
    ["3:30 PM", "Workshop 2"],
    ["6:00 PM", "Code freeze and dinner"],
    ["6:45 PM", "Judging and demos"],
    ["8:15 PM", "Awards and closing"],
    ["8:30 PM", "Doors close"],
  ] as [string, string][],

  judging: {
    intro: "Win rate matters. It isn't the whole score. This rewards people who think fast, prove their work in a short window, and can explain it under pressure.",
    note: "Weights TBA. The order above is not a ranking.",
    criteria: [
      { hand: "Royal flush", cards: ["A♠", "K♠", "Q♠", "J♠", "T♠"], title: "Bot performance", body: "Where your bot finishes: the live leaderboard, then the playoff bracket." },
      { hand: "Straight flush", cards: ["9♥", "8♥", "7♥", "6♥", "5♥"], title: "Novelty of approach", body: "Did you try something that isn't the obvious baseline? Interesting failures count." },
      { hand: "Four of a kind", cards: ["Q♦", "Q♣", "Q♥", "Q♠", "4♦"], title: "Progress in a day", body: "Where you started at kickoff, where you ended. Show the iterations." },
      { hand: "Full house", cards: ["J♣", "J♦", "J♠", "3♥", "3♣"], title: "Demo", body: "A short demo to the judges. Clear idea, honest results, good answers to hard questions." },
    ],
  },

  prizes: {
    note: "$1,900 in prizes",
    items: [
      { label: "First place", title: "Last bot standing", amount: "$1,200", body: "$400 to each member, plus the big trophy.", chip: "gold" },
      { label: "Judged", title: "Most technical", amount: "$300", body: "$100 to each member, plus a trophy.", chip: "blue" },
      { label: "Judged", title: "Most unique", amount: "$300", body: "$100 to each member, plus a trophy.", chip: "red" },
      { label: "Everyone seated", title: "Raffle", amount: "$100", body: "One prize, or two at about $50.", chip: "white" },
    ] as { label: string; title: string; amount: string; body: string; chip: "gold" | "blue" | "red" | "white" }[],
  },

  workshops: [
    { kind: "Workshop 1", title: "Announcing soon", speaker: null as string | null, time: "1:30 PM" },
    { kind: "Workshop 2", title: "Announcing soon", speaker: null as string | null, time: "3:30 PM" },
  ],

  // The organizers. title = the job as it would read on LinkedIn; job = what they actually do.
  team: [
    { name: "Avneh", title: "Co-founder · Chief Capital & Adjudication Officer", job: "Co-founded ExeaLabs. Finances, logistics, corporate sponsors and judges.", founder: true },
    { name: "Joshua", title: "Co-founder · Chief Treasury & Partnerships Officer", job: "Co-founded ExeaLabs. Finances, logistics and sponsor outreach.", founder: true },
    { name: "Andre", title: "Co-founder · Chief Fiscal & Operations Officer", job: "Co-founded ExeaLabs. Finances, logistics and local sponsors.", founder: true },
    { name: "Jasraj", title: "Chief Interface Officer & Provisions Strategist", job: "Builds this website. Also food and sponsor outreach." },
    { name: "Sahil", title: "VP, Real Estate Acquisition", job: "Venue and sponsor outreach." },
    { name: "Amar", title: "Head of Physical Infrastructure", job: "Venue and sponsor outreach." },
    { name: "Svanik", title: "Director of Caloric Logistics", job: "Food and sponsor outreach." },
    { name: "Devom", title: "Principal, Capital Formation", job: "Sponsor outreach and judges." },
    { name: "Shlok", title: "Director of Operational Logistics", job: "Logistics manager. Makes sure the day actually happens." },
    { name: "Avyank", title: "Chief Narrative Officer", job: "Advertising and planning." },
    { name: "Wesley", title: "VP, Signal Amplification", job: "Advertising and planning." },
    { name: "Nicole", title: "Head of Social Presence", job: "Runs the socials." },
  ] as { name: string; title: string; job: string; founder?: boolean }[],

  sponsors: {
    // Add confirmed sponsors only: { name: "Firm", href: "https://..." }
    title: [] as { name: string; href?: string }[],
    gold: [] as { name: string; href?: string }[],
    silver: [] as { name: string; href?: string }[],
    community: [] as { name: string; href?: string }[],
    slots: { title: 1, gold: 2, silver: 3, community: 4 } as Record<Tier, number>,
  },

  faq: [
    { q: "Who can apply?", a: "High schoolers and researchers. If you can write code and you're curious about game theory or AI, apply. Applications are reviewed." },
    { q: "How big are teams?", a: "Up to three people. With about 150 seats, that's around 50 teams." },
    { q: "How is the winner decided?", a: "Teams train and resubmit bots to a live leaderboard all day. After code freeze, a playoff bracket seats about six bots a table and the top two advance until one bot is left. Most technical and Most unique are judged separately." },
    { q: "How much does it cost?", a: "TBA." },
    { q: "What skills do I need?", a: "Comfort programming in at least one language. Some probability helps. You don't need to know poker theory; the variant is new to everyone." },
    { q: "Which languages can we use?", a: "TBA. The engine API and language rules will be announced before the event." },
    { q: "Where and when?", a: "Saturday, January 30, 2027, at Zoho HQ in Pleasanton, CA. One day, no overnight: doors open 8:30 AM and close 8:30 PM. Co-hosted with YRI." },
    { q: "What should I bring?", a: "A laptop, charger, and anything you need to work for a full day. Lunch and dinner are provided." },
    { q: "What's the research component?", a: "Win rate is one of four judging criteria. The other three are novelty, progress made during the day and a short demo. Two workshops run in the afternoon." },
    { q: "Is there gambling?", a: "No. Virtual chips only. No real-money gambling. This is a game-theory and AI competition." },
    { q: "How does selection work?", a: "We review every application and aim for about 150 people. Tell us what you've built and why this interests you. That matters more than credentials." },
  ],

  apply: {
    heading: "Pull up a chair.",
    body: "About 150 seats. Every application is read by a person.",
    deadline: null as string | null, // TBA
  },

  safety: "Virtual chips only. No real-money gambling. This is a game-theory and AI competition.",
};

export type Config = typeof config;
