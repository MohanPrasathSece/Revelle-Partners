import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Mail, User, Phone, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../App";
import { CountrySelect } from "./CountrySelect";
import { validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../../lib/phoneValidation";
import { toast } from "sonner";
import { Magnetic } from "./MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

type AuthMode = "signin" | "signup";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function AuthModals() {
  const { isLoginOpen, setLoginOpen, isSignupOpen, setSignupOpen, login } = useAuth();
  
  // Determine starting tab mode
  const [mode, setMode] = useState<AuthMode>("signin");

  useEffect(() => {
    if (isLoginOpen) setMode("signin");
    else if (isSignupOpen) setMode("signup");
  }, [isLoginOpen, isSignupOpen]);

  const isOpen = isLoginOpen || isSignupOpen;

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("IN");
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const resetForm = () => {
    setEmail(""); setName(""); setPhone(""); setCountry("IN");
    setErrors({}); setFeedback(null); setTouched({});
  };

  const handleClose = () => {
    setLoginOpen(false);
    setSignupOpen(false);
    resetForm();
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    if (m === "signin") {
      setLoginOpen(true);
      setSignupOpen(false);
    } else {
      setLoginOpen(false);
      setSignupOpen(true);
    }
    resetForm();
  };

  // Field validation
  const validateField = (field: keyof FieldErrors, value: string, c?: string) => {
    let err: string | undefined;
    if (field === "name") {
      err = !value.trim() ? "Full name is required." : value.trim().length < 2 ? "Name must be at least 2 characters." : undefined;
    }
    if (field === "email") {
      err = !value.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "Enter a valid email address." : undefined;
    }
    if (field === "phone") {
      err = validatePhoneNumber(value, c ?? country) ?? undefined;
    }
    setErrors(prev => ({ ...prev, [field]: err }));
    return !err;
  };

  const handleChange = (field: "name" | "email" | "phone", val: string) => {
    if (field === "name") setName(val);
    if (field === "email") setEmail(val);
    if (field === "phone") setPhone(val);

    if (touched[field]) {
      validateField(field, val);
    }
  };

  const handleBlur = (field: "name" | "email" | "phone") => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
      const val = field === "name" ? name : field === "email" ? email : phone;
      validateField(field, val);
    }
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (touched.phone) {
      validateField("phone", phone, c);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setFeedback(null);

    if (mode === "signin") {
      setTouched({ email: true });
      const emailOk = validateField("email", email);
      if (!emailOk) return;

      setLoading(true);
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          login(data.user);
          toast.success("Successfully logged in!");
          handleClose();
          window.location.href = "/loggedin";
        } else {
          setFeedback({ type: "error", message: data.error || "Login failed." });
        }
      } catch (err: any) {
      const rawMsg = (err?.message || err?.toString() || "");
      if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists")) {
        setLoading(false);
        return;
      }

        setFeedback({ type: "error", message: "Network error during login." });
      } finally {
        setLoading(false);
      }
    } else {
      setTouched({ name: true, email: true, phone: true });
      const nameOk = validateField("name", name);
      const emailOk = validateField("email", email);
      const phoneOk = validateField("phone", phone);

      if (!nameOk || !emailOk || !phoneOk) return;

      setLoading(true);
      const fullPhone = formatFullPhoneNumber(phone, country);
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone: fullPhone, countryCode: country }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          login(data.user);
          toast.success("Thank you for contacting us. Your message has been received, and our team will get back to you shortly.");
          handleClose();
          window.location.href = "/loggedin";
        } else {
          setFeedback({ type: "error", message: data.error || "Signup failed." });
        }
      } catch (err: any) {
      const rawMsg = (err?.message || err?.toString() || "");
      if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists")) {
        setLoading(false);
        return;
      }

        setFeedback({ type: "error", message: "Network error during signup." });
      } finally {
        setLoading(false);
      }
    }
  };

  function FieldIcon({ field }: { field: keyof FieldErrors }) {
    const val = field === "name" ? name : field === "email" ? email : phone;
    if (!touched[field] || !val.trim()) return null;
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

  function FieldMsg({ field, okMsg }: { field: keyof FieldErrors; okMsg: string }) {
    const val = field === "name" ? name : field === "email" ? email : phone;
    const err = errors[field];
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

  /* Shared field styling matching the vision style system */
  const fieldCls = (field: keyof FieldErrors) => {
    const val = field === "name" ? name : field === "email" ? email : phone;
    const isTouched = touched[field];
    const error = errors[field];
    const base = "w-full rounded-2xl border px-5 py-4 pr-12 text-[15px] transition-all duration-300 focus:outline-none focus:ring-2 bg-background/50 placeholder:text-muted-foreground/60 text-foreground";
    if (!isTouched || !val.trim()) return `${base} border-input focus:border-accent/40 focus:ring-accent/20`;
    if (error) return `${base} border-destructive/60 focus:border-destructive/60 focus:ring-destructive/20 bg-destructive/5`;
    return `${base} border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 bg-emerald-500/5`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-[440px] rounded-[32px] border border-border bg-card p-6 md:p-8 shadow-2xl z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gradients */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none" aria-hidden>
              <div className="absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, var(--accent), transparent 60%)" }} />
              <div className="absolute -bottom-32 -left-24 w-[320px] h-[320px] rounded-full blur-3xl opacity-15" style={{ background: "radial-gradient(circle, var(--accent), transparent 60%)" }} />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground z-10"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            {/* Logo Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Revelle Logo" className="h-5.5 w-auto object-contain" />
              <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">Revelle Vision</span>
            </div>

            {/* Mode Specific Title & Subtitle */}
            <h3 className="text-display text-[26px] leading-tight font-semibold tracking-[-0.02em] text-foreground">
              {mode === "signin" ? (
                <>Welcome back to <span className="text-accent">Revelle</span></>
              ) : (
                <>Start your <span className="text-accent">wealth journey</span></>
              )}
            </h3>
            <p className="mt-2 text-[14px] text-muted-foreground">
              {mode === "signin" ? "Sign in to access your institutional portfolio." : "Create an account in seconds. No credit card required."}
            </p>

            {/* Tabs matching Revelle Partners */}
            <div className="mt-6 relative flex p-1 rounded-full bg-muted border border-border">
              {(["signin", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`relative flex-1 h-9 rounded-full text-[13px] font-medium transition-colors ${mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="auth-tab"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-card shadow-sm border border-border"
                    />
                  )}
                  <span className="relative z-10">{m === "signin" ? "Sign In" : "Sign Up"}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {feedback && (
                <div className={`rounded-xl px-4 py-3 text-[13px] leading-relaxed ${feedback.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-destructive/10 border border-destructive/20 text-destructive"}`}>
                  {feedback.message}
                </div>
              )}

              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{ opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={e => handleChange("name", e.target.value)}
                          onBlur={() => handleBlur("name")}
                          className={fieldCls("name")}
                          disabled={loading}
                          autoComplete="name"
                        />
                        <FieldIcon field="name" />
                      </div>
                      <FieldMsg field="name" okMsg="Looks good!" />
                    </div>

                    {/* Phone + Country select */}
                    <div>
                      <div className="flex gap-2">
                        <CountrySelect
                          value={country}
                          onChange={handleCountryChange}
                          className="w-[110px] flex-shrink-0"
                          theme="dark"
                        />
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            placeholder={getCountry(country).placeholder}
                            value={phone}
                            onChange={e => handleChange("phone", e.target.value)}
                            onBlur={() => handleBlur("phone")}
                            className={fieldCls("phone")}
                            disabled={loading}
                            autoComplete="tel"
                          />
                          <FieldIcon field="phone" />
                        </div>
                      </div>
                      <FieldMsg field="phone" okMsg="Valid number" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email (Always shown) */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={fieldCls("email")}
                    disabled={loading}
                    autoComplete="email"
                  />
                  <FieldIcon field="email" />
                </div>
                <FieldMsg field="email" okMsg="Valid email" />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Magnetic strength={0.15}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        {mode === "signin" ? "Sign In" : "Create Account"}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              {/* Footer Switch Link */}
              <p className="mt-5 text-center text-[12px] text-muted-foreground">
                {mode === "signin" ? "New to Revelle?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="font-medium text-foreground hover:text-accent transition-colors"
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
