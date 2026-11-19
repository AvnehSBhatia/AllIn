import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bodoni_Moda, Cinzel, EB_Garamond } from "next/font/google";
import { config } from "@/lib/config";
import "./globals.css";

const display = Bodoni_Moda({ variable: "--font-bodoni", style: ["normal", "italic"], subsets: ["latin"] });
const label = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const text = EB_Garamond({ variable: "--font-garamond", style: ["normal", "italic"], subsets: ["latin"] });

const description = `${config.sub} About ${config.capacity} seats, ${config.dateWindow}, ${config.venueCity}.`;

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: { default: `${config.name}: ${config.umbrella}`, template: `%s · ${config.name}` },
  description,
  openGraph: { title: config.name, description, type: "website", siteName: config.name },
  twitter: { card: "summary_large_image", title: config.name, description },
};

export const viewport: Viewport = { themeColor: "#030303", colorScheme: "dark" };

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
    <html lang="en" className={`${display.variable} ${label.variable} ${text.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="btn btn-brass fixed top-3 left-3 z-[99] -translate-y-24 focus:translate-y-0">
          Skip to content
        </a>
        <div aria-hidden className="room-lamp" />
        {children}
        {/* the room: vignette, grain and smoke over everything but the bar */}
        <div aria-hidden className="room">
          <div className="room-smoke one" />
          <div className="room-smoke two" />
          <div className="room-vignette" />
          <div className="room-grain" />
        </div>
      </body>
    </html>
  );
}
