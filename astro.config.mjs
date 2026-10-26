// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ohrt.dev",
  build: { inlineStylesheets: "always" },
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" }
});
