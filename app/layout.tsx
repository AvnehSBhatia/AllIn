import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { config } from "@/lib/config";
import "./globals.css";

const display = Instrument_Serif({ variable: "--font-instrument", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const sans = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

const description = `${config.sub} One day, about ${config.capacity} people, a secret variant revealed at kickoff. ${config.dateWindow}.`;

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: { default: `${config.name}: ${config.umbrella}`, template: `%s · ${config.name}` },
  description,
  openGraph: { title: config.name, description, type: "website", siteName: config.name },
  twitter: { card: "summary_large_image", title: config.name, description },
};

export const viewport: Viewport = { themeColor: "#04110d", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${config.name}: ${config.umbrella}`,
  description: config.sub,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  ...(config.date ? { startDate: config.date } : {}),
  location: config.venue ? { "@type": "Place", name: config.venue, address: config.venueCity ?? undefined } : { "@type": "Place", name: "Venue TBA" },
  organizer: { "@type": "Organization", name: config.organizer, url: config.url },
  maximumAttendeeCapacity: config.capacity,
  url: config.url,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="btn btn-gold fixed top-3 left-3 z-[99] -translate-y-24 focus:translate-y-0">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
