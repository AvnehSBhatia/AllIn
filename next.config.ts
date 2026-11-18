import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: {
    root: import.meta.dirname, // a stray lockfile higher up would otherwise be picked as the root
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
