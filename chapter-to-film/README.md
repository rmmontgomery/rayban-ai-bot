# Chapter to Film

Turns a book chapter into a narrated film. Claude reads the chapter and writes a
storyboard, choosing a treatment for each part:

| Scene | Used for | Runs |
|---|---|---|
| `derivation` | Equations revealed line by line (KaTeX) | on your PC |
| `simulation` | Pendulum, projectile, orbit, wave interference, damped spring | on your PC |
| `timeline` | History, biography | on your PC |
| `illustrated` | Narrative over a generated image | fal.ai |
| `video` | Short AI video clip (capped by `MAX_VIDEO_CLIPS`) | fal.ai |
| `title` | Opening and section breaks | on your PC |

The film is assembled on your PC with Remotion. Nothing heavy is installed:
the models run in the cloud, reached with API keys.

## Setup

Needs Node.js 20 or newer.

```bash
npm install
```

```bash
cp .env.example .env
```

Fill in `.env`. Only `ANTHROPIC_API_KEY` is required. Without a voice key the
film is silent; without `FAL_KEY` illustrated scenes are plain title cards.

## Use

Chapter to film in one step:

```bash
npm run film -- my-chapter.md
```

Or in two steps, so you can review and edit the storyboard first:

```bash
npm run film -- my-chapter.md --storyboard-only
```

```bash
npm run film -- out/my-chapter/storyboard.json
```

Try it with no keys at all (renders an 80-second sample of every local scene type):

```bash
npm run film -- examples/pendulum.storyboard.json
```

The film is written to `out/<name>/film.mp4`.

## Voice

`src/voice.ts` speaks to any service with the ElevenLabs text-to-speech
interface (`POST /v1/text-to-speech/{voice_id}`). To use another voice studio,
set `VOICE_BASE_URL` to its address if it offers the same interface, or adapt
that one file.

## Not built yet

- Jev scene classification (Claude chooses the scene types for now).
- The image editor step between image generation and rendering.
- AI video clips shorter than their scene hold on the last frame.

## Licence note

Remotion is free for individuals and companies of up to three people; larger
companies need a Remotion licence.
