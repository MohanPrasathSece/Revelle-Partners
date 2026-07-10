import { useState, useCallback, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  TrendingUp,
  Lock,
  Zap,
} from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { RevealText } from "./RevealText";
import { toast } from "sonner";
import { CountrySelect } from "./CountrySelect";
import { validatePhoneNumber, getCountry } from "../../lib/phoneValidation";

/* -- Validators ------------------------------------------------ */
const validators = {
  name: (v: string) =>
    !v.trim() ? "Name is required." : v.trim().length < 2 ? "Name must be at least 2 characters." : "",
  email: (v: string) =>
    !v.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? "Enter a valid email address."
        : "",
};

function fieldCls(touched: boolean, error: string, value: string) {
  const base =
    "w-full rounded-2xl border px-5 py-4 pr-12 text-[15px] transition-all duration-300 focus:outline-none focus:ring-2 bg-paper placeholder:text-paper-muted/60 text-paper-foreground";
  if (!touched || !value.trim()) return `${base} border-paper-border focus:border-paper-foreground/30 focus:ring-lime/40`;
  if (error) return `${base} border-destructive/60 focus:border-destructive/60 focus:ring-destructive/20 bg-destructive/5`;
  return `${base} border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 bg-emerald-500/5`;
}

type Field = "name" | "email";

/* -- Trust Badge ----------------------------------------------- */
function TrustBadge({ icon: Icon, text, delay }: { icon: React.ComponentType<{ className?: string }>; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className="flex items-center gap-2.5"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-paper-foreground/8">
        <Icon className="size-3.5 text-paper-foreground/60" />
      </div>
      <span className="text-[13px] text-paper-muted">{text}</span>
    </motion.div>
  );
}

