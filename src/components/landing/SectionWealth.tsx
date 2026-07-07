import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Globe2, LineChart } from "lucide-react";
import { RevealText } from "./RevealText";

const chips = [
  "Blockchain Infrastructure",
  "AI Trading",
  "Tokenized Assets",
  "Bitcoin",
  "Ethereum",
  "Real World Assets",
  "Institutional Funds",
  "DeFi",
  "Yield",
  "Infrastructure",
];

function useCardGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return { ref, onMove };
}

const cardMotion = {
  initial: { opacity: 0, y: 48, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-8% 0px" },
};

function BentoCard({
  icon,
  title,
  body,
  visual,
  delay,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  visual: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const { ref, onMove } = useCardGlow();
  return (
    <motion.div
      {...cardMotion}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        className="card-glow-light group relative flex h-full flex-col justify-between overflow-hidden rounded-[40px] border border-paper-border bg-paper-card p-8 transition-all duration-500 hover:-translate-y-2 lg:p-10"
        style={{ boxShadow: "var(--shadow-card-light)" }}
      >
        <div>
          <div className="mb-6 inline-flex size-11 items-center justify-center rounded-2xl bg-paper-foreground text-paper transition-transform duration-500 group-hover:rotate-6">
            {icon}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-paper-foreground">
            {title}
          </h3>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-paper-muted">
            {body}
          </p>
        </div>
        <div className="mt-8">{visual}</div>
      </div>
    </motion.div>
  );
}

/* --- Card visuals --- */

function GraphVisual() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" aria-hidden>
      <defs>
        <linearGradient id="graphFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7FF4B" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#D7FF4B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 95 C40 90, 60 70, 95 72 S150 45, 185 48 S250 22, 320 12"
        fill="none"
        stroke="#151515"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M0 95 C40 90, 60 70, 95 72 S150 45, 185 48 S250 22, 320 12 V110 H0 Z"
        fill="url(#graphFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 1 }}
      />
      <motion.circle
        r="5"
        fill="#D7FF4B"
        stroke="#151515"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.6 }}
        cx="320"
        cy="12"
      />
    </svg>
  );
}

function ShieldVisual() {
  return (
    <div className="relative mx-auto flex size-28 items-center justify-center">
      <span className="animate-pulse-ring absolute inset-0 rounded-full border border-paper-foreground/20" />
      <span
        className="animate-pulse-ring absolute inset-0 rounded-full border border-paper-foreground/10"
        style={{ animationDelay: "0.8s" }}
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex size-16 items-center justify-center rounded-3xl bg-paper-foreground"
      >
        <ShieldCheck className="size-7 text-accent" />
      </motion.div>
    </div>
  );
}

function NetworkVisual() {
  const nodes = [
    [30, 70],
    [90, 25],
    [160, 60],
    [230, 20],
    [290, 65],
    [130, 95],
    [250, 90],
  ];
  return (
    <svg viewBox="0 0 320 110" className="w-full" aria-hidden>
      {nodes.map(([x1, y1], i) =>
        nodes.slice(i + 1, i + 3).map(([x2, y2], j) => (
          <motion.line
            key={`${i}-${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#151515"
            strokeOpacity="0.18"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 * i }}
          />
        )),
      )}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 5 : 3.5}
          fill={i % 3 === 0 ? "#D7FF4B" : "#151515"}
          stroke="#151515"
          strokeWidth={i % 3 === 0 ? 1.5 : 0}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * i, duration: 0.5, ease: "backOut" }}
        />
      ))}
    </svg>
  );
}

function MetricsVisual() {
  const metrics = [
    { label: "Net AUM growth", value: "+38.4%" },
    { label: "Fund uptime", value: "99.99%" },
    { label: "Avg. drawdown control", value: "-4.2%" },
  ];
  return (
    <div className="space-y-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between rounded-2xl border border-paper-border px-4 py-3"
        >
          <span className="text-[13px] text-paper-muted">{m.label}</span>
          <span className="font-mono text-sm font-bold text-paper-foreground">
            {m.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function SectionWealth() {
  return (
    <section id="about" className="bg-background px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[1440px] rounded-[48px] bg-paper px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-paper-muted">
            02 — The Mandate
          </p>
          <h2 className="text-display max-w-4xl text-5xl text-paper-foreground sm:text-6xl lg:text-[5.5rem]">
            <RevealText text="Built For" />
            <br />
            <RevealText text="Long-Term" />
            <br />
            <RevealText text="Digital Wealth." className="text-paper-muted" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-paper-muted"
          >
            We allocate capital across the highest-conviction sectors of the
            digital economy — managed with the discipline of traditional
            institutional finance.
          </motion.p>
        </div>

        {/* Infinite chips marquee */}
        <div className="marquee-mask mt-16 overflow-hidden" aria-hidden>
          <div className="animate-marquee flex w-max gap-3">
            {[...chips, ...chips].map((chip, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-paper-border bg-paper-card px-5 py-2.5 text-[13px] font-medium text-paper-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-2">
          <BentoCard
            delay={0}
            icon={<Activity className="size-5" />}
            title="AI Portfolio Management"
            body="Quantitative models rebalance exposure continuously across market regimes."
            visual={<GraphVisual />}
          />
          <BentoCard
            delay={0.12}
            icon={<ShieldCheck className="size-5" />}
            title="Institutional Security"
            body="Multi-signature custody, cold storage, and audited operational controls."
            visual={<ShieldVisual />}
          />
          <BentoCard
            delay={0.24}
            icon={<Globe2 className="size-5" />}
            title="Global Blockchain Exposure"
            body="Diversified positions across L1s, infrastructure, and tokenized real-world assets."
            visual={<NetworkVisual />}
          />
          <BentoCard
            delay={0.36}
            icon={<LineChart className="size-5" />}
            title="Real-Time Performance"
            body="Transparent reporting with live fund metrics and monthly investor statements."
            visual={<MetricsVisual />}
          />
        </div>
      </div>
    </section>
  );
}
