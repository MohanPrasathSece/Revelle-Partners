import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { RevealText } from "./RevealText";

const HeroScene = lazy(() => import("./HeroScene"));

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (!reduced) setMounted(true);
  }, []);

  return (
    <section
      id="top"
      className="grain relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      {/* Radial blurred light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 size-[640px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "var(--glow)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-56 bottom-0 size-[520px] rounded-full opacity-[0.04] blur-[140px]"
        style={{ background: "var(--glow)" }}
      />

      {/* 3D scene — right side */}
      {mounted && (
        <div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] md:block">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-20 lg:px-10">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-[12px] font-medium tracking-wide text-muted-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-accent" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Managed digital asset funds — institutional grade
          </motion.p>

          <h1 className="text-display text-[13.5vw] text-foreground sm:text-7xl lg:text-[6.5rem]">
            <RevealText text="Invest Beyond" delay={0.5} />
            <br />
            <RevealText
              text="Traditional Finance."
              delay={0.75}
              className="text-muted-foreground"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            Soltera manages diversified crypto investment funds and blockchain
            ventures for accredited investors and institutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.35 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.22}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
              >
                Start Investing
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a
                href="#strategy"
                className="inline-flex items-center gap-2 rounded-full border border-input px-7 py-3.5 text-[15px] font-semibold text-foreground transition-colors duration-300 hover:border-foreground/40"
              >
                View Strategy
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll to next section"
      >
        <span className="flex h-12 w-7 items-start justify-center rounded-full border border-border p-2">
          <span className="animate-scroll-dot block size-1.5 rounded-full bg-accent" />
        </span>
        <ArrowDown className="mx-auto mt-2 size-3.5 text-muted-foreground" />
      </motion.a>
    </section>
  );
}
