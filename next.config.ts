import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // the film's stills are large and rarely change: let browsers keep them for a day and refresh in the background
  async headers() {
    return [{ source: "/intro/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] }];
  },
  turbopack: {
    root: import.meta.dirname, // a stray lockfile higher up would otherwise be picked as the root
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
