import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "../App";
import { toast } from "sonner";
import { Magnetic } from "@/components/landing/MagneticButton";

const words = [
  "ON-CHAIN LIQUIDITY METRICS",
  "ALGORITHMIC EXECUTION DESK",
  "QUANTITATIVE MARKET MODELS",
  "PORTFOLIO DIVERSIFICATION",
  "SECURE VAULT CUSTODIAL AUDITS",
  "REAL-TIME RISK MANAGEMENT",
];

export default function Education() {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  // Contact Form State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cycle through research terms
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Sync user details if context loads late
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || "");
      if (!email) setEmail(user.email || "");
      if (!phone) setPhone(user.phone || "");
    }
  }, [user]);

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast.success("Thank you for contacting us. Your message has been received, and our team will get back to you shortly.");
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
          <div className="relative pt-16 pb-6">
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
                Our proprietary intelligence framework tracking digital asset velocity, algorithmic execution parameters, and on-chain liquidity indicators.
              </p>
            </motion.div>
          </div>

          {/* Minimalist words animation showcase */}
          <div className="relative flex items-center justify-center h-[350px] w-full rounded-[24px] sm:rounded-[32px] border border-border bg-card overflow-hidden my-8" style={{ boxShadow: "var(--shadow-card)" }}>
            {/* Rotating grid background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute size-[480px] opacity-[0.03] border border-dashed border-foreground rounded-full flex items-center justify-center pointer-events-none"
            >
              <div className="size-[380px] border border-dashed border-foreground rounded-full" />
              <div className="size-[280px] border border-dashed border-foreground rounded-full" />
              <div className="size-[180px] border border-dashed border-foreground rounded-full" />
              <div className="absolute w-full h-[1px] bg-foreground/50" />
              <div className="absolute h-full w-[1px] bg-foreground/50" />
            </motion.div>

            {/* Pulsing core glow */}
            <div className="absolute size-36 rounded-full opacity-[0.08] blur-2xl" style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }} />

            {/* Content text */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">
                Active Intelligence Module
              </span>
              <div className="h-[90px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-accent"
                  >
                    {words[index]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-4 max-w-md text-center text-[10px] font-mono text-muted-foreground/60 leading-relaxed uppercase tracking-wider">
                Continuous updates from Revelle capital desks.
              </p>
            </div>
          </div>

          {/* Enquiry form Section */}
          <div className="mt-16 max-w-4xl mx-auto">
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
