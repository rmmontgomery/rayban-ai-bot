import { writeFile } from "node:fs/promises";

// Bitrate requested from the voice service; also used to work out clip length.
const MP3_KBPS = 128;

/**
 * Speak `text` with any ElevenLabs-compatible service and save it as an MP3.
 * Returns the clip length in seconds, or null when no voice is configured.
 */
export async function speak(text: string, file: string): Promise<number | null> {
  const { VOICE_API_KEY, VOICE_ID, VOICE_MODEL } = process.env;
  const baseUrl = process.env.VOICE_BASE_URL || "https://api.elevenlabs.io";
  if (!VOICE_API_KEY || !VOICE_ID) return null;

  const res = await fetch(`${baseUrl}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_${MP3_KBPS}`, {
    method: "POST",
    headers: { "xi-api-key": VOICE_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: VOICE_MODEL || "eleven_multilingual_v2" }),
  });
  if (!res.ok) throw new Error(`Voice service answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(file, bytes);
  return (bytes.length * 8) / (MP3_KBPS * 1000);
}
