import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, BarChart3, Target } from "lucide-react";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { RevealText } from "@/components/landing/RevealText";
import { ContactSection } from "@/components/landing/ContactSection";
import { useAuth } from "../App";

// Interfaces for our simulated candlestick chart
interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Live Candlestick Simulator Component
function LiveTradingChart() {
  const [candles, setCandles] = useState<Candle[]>([
    { time: "09:00", open: 95400, high: 95800, low: 95300, close: 95650 },
    { time: "09:10", open: 95650, high: 96100, low: 95500, close: 95900 },
    { time: "09:20", open: 95900, high: 96000, low: 95600, close: 95750 },
    { time: "09:30", open: 95750, high: 96400, low: 95700, close: 96250 },
    { time: "09:40", open: 96250, high: 96600, low: 96150, close: 96500 },
    { time: "09:50", open: 96500, high: 96550, low: 96000, close: 96100 },
    { time: "10:00", open: 96100, high: 96900, low: 96050, close: 96800 },
  ]);
  const [tickerPrice, setTickerPrice] = useState(96800);
  const [priceChange, setPriceChange] = useState(1.45);
  const [isUp, setIsUp] = useState(true);

  // Simulate tick updates and new candles
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate minor price ticks
      setCandles((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        const last = { ...next[lastIndex] };

        // Random price fluctuation (-120 to +150)
        const change = Math.round((Math.random() - 0.45) * 220);
        const newClose = Math.max(94000, last.close + change);

        last.close = newClose;
        if (newClose > last.high) last.high = newClose;
        if (newClose < last.low) last.low = newClose;

        next[lastIndex] = last;
        setTickerPrice(newClose);
        setIsUp(newClose >= last.open);

        // Update overall percentage change slightly
        const pct = ((newClose - 95400) / 95400) * 100;
        setPriceChange(pct);

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Periodic creation of new candles
  useEffect(() => {
    const newCandleInterval = setInterval(() => {
      setCandles((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];

        // Format a new time label
        const [hours, minutes] = last.time.split(":").map(Number);
        let nextMin = minutes + 10;
        let nextHr = hours;
        if (nextMin >= 60) {
          nextMin = 0;
          nextHr = (hours + 1) % 24;
        }
        const newTime = `${String(nextHr).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}`;

        // Create new candle starting at the previous close
        const newCandle: Candle = {
          time: newTime,
          open: last.close,
          high: last.close,
          low: last.close,
          close: last.close,
        };

        // Shift oldest candle out, push new one in
        return [...next.slice(1), newCandle];
      });
    }, 12000); // Create a new candle every 12 seconds

    return () => clearInterval(newCandleInterval);
  }, []);

  // Constants for rendering scale inside the SVG bounding box
  const minPrice = 95000;
  const maxPrice = 97200;
  const priceRange = maxPrice - minPrice;
  const height = 220;

  const getPercentY = (price: number) => {
    // Math bounds to keep candles inside the SVG box
    const ratio = (price - minPrice) / priceRange;
    return height - Math.max(0, Math.min(height, ratio * height));
  };

  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 shadow-2xl overflow-hidden flex flex-col justify-between h-[340px]">
      {/* Background glow decoration */}
      <div className="absolute -right-24 -top-24 size-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUp ? "bg-accent" : "bg-red-500"}`} />
            <span className={`relative inline-flex rounded-full size-2 ${isUp ? "bg-accent" : "bg-red-500"}`} />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-foreground">BTC/USD LIVE TICKER</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-foreground tabular-nums">
            ${tickerPrice.toLocaleString()}
          </div>
          <div className={`font-mono text-[10px] font-bold ${priceChange >= 0 ? "text-accent" : "text-red-400"}`}>
            {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Candlestick Graphic */}
      <div className="relative flex-1 mt-6 h-40 w-full">
        <svg viewBox="0 0 460 220" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = height * ratio;
            const priceVal = maxPrice - (ratio * priceRange);
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2="400"
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text x="410" y={y + 4} className="fill-muted-foreground/60 text-[9px] font-mono" textAnchor="start">
                  ${Math.round(priceVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Current Live Ticker line */}
          <g>
            <line
              x1="0"
              y1={getPercentY(tickerPrice)}
              x2="400"
              y2={getPercentY(tickerPrice)}
              stroke={isUp ? "var(--color-accent)" : "#EF4444"}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <circle
              cx="400"
              cy={getPercentY(tickerPrice)}
              r="3.5"
              className={isUp ? "fill-accent" : "fill-red-500"}
            />
          </g>

          {/* Render Candlesticks */}
          {candles.map((candle, idx) => {
            const step = 380 / candles.length;
            const x = 20 + idx * step + step / 2;

            const openY = getPercentY(candle.open);
            const closeY = getPercentY(candle.close);
            const highY = getPercentY(candle.high);
            const lowY = getPercentY(candle.low);

            const candleUp = candle.close >= candle.open;
            const color = candleUp ? "var(--color-accent)" : "#EF4444";
            const fill = candleUp ? "rgba(215, 255, 75, 0.25)" : "rgba(239, 68, 68, 0.25)";

            return (
              <g key={idx}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={x - 7}
                  y={Math.min(openY, closeY)}
                  width="14"
                  height={Math.max(3, Math.abs(closeY - openY))}
                  fill={fill}
                  stroke={color}
                  strokeWidth="1.5"
                  rx="1.5"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 font-mono border-t border-border/40 pt-2.5 mt-3">
        <span>VOL: ${(tickerPrice * 2.5).toLocaleString()}</span>
        <span>INTERVAL: 10M Ticks</span>
      </div>
    </div>
  );
}

const strategies = [
  {
    title: "Algorithmic Rebalancing",
    desc: "AI models rebalance your portfolio in real-time, capturing micro-trends and minimizing drawdown risk.",
    icon: <BarChart3 className="size-6 text-accent" />
  },
  {
    title: "Yield Generation",
    desc: "We deploy capital across vetted PoS nodes and lending protocols to generate compounding yield.",
    icon: <Zap className="size-6 text-accent" />
  },
  {
    title: "Risk Hedging",
    desc: "Proprietary hedging strategies insulate your principal investment from extreme market volatility.",
    icon: <Shield className="size-6 text-accent" />
  },
  {
    title: "Precision Execution",
    desc: "Direct market access and smart routing execute large trades with minimal slippage.",
    icon: <Target className="size-6 text-accent" />
  }
];

export default function LoggedIn() {
  const { user } = useAuth();

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="grain relative bg-background pt-32 pb-20 overflow-hidden">
        {/* Glows */}
        <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 size-[640px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "var(--glow)" }} />
        <div aria-hidden className="pointer-events-none absolute -left-56 bottom-0 size-[520px] rounded-full opacity-[0.04] blur-[140px]" style={{ background: "var(--glow)" }} />

        {/* Section 1: Dashboard Hero with live trading widget */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-[12px] font-medium tracking-wide text-muted-foreground"
              >
                <span className="relative flex size-1.5">
                  <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-accent" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                Active Capital Strategy
              </motion.p>
              
              <h1 className="text-display text-4xl text-foreground sm:text-6xl lg:text-[4.5rem]">
                <RevealText text="Live Market" delay={0.2} />
                <br />
                <RevealText text="&amp; Execution." delay={0.4} className="text-muted-foreground" />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                className="mt-6 text-[16px] leading-relaxed text-muted-foreground"
              >
                Welcome back, <span className="text-foreground font-semibold">{user?.name || "Investor"}</span>. 
                Below is the live-updating execution engine tracking institutional block orders and rebalancing parameters active on your account.
              </motion.p>
            </div>

            {/* Right Live Trading Widget */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="lg:col-span-5 w-full"
            >
              <LiveTradingChart />
            </motion.div>
          </div>
        </section>

        {/* Section 2: Working Strategies */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {strategies.map((strategy, idx) => (
              <motion.div
                key={strategy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-[32px] border border-border bg-card p-8 transition-all duration-500 hover:border-accent/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-background border border-border">
                    {strategy.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">{strategy.title}</h3>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{strategy.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: How We Improve Invested Amount */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[40px] border border-border bg-card p-8 md:p-16 lg:p-20 relative overflow-hidden"
          >
            <div aria-hidden className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full opacity-[0.05] blur-[100px]" style={{ background: "var(--accent)" }} />
            
            <div className="max-w-3xl relative z-10">
              <h2 className="text-display text-3xl md:text-5xl lg:text-6xl text-foreground">
                <RevealText text="How we compound" />
                <br />
                <RevealText text="your capital." className="text-muted-foreground" delay={0.2} />
              </h2>
              
              <div className="mt-12 space-y-8">
                {[
                  {
                    step: "01",
                    title: "Strategic Capital Allocation",
                    desc: "We don't just hold assets; we actively put them to work. By allocating your capital across a highly diversified spread of yield-bearing protocols and liquidity pools, we generate a baseline return that outpaces traditional finance."
                  },
                  {
                    step: "02",
                    title: "Automated Compounding",
                    desc: "Yields are automatically harvested and reinvested at optimal intervals using custom smart contracts. This mathematical compounding effect exponentially increases the velocity of your wealth growth."
                  },
                  {
                    step: "03",
                    title: "Dynamic Hedging",
                    desc: "During periods of high market volatility, our systems dynamically shift exposure to stable assets. This protects the principal and preserves the compounded interest you've already accumulated."
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + (idx * 0.15) }}
                    className="flex gap-6 md:gap-8 border-b border-border/50 pb-8 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-lg font-bold text-accent pt-1">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-3">{item.title}</h4>
                      <p className="text-[14px] leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      
      {/* Section 4: Contact Form (Same as landing page) */}
      <ContactSection />
      
      <Footer />
    </SmoothScroll>
  );
}