/* -- Main Component -------------------------------------------- */
export function ContactSection() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [country, setCountry] = useState("IN");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field] && field in validators) {
        const err = validators[field as Field](value);
        setErrors((prev) => ({ ...prev, [field]: err }));
      }
      if (field === "phone" && touched.phone) {
        const err = validatePhoneNumber(value, country) ?? "";
        setErrors((prev) => ({ ...prev, phone: err }));
      }
    },
    [touched, country],
  );

  const handleBlur = useCallback(
    (field: Field | "phone") => {
      if (!touched[field]) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        let err = "";
        if (field === "phone") err = validatePhoneNumber(values.phone, country) ?? "";
        else err = validators[field](values[field as Field]);
        setErrors((prev) => ({ ...prev, [field]: err }));
      }
    },
    [touched, values, country],
  );

  const handleCountryChange = (code: string) => {
    setCountry(code);
    if (touched.phone) {
      const err = validatePhoneNumber(values.phone, code) ?? "";
      setErrors((prev) => ({ ...prev, phone: err }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    const phoneErr = validatePhoneNumber(values.phone, country) ?? "";
    const errs: Record<string, string> = {
      name: validators.name(values.name),
      email: validators.email(values.email),
      phone: phoneErr,
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: getCountry(country).dialCode + values.phone.replace(/\s/g, ""),
          countryCode: country,
          message: values.message,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        toast.success("Enquiry submitted successfully!");
        setValues({ name: "", email: "", phone: "", message: "" });
        setTouched({});
        setErrors({});
        setCountry("IN");
      } else {
        toast.error(data.error || "Submission failed.");
        setErrors({ form: data.error || "Submission failed." });
      }
    } catch (err) {
      console.error("[ContactForm] Network error:", err);
      toast.error("Network error during submission.");
    } finally {
      setLoading(false);
    }
  };

  function FieldIcon({ field }: { field: string }) {
    if (!touched[field] || !values[field as keyof typeof values]?.trim()) return null;
    const err = errors[field];
    return err ? (
      <AnimatePresence>
        <motion.span key="err" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <AlertCircle className="size-4 text-destructive" />
        </motion.span>
      </AnimatePresence>
    ) : (
      <AnimatePresence>
        <motion.span key="ok" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <CheckCircle2 className="size-4 text-emerald-500" />
        </motion.span>
      </AnimatePresence>
    );
  }

  function FieldMsg({ field, okMsg }: { field: string; okMsg: string }) {
    const val = values[field as keyof typeof values] ?? "";
    const err = errors[field] ?? "";
    return (
      <AnimatePresence>
        {touched[field] && err && (
          <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3 shrink-0" />{err}
          </motion.p>
        )}
        {touched[field] && !err && val.trim() && (
          <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-emerald-500">
            <CheckCircle2 className="size-3 shrink-0" />{okMsg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  return (
    <section id="contact" className="bg-background px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1440px] rounded-[32px] sm:rounded-[48px] bg-paper px-4 py-16 sm:px-10 lg:px-20 lg:py-32">
        <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-paper-muted">
          04 - Contact
        </p>
        <h2 className="text-display max-w-4xl text-4xl text-paper-foreground sm:text-6xl lg:text-[5.5rem]">
          <RevealText text="Let's Build Wealth" />
          <br />
          <RevealText text="Together." className="text-paper-muted" />
        </h2>

        {/* Two-column layout */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-start">

          {/* LEFT: Form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative rounded-[32px] sm:rounded-[40px] border border-paper-border bg-paper-card p-6 sm:p-8 lg:p-10"
            style={{ boxShadow: "var(--shadow-card-light)" }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex size-16 items-center justify-center rounded-full bg-lime">
                    <Check className="size-7 text-lime-foreground" />
                  </motion.span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-paper-foreground">Enquiry Received.</h3>
                  <p className="mt-2 max-w-sm text-[15px] text-paper-muted">
                    Thank you! Your enquiry has been received. We will be in touch soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="space-y-5" noValidate>
                  {errors.form && (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                      {errors.form}
                    </div>
                  )}

                  {/* Name + Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-2 block text-[12px] font-medium text-paper-foreground/70">Full Name</label>
                      <div className="relative">
                        <input id="c-name" name="name" placeholder="Alexandra Chen" value={values.name}
                          onChange={(e) => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")}
                          className={fieldCls(!!touched.name, errors.name ?? "", values.name)}
                          disabled={isLoading} autoComplete="name" />
                        <FieldIcon field="name" />
                      </div>
                      <FieldMsg field="name" okMsg="Looks good!" />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="mb-2 block text-[12px] font-medium text-paper-foreground/70">Email</label>
                      <div className="relative">
                        <input id="c-email" name="email" type="email" placeholder="alex@company.com" value={values.email}
                          onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")}
                          className={fieldCls(!!touched.email, errors.email ?? "", values.email)}
                          disabled={isLoading} autoComplete="email" />
                        <FieldIcon field="email" />
                      </div>
                      <FieldMsg field="email" okMsg="Valid email" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-[12px] font-medium text-paper-foreground/70">
                      Phone Number <span className="text-paper-muted">(optional)</span>
                    </label>
                    <div className="flex gap-2">
                      <CountrySelect value={country} onChange={handleCountryChange} className="w-[120px] flex-shrink-0" theme="paper" />
                      <div className="relative flex-1">
                        <input id="c-phone" name="phone" type="tel"
                          placeholder={getCountry(country).placeholder}
                          value={values.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          className={fieldCls(!!touched.phone, errors.phone ?? "", values.phone)}
                          disabled={isLoading} autoComplete="tel" />
                        <FieldIcon field="phone" />
                      </div>
                    </div>
                    <FieldMsg field="phone" okMsg="Valid number" />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="c-message" className="mb-2 block text-[12px] font-medium text-paper-foreground/70">
                      Message <span className="text-paper-muted">(optional)</span>
                    </label>
                    <textarea id="c-message" name="message" placeholder="Tell us about your investment goals…"
                      rows={4} value={values.message} onChange={(e) => handleChange("message", e.target.value)}
                      className="w-full resize-none rounded-2xl border border-paper-border bg-paper px-5 py-4 text-[15px] text-paper-foreground placeholder:text-paper-muted/60 transition-all duration-300 focus:border-paper-foreground/30 focus:outline-none focus:ring-2 focus:ring-lime/40"
                      disabled={isLoading} />
                    {values.message && (
                      <p className="mt-1 text-right text-[11px] text-paper-muted">{values.message.length} chars</p>
                    )}
                  </div>

                  <Magnetic strength={0.15}>
                    <button type="submit" disabled={isLoading}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-paper-foreground px-8 py-4 text-[15px] font-semibold text-paper transition-all duration-300 hover:bg-lime hover:text-lime-foreground hover:shadow-[0_10px_40px_-10px_oklch(0.93_0.208_122/50%)] disabled:opacity-50">
                      {isLoading ? (
                        <><Loader2 className="size-4 animate-spin" />Sending Enquiry...</>
                      ) : (
                        <>Submit Enquiry<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" /></>
                      )}
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: Why Revelle only */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="rounded-[24px] border border-paper-border bg-paper-card p-8 space-y-5"
              style={{ boxShadow: "var(--shadow-card-light)" }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-paper-muted">
                Why Revelle
              </p>
              <TrustBadge icon={Shield} text="Regulated & compliant across 38 jurisdictions" delay={0.45} />
              <TrustBadge icon={Lock} text="Bank-grade security & fund segregation" delay={0.52} />
              <TrustBadge icon={TrendingUp} text="Consistent above-market risk-adjusted returns" delay={0.59} />
              <TrustBadge icon={Zap} text="Dedicated relationship manager assigned in 24h" delay={0.66} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
