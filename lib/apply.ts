import { z } from "zod";

/** One schema for the form and the API route. */
export const applySchema = z.object({
  name: z.string().trim().min(2, "Tell us what to call you.").max(80),
  email: z.email("That email doesn't look right.").max(120),
  affiliation: z.string().trim().min(2, "School, lab or company.").max(120),
  role: z.enum(["highschool", "researcher", "other"], "Pick one."),
  built: z.string().trim().min(30, "A few sentences, at least 30 characters.").max(1500),
  link: z.union([z.literal(""), z.url("Needs to be a full link, starting with https://").max(200)]),
  // honeypot: people never see it, bots fill it
  company: z.literal("").optional(),
});

export type Application = z.infer<typeof applySchema>;
