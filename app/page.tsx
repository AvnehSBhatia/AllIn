import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/sections/Hero";
import { Reach } from "@/components/sections/Reach";
import { Manifesto } from "@/components/sections/Manifesto";
import { Classified } from "@/components/sections/Classified";
import { LiveTable } from "@/components/sections/LiveTable";
import { Format, Streets } from "@/components/sections/Format";
import { Judging } from "@/components/sections/Judging";
import { Prizes } from "@/components/sections/Prizes";
import { Workshops } from "@/components/sections/Workshops";
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
        <Reach />
        <Manifesto />
        <Classified />
        <LiveTable />
        <Format />
        <Streets />
        <Judging />
        <Prizes />
        <Workshops />
        <House />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
