import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "Deposit Capital", body: "Fund your allocation securely through our regulated onboarding desk." },
  { num: "02", title: "Portfolio Allocation", body: "Capital is deployed across managed funds and blockchain ventures." },
  { num: "03", title: "Risk Management", body: "Continuous hedging, drawdown limits, and exposure monitoring." },
  { num: "04", title: "Monthly Growth Reports", body: "Institutional-grade statements delivered to your investor portal." },
  { num: "05", title: "Capital Appreciation", body: "Long-term compounding across the digital asset economy." },
];

function GlobalNetwork() {
  // Abstract dot-grid world with animated connection arcs
  const dots: [number, number][] = [];
  const seedRows = [
    [8, 18, 26, 34, 46, 54, 62, 74, 84],
    [6, 14, 22, 30, 42, 58, 66, 78, 88],
    [10, 20, 28, 38, 50, 60, 70, 80],
    [12, 24, 36, 44, 56, 68, 76, 86],
    [16, 32, 48, 64, 82],
  ];
  seedRows.forEach((row, r) =>
    row.forEach((x) => dots.push([x, 18 + r * 16 + ((x * 7) % 9)])),
  );

  const arcs = [
    "M 80 40 Q 250 -20 420 60",
    "M 140 90 Q 320 20 540 50",
    "M 60 70 Q 300 130 500 90",
    "M 220 30 Q 380 100 560 70",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-24 overflow-hidden rounded-[40px] border border-border bg-secondary p-8 sm:p-12"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Global Reach
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Capital deployed across 6 continents.
          </h3>
        </div>
        <div className="flex gap-8">
          {[
            ["$2.4B+", "Assets managed"],
            ["40+", "Markets"],
            ["12yr", "Track record"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-mono text-xl font-bold text-foreground">{v}</p>
              <p className="text-[12px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 600 120" className="w-full" aria-hidden>
        {dots.map(([x, y], i) => (
          <circle
            key={i}
            cx={x * 6}
            cy={y}
            r={1.6}
            fill="#d8d8d8"
            opacity={0.22}
          />
        ))}
        {arcs.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#d8d8d8" strokeOpacity="0.1" strokeWidth="1" />
            <path
              d={d}
              fill="none"
              stroke="#D7FF4B"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeDasharray="6 60"
              className="animate-dash-flow"
              style={{ animationDelay: `${i * 1.4}s` }}
            />
          </g>
        ))}
        {[
          [80, 40],
          [420, 60],
          [540, 50],
          [140, 90],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="#D7FF4B" opacity={0.9} />
        ))}
      </svg>
    </motion.div>
  );
}

export function SectionWhy() {
  const lineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="performance"
      className="grain relative overflow-hidden bg-background py-28 lg:py-40"
    >
      {/* Soft glowing circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-64 top-32 size-[700px] rounded-full opacity-[0.05] blur-[130px]"
        style={{ background: "var(--glow)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 bottom-24 size-[560px] rounded-full opacity-[0.04] blur-[130px]"
        style={{ background: "var(--glow)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-20 lg:grid-cols-2">
          {/* Left — headline */}
          <div className="lg:sticky lg:top-32 lg:self-start" id="strategy">
            <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              03 — The Process
            </p>
            <h2 className="text-display text-5xl text-foreground sm:text-6xl lg:text-[5.5rem]">
              <RevealText text="Why Investors" />
              <br />
              <RevealText text="Choose Soltera." className="text-muted-foreground" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              A disciplined, transparent investment process — engineered for
              institutions, refined for private investors.
            </motion.p>
          </div>

          {/* Right — timeline */}
          <div ref={trackRef} className="relative pl-10">
            <div
              aria-hidden
              className="absolute left-[11px] top-2 bottom-2 w-px bg-border"
            />
            <div
              ref={lineRef}
              aria-hidden
              className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-accent"
              style={{
                boxShadow: "0 0 18px 2px oklch(0.93 0.208 122 / 40%)",
                transform: "scaleY(0)",
              }}
            />
            <ol className="space-y-16">
              {steps.map((step, i) => (
                <motion.li
                  key={step.num}
                  initial={{ opacity: 0, x: 42, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.05,
                  }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute -left-10 top-1.5 flex size-[23px] items-center justify-center"
                  >
                    <span className="size-2.5 rounded-full bg-accent" />
                  </span>
                  <p className="font-mono text-sm font-bold tracking-widest text-accent">
                    {step.num}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <GlobalNetwork />
      </div>
    </section>
  );
}
