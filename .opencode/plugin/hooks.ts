import type { Plugin } from "@opencode-ai/plugin";

export const HooksPlugin: Plugin = async ({ $ }) => ({
  event: async ({ event }) => {
    if (event.type === "file.edited") {
      await $`turbo fix`;
    }
    if (event.type === "session.idle") {
      await $`turbo check-types`;
    }
  },
});
