import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { RevealText } from "./RevealText";

import MetallicPaint from "./MetallicPaint";

export function Hero() {
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

      {/* RIGHT: Metallic Paint Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-y-0 right-0 z-0 hidden w-[45%] lg:block"
        aria-hidden
      >
        <div className="absolute inset-0 flex items-center justify-center p-20">
          <MetallicPaint
            imageSrc="/revelle-mask.svg"
            seed={42}
            scale={4}
            patternSharpness={1.2}
            noiseScale={0.5}
            speed={0.3}
            liquid={0.75}
            mouseAnimation={false}
            brightness={1.5}
            contrast={1.2}
            refraction={0.015}
            blur={0.015}
            chromaticSpread={2}
            fresnel={1}
            angle={0}
            waveAmplitude={1}
            distortion={1}
            contour={0.2}
            lightColor="#ffffff"
            darkColor="#050505"
            tintColor="#D7FF4B"
          />
        </div>
        {/* Left-edge gradient so text stays readable */}
        <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        {/* Subtle lime glow at bottom */}
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-48 w-2/3 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.93 0.208 122 / 18%)" }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-28 pb-20">
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
            Managed digital asset funds - institutional grade
          </motion.p>

          <h1 className="text-display text-[11vw] text-foreground sm:text-7xl lg:text-[6.5rem]">
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
            Revelle manages diversified crypto investment funds and blockchain ventures for
            accredited investors and institutions.
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
