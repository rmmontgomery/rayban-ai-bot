import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { Storyboard } from "./schema.js";

const SYSTEM = `You adapt chapters of serious non-fiction books (sciences and humanities) into narrated films of 10 to 15 minutes.

You receive one chapter and return a storyboard. The film must teach what the chapter teaches, at the chapter's level: do not simplify the content into popular science, and do not add claims the chapter does not make.

Choose the treatment each part of the chapter needs:
- "derivation": the chapter derives or manipulates a formula. Show the real steps, in order, in LaTeX. This is the heart of a mathematics or physics film; never replace a derivation with talk about it.
- "simulation": a physical system that one of the built-in simulations shows well (pendulum, projectile, orbit, wave, spring). Use it only when the simulation actually matches the system discussed.
- "timeline": history, biography, the development of an idea.
- "illustrated": narrative, description, argument. A still image carries the scene while the voice explains.
- "video": a moment that needs motion and that no simulation covers. Each clip is costly, so use at most {MAX_VIDEO} in the whole film.
- "title": the opening, and section breaks in a long chapter.

Length: the narration of all scenes together should run 1,500 to 2,100 words, about 150 words a minute. Aim for 20 to 35 scenes. The narration is heard, not read: full sentences, no bullet fragments, no "as shown in equation 3", symbols spoken as words. Write the narration in {LANGUAGE}.`;

export async function writeStoryboard(chapter: string, opts: { maxVideoClips: number; language?: string }) {
  const client = new Anthropic();
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 32000,
    output_config: { effort: "high", format: zodOutputFormat(Storyboard) },
    // If a safety filter declines a chapter (medicine, biology), retry on another model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM.replace("{MAX_VIDEO}", String(opts.maxVideoClips)).replace(
      "{LANGUAGE}",
      opts.language || "the language of the chapter",
    ),
    messages: [{ role: "user", content: `<chapter>\n${chapter}\n</chapter>` }],
  });
  if (response.stop_reason === "refusal") throw new Error("Claude declined to adapt this chapter.");
  if (response.stop_reason === "max_tokens") throw new Error("The storyboard was cut off; the chapter may be too long for one film.");
  if (!response.parsed_output) throw new Error("Claude returned a storyboard that does not match the expected format.");
  return response.parsed_output;
}
