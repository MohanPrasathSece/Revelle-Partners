import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Cpu,
  Layers,
  TrendingUp,
  ShieldAlert,
  Wallet,
  HelpCircle,
  Percent,
  Activity,
  LineChart as LucideLineChart,
  Check,
  Loader2,
  ArrowUpRight,
  ChevronRight,
  Monitor,
  CircleDot,
  Calculator,
} from "lucide-react";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "../App";
import { toast } from "sonner";
import { Magnetic } from "@/components/landing/MagneticButton";

// Define the 10 educational sections
const sections = [
  {
    id: "intro",
    title: "Introduction to Cryptocurrency",
    icon: BookOpen,
    tagline: "The Evolution of Digital Scarcity",
    description:
      "Discover how cryptographic networks created the first verifiable, peer-to-peer digital currency independent of centralized entities.",
    points: [
      "The Genesis: Solving the double-spending problem without trusted intermediaries.",
      "Decentralization: How node networks secure consensus globally.",
      "Fiat vs. Crypto: Comparing supply mechanisms, inflation schedules, and custody.",
      "Key Milestones: From Bitcoin's whitepaper in 2008 to global institutional asset status.",
    ],
  },
  {
    id: "blockchain",
    title: "Understanding Blockchain",
    icon: Layers,
    tagline: "The Distributed Ledger Technology",
    description:
      "A deep dive into block structure, hash functions, and consensus algorithms that guarantee the immutability of digital records.",
    points: [
      "Blocks & Chains: How transaction data is grouped, hashed, and linked sequentially.",
      "Consensus Mechanisms: Exploring Proof of Work (PoW) versus Proof of Stake (PoS).",
      "Smart Contracts: Programmable, self-executing contracts running on virtual machines.",
      "Public vs. Private: Comparing permissionless networks with enterprise solutions.",
    ],
  },
  {
    id: "investing",
    title: "Digital Asset Investing",
    icon: TrendingUp,
    tagline: "Allocation Strategies for Modern Markets",
    description:
      "Institutional-grade methodologies for evaluating digital assets, tokenized structures, and emerging web3 networks.",
    points: [
      "Fundamental Analysis: On-chain metrics, developer activity, and fee dynamics.",
      "Custodial Options: Multi-sig structures, institutional custodians, and self-custody.",
      "Liquid Yield: Understanding staking rewards, liquidity provisioning, and lending.",
      "Regulatory Compliance: KYC/AML compliance and tax reporting structures.",
    ],
  },
  {
    id: "trading",
    title: "Crypto Trading Basics",
    icon: Activity,
    tagline: "Order Books, Spreads, and Mechanics",
    description:
      "Learn the underlying mechanics of crypto trading: from order execution models to leverage, liquidations, and perpetual swaps.",
    points: [
      "Order Book Mechanics: Bids, asks, spreads, market makers, and order routing.",
      "Order Types: Market, limit, stop-loss, and take-profit structures.",
      "Leverage & Derivatives: Perpetual futures, margins, and funding rates.",
      "Volume & Liquidity: Evaluating depth charts and slippage impact.",
    ],
  },
  {
    id: "ai",
    title: "AI & Market Analysis",
    icon: Cpu,
    tagline: "Algorithmic and Quantitative Trading",
    description:
      "How quantitative models and artificial intelligence process vast datasets to execute trades and manage risk in milliseconds.",
    points: [
      "Sentiment Mining: AI processing of news, social channels, and institutional filings.",
      "Arbitrage Bot Logic: Exploiting micro-inefficiencies across decentralized/centralized exchanges.",
      "Predictive Analytics: Utilizing machine learning algorithms on historical order books.",
      "Model Safety: Preventing algorithm decay and managing market anomalies.",
    ],
  },
  {
    id: "diversification",
    title: "Portfolio Diversification",
    icon: Percent,
    tagline: "Structuring Asymmetric Return Profiles",
    description:
      "Strategies for building balanced digital asset exposure that capitalizes on growth while mitigating structural market risks.",
    points: [
      "Asset Sizing: Dynamic weighting between Layer-1s, DeFi, and infrastructure tokens.",
      "Correlation Matrix: How crypto assets interact with traditional equities, gold, and bonds.",
      "Rebalancing Regimes: Time-based vs. threshold-based portfolio rebalancing.",
      "Asymmetry: Capitalizing on venture-like returns with capped downside risks.",
    ],
  },
  {
    id: "risk",
    title: "Risk Management",
    icon: ShieldAlert,
    tagline: "Hedging, Drawdowns, and Safeties",
    description:
      "The critical discipline of digital wealth conservation: stop-losses, smart contract auditing, and tail-risk hedging.",
    points: [
      "Drawdown Control: Hard boundaries to protect capital reserves in volatile drops.",
      "DeFi Protocol Risk: Audits, compiler bugs, and oracle flash-loan vulnerability checks.",
      "Counterparty Risk: Evaluating liquidity status of exchanges and custodial institutions.",
      "Delta Hedging: Using options contracts to offset directional spot exposure.",
    ],
  },
  {
    id: "trends",
    title: "Market Trends",
    icon: LucideLineChart,
    tagline: "Macro Cycles and On-chain Indicators",
    description:
      "Spotting secular shifts through macro liquidity indicators, stablecoin supply ratios, and structural halving mechanics.",
    points: [
      "The Halving Cycle: Bitcoin supply contraction mechanics and historical impact.",
      "On-chain Health: Analyzing active addresses, spent output profit ratio (SOPR), and exchanges flows.",
      "Stablecoin Velocity: Measuring system-wide liquidity and capital sideline positioning.",
      "Institutional Flows: Tracking ETF net inflows and venture capital allocations.",
    ],
  },
  {
    id: "security",
    title: "Security Best Practices",
    icon: Wallet,
    tagline: "Fortifying Your Digital Sovereign Assets",
    description:
      "Essential security frameworks designed to shield digital portfolios from phishing, social engineering, and wallet drainage.",
    points: [
      "Cold Storage: Utilizing hardware wallets with air-gapped signature methods.",
      "Seed Phrase Hygiene: Cryptographic backups, offline storage, and metal plate engraving.",
      "Multi-Signature Setup: Multi-key consensus for executing large transaction volumes.",
      "Browser Sanitation: Dedicated machines, sandbox extensions, and signature verification.",
    ],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: HelpCircle,
    tagline: "Direct Answers for Institutional Inquiries",
    description:
      "Clarifying structural queries related to liquidity, audit certifications, compliance structures, and client support.",
    points: [
      "What is the minimum lock-up period? Revelle provides monthly liquidity windows for most portfolios.",
      "How is custody audited? Independent third-party security auditors verify custody vaults monthly.",
      "Are portfolios tax-optimized? Yes, Revelle utilizes tax-loss harvesting mechanisms where legally viable.",
      "What jurisdictions are supported? Revelle accommodates accredited investors from primary OECD regions.",
    ],
  },
];

