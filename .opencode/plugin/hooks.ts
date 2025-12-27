import type { Plugin } from "@opencode-ai/plugin";

export const HooksPlugin: Plugin = ({ $, client }) => {
  async function handleLintFailure(output: string) {
    const sessions = await client.session.list();
    if (sessions.data?.[0]?.id) {
      await client.session.promptAsync({
        path: { id: sessions.data[0].id },
        body: {
          parts: [
            {
              type: "text",
              text: `[SYSTEM REMINDER - LINT FAILED]\n\n\`\`\`\n${output}\n\`\`\`\n\nFix these lint errors before proceeding.`,
            },
          ],
        },
      });
    }
  }

  async function handleTypeCheckFailure(sessionID: string, output: string) {
    await client.session.promptAsync({
      path: { id: sessionID },
      body: {
        parts: [
          {
            type: "text",
            text: `[SYSTEM REMINDER - TYPE CHECK FAILED]\n\n\`\`\`\n${output}\n\`\`\`\n\nFix these type errors before proceeding.`,
          },
        ],
      },
    });
  }

  return Promise.resolve({
    event: async ({ event }) => {
      if (event.type === "file.edited") {
        await client.tui.showToast({
          body: { message: "Running turbo fix...", variant: "info" },
        });
        const result = await $`turbo fix`.quiet().nothrow();

        if (result.exitCode === 0) {
          await client.tui.showToast({
            body: { message: "Turbo fix successful", variant: "success" },
          });
        } else {
          await client.tui.showToast({
            body: { message: "Turbo fix failed", variant: "error" },
          });
          await handleLintFailure(result.stderr || result.stdout);
        }
      }

      if (event.type === "session.idle") {
        await client.tui.showToast({
          body: { message: "Running turbo check-types...", variant: "info" },
        });
        const result = await $`turbo check-types`.quiet().nothrow();

        if (result.exitCode === 0) {
          await client.tui.showToast({
            body: { message: "Type check successful", variant: "success" },
          });
        } else {
          await client.tui.showToast({
            body: { message: "Type check failed", variant: "error" },
          });
          await handleTypeCheckFailure(
            event.properties.sessionID,
            result.stderr || result.stdout
          );
        }
      }
    },
  });
};
