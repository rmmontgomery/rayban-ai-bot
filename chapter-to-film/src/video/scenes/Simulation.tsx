import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../../schema";
import { orbit, pendulumAngle, projectile, spring, wave } from "../sim";
import { theme } from "../theme";
import { Heading } from "./Heading";

type Sim = Extract<TimedScene, { type: "simulation" }>;
const W = 1700;
const H = 700;

const Pendulum = ({ t, s }: { t: number; s: Sim }) => {
  const L = Math.min(1, Math.max(0.3, s.b)) * 520;
  const trail = [0.24, 0.16, 0.08, 0].map((back) => pendulumAngle(Math.max(0, t - back), s.a, s.b));
  return (
    <>
      <line x1={W / 2 - 200} y1={60} x2={W / 2 + 200} y2={60} stroke={theme.dim} strokeWidth={6} />
      {trail.map((th, i) => {
        const x = W / 2 + L * Math.sin(th);
        const y = 60 + L * Math.cos(th);
        const last = i === trail.length - 1;
        return (
          <g key={i} opacity={last ? 1 : 0.12 + i * 0.1}>
            {last ? <line x1={W / 2} y1={60} x2={x} y2={y} stroke={theme.ink} strokeWidth={4} /> : null}
            <circle cx={x} cy={y} r={38} fill={theme.accent} />
          </g>
        );
      })}
    </>
  );
};

const Projectile = ({ t, s }: { t: number; s: Sim }) => {
  const now = projectile(t, s.a, s.b);
  const scale = Math.min((W - 200) / now.range, (H - 160) / now.apex);
  const px = (x: number) => 100 + x * scale;
  const py = (y: number) => H - 60 - y * scale;
  // Sample the parabola up to the current point of this flight.
  const pts: string[] = [];
  for (let x = 0; x <= now.x + 1e-9; x += now.range / 120) {
    const u = x / now.range;
    pts.push(`${px(x)},${py(4 * now.apex * u * (1 - u))}`);
  }
  return (
    <>
      <line x1={60} y1={H - 60} x2={W - 60} y2={H - 60} stroke={theme.dim} strokeWidth={4} />
      <polyline points={pts.join(" ")} fill="none" stroke={theme.accent2} strokeWidth={5} strokeDasharray="14 10" />
      <circle cx={px(now.x)} cy={py(now.y)} r={26} fill={theme.accent} />
    </>
  );
};

const Orbit = ({ t, s }: { t: number; s: Sim }) => {
  const bodies = Math.round(Math.min(3, Math.max(1, s.b)));
  const e = Math.min(0.8, Math.max(0, s.a));
  return (
    <>
      <circle cx={W / 2} cy={H / 2} r={46} fill={theme.accent} />
      {Array.from({ length: bodies }, (_, i) => {
        const a = 170 + i * 85; // semi-major axis in pixels
        const period = 6 * (a / 170) ** 1.5; // Kepler's third law
        const p = orbit(t, e, period);
        return (
          <g key={i}>
            <ellipse cx={W / 2 - a * e} cy={H / 2} rx={a} ry={a * Math.sqrt(1 - e * e)} fill="none" stroke={theme.dim} strokeWidth={2} />
            <circle cx={W / 2 + a * p.x} cy={H / 2 - a * p.y} r={18 - i * 3} fill={theme.accent2} />
          </g>
        );
      })}
    </>
  );
};

const Wave = ({ t, s }: { t: number; s: Sim }) => {
  const cols = 85;
  const rows = 35;
  const cell = W / cols;
  const cells = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const h = wave(c / cols, 0.5 + ((r - rows / 2) * cell) / W, t, s.a, s.b);
      cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 1} height={cell + 1} fill={theme.accent2} opacity={0.5 + 0.5 * h} />);
    }
  return <>{cells}</>;
};

const Spring = ({ t, s }: { t: number; s: Sim }) => {
  const x = W / 2 + spring(t, s.a, s.b) * 420;
  const coils = 14;
  const pts = [`80,${H / 2}`];
  for (let i = 1; i < coils; i++) pts.push(`${80 + ((x - 80 - 70) * i) / coils},${H / 2 + (i % 2 ? -50 : 50)}`);
  pts.push(`${x - 70},${H / 2}`);
  return (
    <>
      <line x1={80} y1={H / 2 - 160} x2={80} y2={H / 2 + 160} stroke={theme.dim} strokeWidth={8} />
      <line x1={W / 2} y1={H / 2 + 110} x2={W / 2} y2={H / 2 + 150} stroke={theme.dim} strokeWidth={3} />
      <polyline points={pts.join(" ")} fill="none" stroke={theme.ink} strokeWidth={5} />
      <rect x={x - 70} y={H / 2 - 70} width={140} height={140} rx={12} fill={theme.accent} />
    </>
  );
};

export const Simulation = ({ scene }: { scene: Sim }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const View = { pendulum: Pendulum, projectile: Projectile, orbit: Orbit, wave: Wave, spring: Spring }[scene.kind];
  return (
    <AbsoluteFill>
      <Heading>{scene.heading}</Heading>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 210, left: 110, width: W, height: H }}>
        <View t={t} s={scene} />
      </svg>
      <div style={{ position: "absolute", bottom: 60, left: 110, right: 110, fontSize: 36, color: theme.dim }}>{scene.caption}</div>
    </AbsoluteFill>
  );
};
