import type { DevelopmentStageKey } from "@/types/content";

type StageIllustrationKey = DevelopmentStageKey | "plan";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <rect x="1" y="1" width="318" height="198" rx="10" fill="#0b0f22" stroke="rgba(160,170,255,0.24)" />
      <path d="M1 28h318" stroke="rgba(160,170,255,0.14)" />
      <circle cx="16" cy="14.5" r="3" fill="#e879d0" opacity="0.8" />
      <circle cx="27" cy="14.5" r="3" fill="#8b7cff" opacity="0.8" />
      <circle cx="38" cy="14.5" r="3" fill="#5ee3f0" opacity="0.8" />
      <text x="160" y="18" textAnchor="middle" fontSize="8.5" letterSpacing="1.6" fill="#8a90b4" fontFamily={MONO}>
        {title}
      </text>
      {children}
    </>
  );
}

function Bars({ x, y, widths, color = "#b7bcdb", gap = 12, h = 4 }: { x: number; y: number; widths: number[]; color?: string; gap?: number; h?: number }) {
  return (
    <>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} fill={color} opacity="0.35" />
      ))}
    </>
  );
}

function Idea() {
  return (
    <Frame title="IDEA.NOTE">
      <g transform="rotate(-6 80 100)">
        <rect x="32" y="52" width="100" height="84" rx="4" fill="#8b7cff" opacity="0.2" stroke="#8b7cff" strokeOpacity="0.7" />
        <Bars x={44} y={70} widths={[70, 54, 62]} color="#eef0ff" />
        <circle cx="116" cy="124" r="4" fill="#8b7cff" />
      </g>
      <g transform="rotate(5 220 110)">
        <rect x="170" y="62" width="96" height="78" rx="4" fill="#5ee3f0" opacity="0.14" stroke="#5ee3f0" strokeOpacity="0.6" />
        <Bars x={182} y={80} widths={[60, 72, 40]} color="#eef0ff" />
      </g>
      <g transform="rotate(-3 250 60)">
        <rect x="226" y="40" width="64" height="48" rx="4" fill="#e879d0" opacity="0.16" stroke="#e879d0" strokeOpacity="0.6" />
        <Bars x={236} y={54} widths={[40, 30]} color="#eef0ff" />
      </g>
      <path d="M132 100c18-6 22-10 38-6" stroke="#8a90b4" strokeDasharray="3 4" fill="none" />
      <g stroke="#8b7cff" strokeLinecap="round" opacity="0.9">
        <path d="M62 44v-8M48 48l-5-5M76 48l5-5" />
      </g>
      <text x="32" y="170" fontSize="9" fill="#8a90b4" fontFamily={MONO}>? → what problem to solve</text>
    </Frame>
  );
}

function Plan() {
  const rows = [
    { done: true, w: 112 },
    { done: true, w: 84 },
    { done: false, w: 128 },
    { done: false, w: 96 },
  ];
  return (
    <Frame title="PLAN.MD">
      {rows.map((r, i) => (
        <g key={i} transform={`translate(28 ${48 + i * 28})`}>
          <rect width="14" height="14" rx="3" fill={r.done ? "#4d8dff" : "none"} fillOpacity="0.35" stroke={r.done ? "#4d8dff" : "#8a90b4"} />
          {r.done && <path d="M3.5 7.5l2.5 2.5 4.5-5" stroke="#eef0ff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <rect x="24" y="5" width={r.w} height="4" rx="2" fill="#b7bcdb" opacity={r.done ? 0.3 : 0.5} />
        </g>
      ))}
      <path d="M200 52v110" stroke="rgba(160,170,255,0.18)" />
      <g fontSize="8" fontFamily={MONO} fill="#8a90b4">
        <text x="216" y="56">STACK</text>
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={216 + i * 30} y="64" width="24" height="14" rx="3" fill="none" stroke="#8b7cff" strokeOpacity="0.6" />
      ))}
      <text x="216" y="104" fontSize="8" fontFamily={MONO} fill="#8a90b4">STEPS</text>
      <circle cx="222" cy="124" r="5" fill="#5ee3f0" opacity="0.8" />
      <circle cx="262" cy="124" r="5" fill="none" stroke="#5ee3f0" strokeOpacity="0.7" />
      <circle cx="302" cy="124" r="5" fill="none" stroke="#8a90b4" strokeOpacity="0.7" />
      <path d="M229 124h26M269 124h26" stroke="#8a90b4" strokeDasharray="2 3" />
    </Frame>
  );
}

