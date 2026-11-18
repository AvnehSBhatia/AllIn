import { config } from "@/lib/config";
import { Nav } from "@/components/ui/Nav";
import { Marquee } from "@/components/motion/Marquee";
import { SuitWipe } from "@/components/motion/SuitWipe";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Classified } from "@/components/sections/Classified";
import { LiveTable } from "@/components/sections/LiveTable";
import { Format, Streets } from "@/components/sections/Format";
import { Judging } from "@/components/sections/Judging";
import { Prizes } from "@/components/sections/Prizes";
import { Workshops } from "@/components/sections/Workshops";
import { Stats } from "@/components/sections/Stats";
import { House } from "@/components/sections/House";
import { Faq } from "@/components/sections/Faq";
import { Apply } from "@/components/sections/Apply";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee items={config.marquee} />
        <Manifesto />
        <Classified />
        <SuitWipe s="s" />
        <LiveTable />
        <Format />
        <Streets />
        <SuitWipe s="h" flip />
        <Judging />
        <Prizes />
        <Workshops />
        <Stats />
        <SuitWipe s="d" />
        <House />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