export default function Education() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("intro");

  // Interactive Candlestick State
  const [candleInterval, setCandleInterval] = useState<"1H" | "4H" | "1D">("1D");
  const [candleTooltip, setCandleTooltip] = useState<string | null>(null);

  // Trading Widget State
  const [tradeAsset, setTradeAsset] = useState("BTC");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [tradeSize, setTradeSize] = useState("0.1");
  const [leverage, setLeverage] = useState(10);

  // Contact Form State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync user details if context loads late
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || "");
      if (!email) setEmail(user.email || "");
      if (!phone) setPhone(user.phone || "");
    }
  }, [user]);

  // Generate Candlestick Mock Data based on interval
  const getCandles = () => {
    const seed = candleInterval === "1H" ? 1.01 : candleInterval === "4H" ? 1.03 : 1.08;
    return [
      { t: "09:00", o: 91200, h: 91800, l: 91000, c: 91650, v: "142 BTC" },
      { t: "10:00", o: 91650, h: 92400, l: 91500, c: 92100, v: "185 BTC" },
      { t: "11:00", o: 92100, h: 92250, l: 91800, c: 91950, v: "98 BTC" },
      { t: "12:00", o: 91950, h: 93100, l: 91700, c: 92850, v: "244 BTC" },
      { t: "13:00", o: 92850, h: 93500, l: 92600, c: 93400, v: "310 BTC" },
      { t: "14:00", o: 93400, h: 93600, l: 92900, c: 93150, v: "168 BTC" },
      { t: "15:00", o: 93150, h: 94500, l: 93050, c: 94380, v: "412 BTC" },
      { t: "16:00", o: 94380, h: 94900, l: 94100, c: 94750, v: "295 BTC" },
    ].map((c) => ({
      ...c,
      o: Math.round(c.o * seed),
      h: Math.round(c.h * seed),
      l: Math.round(c.l * seed),
      c: Math.round(c.c * seed),
    }));
  };

  const currentCandles = getCandles();
  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  const handleEnquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!email.trim() || !email.includes("@")) errs.email = "A valid email is required.";
    if (!phone.trim() || phone.trim().length < 7) errs.phone = "A valid phone number is required.";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast.success("Enquiry submitted successfully!");
        setMessage("");
      } else {
        toast.error(data.error || "Submission failed.");
        setFormErrors({ form: data.error || "Submission failed." });
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error during submission.");
    } finally {
      setLoading(false);
    }
  };

  // Asset Price mapping for trading calculations
  const assetPrices: Record<string, number> = { BTC: 96800, ETH: 3450, SOL: 185 };
  const currentPrice = assetPrices[tradeAsset];
  const sizeNum = parseFloat(tradeSize) || 0;
  const positionValue = sizeNum * currentPrice;
  const marginRequired = positionValue / leverage;
  const liqPrice =
    tradeType === "BUY" ? currentPrice * (1 - 0.9 / leverage) : currentPrice * (1 + 0.9 / leverage);

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="grain relative min-h-screen bg-background pb-28 pt-24">
        {/* Soft background light */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-1/4 size-[600px] rounded-full opacity-[0.04] blur-[150px]"
          style={{ background: "var(--glow)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-1/4 size-[500px] rounded-full opacity-[0.05] blur-[130px]"
          style={{ background: "var(--accent)" }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Header section */}
          <div className="relative pt-16 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                SOLTERA DIGITAL DESK
              </span>
              <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl lg:text-[4.5rem]">
                Intelligence &amp;
                <br />
                <span className="text-muted-foreground">Market Research.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                Welcome to Revelle's premium educational portal. Below is your custom institutional
                sandbox, incorporating blockchain topics, live-simulated order book calculators, and
                interactive widgets.
              </p>
            </motion.div>
          </div>

          {/* Educational Visual Sandbox widgets */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8 pb-16">
            {/* Widget 1: Interactive Candlestick Chart */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[32px] border border-border bg-card p-4 sm:p-6 md:p-8"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-2">
                      <span className="animate-pulse-ring absolute inline-flex size-3.5 rounded-full bg-accent" />
                      <span className="relative inline-flex size-2 rounded-full bg-accent" />
                    </span>
                    <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-foreground">
                      XBT/USD Live Candlesticks
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-border p-1 bg-background/50">
                    {(["1H", "4H", "1D"] as const).map((interval) => (
                      <button
                        key={interval}
                        onClick={() => setCandleInterval(interval)}
                        className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold transition-all duration-300 ${
                          candleInterval === interval
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {interval}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-foreground">
                    ${currentCandles[currentCandles.length - 1].c.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs font-semibold text-accent">
                    +4.62% (+$
                    {Math.round(
                      currentCandles[currentCandles.length - 1].c - currentCandles[0].o,
                    ).toLocaleString()}
                    )
                  </span>
                </div>
              </div>

              {/* Candlestick Graphic */}
              <div className="relative mt-8 h-56 w-full">
                <svg viewBox="0 0 500 200" className="h-full w-full overflow-visible">
                  {/* Grid Lines */}
                  {[40, 80, 120, 160].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="var(--color-border)"
                      strokeWidth="0.75"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Render Candlesticks */}
                  {currentCandles.map((candle, i) => {
                    const step = 450 / currentCandles.length;
                    const x = 30 + i * step + step / 2;
                    const scaleFactor = 0.015;
                    const minPrice = 88000;

                    const openY = 200 - (candle.o - minPrice) * scaleFactor;
                    const closeY = 200 - (candle.c - minPrice) * scaleFactor;
                    const highY = 200 - (candle.h - minPrice) * scaleFactor;
                    const lowY = 200 - (candle.l - minPrice) * scaleFactor;

                    const isGreen = candle.c >= candle.o;
                    const strokeColor = isGreen ? "#D7FF4B" : "#FF5E5E";
                    const fillColor = isGreen
                      ? "rgba(215, 255, 75, 0.45)"
                      : "rgba(255, 94, 94, 0.45)";

                    return (
                      <g
                        key={i}
                        className="cursor-pointer group/candle"
                        onMouseEnter={() =>
                          setCandleTooltip(
                            `Time: ${candle.t} | O: $${candle.o.toLocaleString()} | C: $${candle.c.toLocaleString()} | Vol: ${candle.v}`,
                          )
                        }
                        onMouseLeave={() => setCandleTooltip(null)}
                        onClick={() => {
                          const tooltipText = `Time: ${candle.t} | O: $${candle.o.toLocaleString()} | C: $${candle.c.toLocaleString()} | Vol: ${candle.v}`;
                          setCandleTooltip(candleTooltip === tooltipText ? null : tooltipText);
                        }}
                      >
                        {/* Shadow Wick line */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={strokeColor}
                          strokeWidth="1.5"
                        />
                        {/* Candle Body */}
                        <rect
                          x={x - 8}
                          y={Math.min(openY, closeY)}
                          width="16"
                          height={Math.max(2, Math.abs(closeY - openY))}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth="1.5"
                          rx="2"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Floating tooltip */}
                <AnimatePresence>
                  {candleTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-2 left-4 rounded-xl border border-border bg-background/90 px-4 py-2 font-mono text-[11px] text-foreground shadow-lg backdrop-blur-sm"
                    >
                      {candleTooltip}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Simplified Risk Advisory Card replacing Leverage Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[32px] border border-border bg-card p-6 sm:p-8"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider">Risk Management Advisory</span>
                <h3 className="text-xl font-bold tracking-tight text-foreground mt-3 mb-4">Leverage &amp; Capital Hedging</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Leverage allows institutional accounts to expand target market exposure. While it acts as a mechanism to amplify positive compounding yields, it is highly sensitive to rapid downside spikes.
                </p>
                <p className="text-[14px] leading-relaxed text-muted-foreground mt-4">
                  Revelle Partners enforces strict multi-signature collateralized thresholds and algorithmic hedge protocols to protect your core digital assets from sudden liquidations, ensuring sustained risk-adjusted growth.
                </p>
              </div>
              <div className="mt-8 border-t border-border/40 pt-4 text-[11px] text-muted-foreground/60 font-mono">
                Leverage Exposure Limits: Managed (1x to 3x max)
              </div>
            </motion.div>
          </div>

          {/* Mac-Style browser tabs section */}
          <div
            className="rounded-[24px] sm:rounded-[32px] border border-border bg-card overflow-hidden shadow-2xl"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Mac browser window header */}
            <div className="flex items-center justify-between px-6 py-4 bg-background/40 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#FF5E5E]" />
                <span className="size-3 rounded-full bg-[#FFBB3F]" />
                <span className="size-3 rounded-full bg-[#D7FF4B]" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/40 px-4 py-1.5 text-xs text-muted-foreground font-mono">
                <Monitor className="size-3" />
                <span>soltera://research-desk</span>
              </div>
              <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Main window content (Single, simplified description) */}
            <div className="p-6 sm:p-8 md:p-12 bg-card-glow relative">
              <div className="max-w-3xl">
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
                  Market Intelligence Brief
                </span>
                <h2 className="text-display mt-3 text-3xl text-foreground sm:text-4xl">
                  Digital Asset Portfolio Research
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                  Our research framework covers the fundamental evolution of decentralized ledger networks, automated order book execution algorithms, and risk containment.
                </p>

                <div className="mt-8 border-t border-border/80 pt-8">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    Core Intelligence Pillars:
                  </h4>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="size-3" />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                        <strong>On-chain Analysis:</strong> Evaluating fee dynamics, developer momentum, and liquidity velocity.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="size-3" />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                        <strong>Algorithmic Execution:</strong> Utilizing smart routing to mitigate transaction slippage.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="size-3" />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                        <strong>Custodial Audits:</strong> Monthly multi-sig vault checks verified by independent auditors.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry form Section (Logged in Page Contact) */}
          <div className="mt-24 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[32px] sm:rounded-[40px] border border-border bg-card p-6 sm:p-8 lg:p-12 overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Background glow decoration */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full opacity-[0.06] blur-[100px]"
                style={{ background: "var(--accent)" }}
              />

              <div className="max-w-2xl">
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
                  Direct Enquiry Desk
                </span>
                <h2 className="text-display mt-3 text-3xl text-foreground sm:text-4xl">
                  Consult With Our Analyst
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Need custom metrics, leverage recommendations, or tailored portfolio allocation
                  structures? Submit your details below and an asset manager will respond.
                </p>
              </div>

              <div className="mt-10">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center text-center py-10"
                    >
                      <span className="flex size-14 items-center justify-center rounded-full bg-accent">
                        <Check className="size-6 text-accent-foreground" />
                      </span>
                      <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
                        Enquiry Received.
                      </h3>
                      <p className="mt-2 max-w-sm text-[14.5px] text-muted-foreground">
                        Thank you! Your enquiry has been received successfully.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-4" noValidate>
                      {formErrors.form && (
                        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                          {formErrors.form}
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="ed-name" className="sr-only">
                            Name
                          </label>
                          <input
                            id="ed-name"
                            name="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-accent/40 focus:outline-none"
                            disabled={isLoading}
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="ed-email" className="sr-only">
                            Email
                          </label>
                          <input
                            id="ed-email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-accent/40 focus:outline-none"
                            disabled={isLoading}
                          />
                          {formErrors.email && (
                            <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="ed-phone" className="sr-only">
                          Phone Number
                        </label>
                        <input
                          id="ed-phone"
                          name="phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-accent/40 focus:outline-none"
                          disabled={isLoading}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-destructive">{formErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="ed-message" className="sr-only">
                          Message (Optional)
                        </label>
                        <textarea
                          id="ed-message"
                          name="message"
                          placeholder="Message (Optional)"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-accent/40 focus:outline-none resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      <Magnetic strength={0.15}>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground transition-all duration-400 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Enquiry
                              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                            </>
                          )}
                        </button>
                      </Magnetic>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