function Build() {
  return (
    <Frame title="EDITOR · CLAUDE CODE">
      <rect x="1" y="29" width="30" height="170" fill="rgba(160,170,255,0.04)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <text key={i} x="16" y={50 + i * 16} fontSize="8" textAnchor="middle" fontFamily={MONO} fill="#8a90b4">{i + 1}</text>
      ))}
      <Bars x={42} y={46} widths={[70, 100, 54, 88]} color="#8b7cff" gap={16} />
      <rect x="54" y="78" width="80" height="4" rx="2" fill="#5ee3f0" opacity="0.4" />
      <rect x="54" y="94" width="60" height="4" rx="2" fill="#4d8dff" opacity="0.45" />
      <rect x="42" y="110" width="2" height="9" fill="#eef0ff" className="animate-pulse" />
      <g>
        <rect x="170" y="42" width="136" height="120" rx="8" fill="#8b7cff" fillOpacity="0.12" stroke="#8b7cff" strokeOpacity="0.55" />
        <circle cx="184" cy="56" r="4" fill="#8b7cff" />
        <text x="194" y="59" fontSize="8" letterSpacing="1.2" fill="#b7bcdb" fontFamily={MONO}>AI SUGGESTION</text>
        <rect x="182" y="72" width="112" height="14" rx="3" fill="#7cf0b4" fillOpacity="0.14" />
        <text x="188" y="82" fontSize="8" fill="#7cf0b4" fontFamily={MONO}>+ render(items)</text>
        <rect x="182" y="90" width="112" height="14" rx="3" fill="#7cf0b4" fillOpacity="0.14" />
        <text x="188" y="100" fontSize="8" fill="#7cf0b4" fontFamily={MONO}>+ handle(error)</text>
        <rect x="182" y="108" width="112" height="14" rx="3" fill="#e879d0" fillOpacity="0.12" />
        <text x="188" y="118" fontSize="8" fill="#e879d0" fontFamily={MONO}>- legacy()</text>
        <rect x="182" y="136" width="48" height="16" rx="8" fill="#8b7cff" />
        <text x="206" y="147" fontSize="8" textAnchor="middle" fill="#fff" fontFamily={MONO}>ACCEPT</text>
        <rect x="238" y="136" width="48" height="16" rx="8" fill="none" stroke="#8a90b4" />
        <text x="262" y="147" fontSize="8" textAnchor="middle" fill="#b7bcdb" fontFamily={MONO}>REVIEW</text>
      </g>
    </Frame>
  );
}

function Debug() {
  return (
    <Frame title="TERMINAL">
      <g fontFamily={MONO} fontSize="9.5">
        <text x="20" y="52" fill="#8a90b4">$ run app</text>
        <text x="20" y="72" fill="#e879d0">✕ Error: value is undefined</text>
        <text x="20" y="86" fill="#8a90b4" opacity="0.8">    at render (view:42)</text>
        <path d="M20 100h280" stroke="rgba(160,170,255,0.14)" strokeDasharray="3 4" />
        <text x="20" y="120" fill="#b7bcdb">↳ paste error to Claude Code</text>
        <text x="20" y="138" fill="#8b7cff">● patch applied</text>
        <text x="20" y="156" fill="#8a90b4">$ run app</text>
        <text x="20" y="176" fill="#7cf0b4">✓ runs as expected</text>
        <rect x="128" y="167" width="6" height="11" fill="#eef0ff" className="animate-pulse" />
      </g>
    </Frame>
  );
}

function Final() {
  return (
    <Frame title="FINAL PRODUCT">
      <rect x="14" y="40" width="292" height="146" rx="6" fill="#10142b" stroke="rgba(160,170,255,0.14)" />
      <rect x="14" y="40" width="292" height="18" rx="6" fill="rgba(160,170,255,0.06)" />
      <rect x="24" y="47" width="30" height="4" rx="2" fill="#eef0ff" opacity="0.6" />
      <Bars x={230} y={47} widths={[16, 16, 16]} gap={0} />
      <rect x="236" y="47" width="16" height="4" rx="2" fill="#b7bcdb" opacity="0.35" />
      <rect x="258" y="47" width="16" height="4" rx="2" fill="#b7bcdb" opacity="0.35" />
      <rect x="24" y="72" width="170" height="52" rx="6" fill="url(#fin-g)" />
      <rect x="34" y="84" width="90" height="6" rx="3" fill="#eef0ff" opacity="0.85" />
      <rect x="34" y="98" width="130" height="4" rx="2" fill="#eef0ff" opacity="0.4" />
      <rect x="34" y="108" width="40" height="10" rx="5" fill="#eef0ff" opacity="0.9" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={24 + i * 58} y="136" width="52" height="40" rx="4" fill="none" stroke="rgba(160,170,255,0.3)" />
      ))}
      <circle cx="262" cy="110" r="26" fill="#7cf0b4" fillOpacity="0.12" stroke="#7cf0b4" strokeOpacity="0.7" />
      <path d="M250 110l8 8 15-17" stroke="#7cf0b4" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="fin-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b7cff" />
          <stop offset="1" stopColor="#4d8dff" />
        </linearGradient>
      </defs>
    </Frame>
  );
}

const MAP: Record<StageIllustrationKey, () => React.JSX.Element> = {
  idea: Idea,
  plan: Plan,
  prototype: Plan,
  build: Build,
  debug: Debug,
  final: Final,
};

/** Small decorative interface illustration for a journey stage (aria-hidden). */
export function StageIllustration({ stage }: { stage: StageIllustrationKey }) {
  const Art = MAP[stage];
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  );
}

export const JOURNEY_ART_ORDER: StageIllustrationKey[] = ["idea", "plan", "build", "debug", "final"];
