import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "node:url";
import type { FilmProps } from "./schema.js";

/** Render the film to an MP4. `assetDir` holds the narration and media files. */
export async function renderFilm(props: FilmProps, assetDir: string, outFile: string) {
  const serveUrl = await bundle({
    entryPoint: fileURLToPath(new URL("./video/index.ts", import.meta.url)),
    publicDir: assetDir,
  });
  const browserExecutable = process.env.CHROME_PATH || undefined;
  const inputProps = props as unknown as Record<string, unknown>;
  const composition = await selectComposition({ serveUrl, id: "Film", inputProps, browserExecutable });
  let lastShown = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outFile,
    inputProps,
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastShown) console.log(`  rendering ${(lastShown = pct)}%`);
    },
  });
}
