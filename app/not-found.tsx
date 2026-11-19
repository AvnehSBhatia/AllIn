import Link from "next/link";
import { PlayingCard } from "@/components/ui/PlayingCard";

export const metadata = { title: "Folded" };

/** 404: a mucked hand, face down, pushed to the middle. */
export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center px-5 py-24">
      <div className="text-center">
        <div className="mx-auto flex w-max justify-center" aria-hidden>
          <PlayingCard code="7c" down w={110} className="translate-x-6 -rotate-[14deg] drop-shadow-[0_20px_30px_rgb(0_0_0/.6)]" />
          <PlayingCard code="2d" down w={110} className="-translate-x-6 translate-y-2 rotate-[9deg] drop-shadow-[0_20px_30px_rgb(0_0_0/.6)]" />
        </div>
        <p className="label mt-14 text-text-3">404 · Seven-deuce offsuit</p>
        <h1 className="h2 mx-auto mt-5 max-w-[14ch]">This page folded before the flop.</h1>
        <p className="mx-auto mt-5 max-w-[38ch] text-text-2">Whatever was here isn&apos;t anymore, or never was. The table is still open.</p>
        <Link href="/" className="btn btn-ghost mt-10">
          Back to the table
        </Link>
      </div>
    </main>
  );
}
