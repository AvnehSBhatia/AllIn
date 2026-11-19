import { config } from "@/lib/config";
import { Nav } from "@/components/ui/Nav";
import { Deck } from "@/components/deck/Deck";
import { Hero } from "@/components/sections/Hero";
import { WhyPoker } from "@/components/sections/WhyPoker";
import { HowYouWin } from "@/components/sections/HowYouWin";
import { Day } from "@/components/sections/Day";
import { Prizes } from "@/components/sections/Prizes";
import { Team } from "@/components/sections/Team";
import { Apply } from "@/components/sections/Apply";
import { Footer } from "@/components/sections/Footer";

const IDS = config.panels.map((p) => p.id);

/** The hero, then seven sections of tabletop, in the order of config.panels. */
export default function Home() {
  return (
    <>
      <Nav />
      <Deck ids={IDS} />
      <main id="main">
        <Hero />
        <WhyPoker />
        <HowYouWin />
        <Day />
        <Prizes />
        <Team />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
