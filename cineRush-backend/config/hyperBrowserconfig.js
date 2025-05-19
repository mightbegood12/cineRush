import { Hyperbrowser } from "@hyperbrowser/sdk";

export const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});
