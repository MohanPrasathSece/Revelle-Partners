import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  MapPin,
  Mail,
  Briefcase,
  Phone,
  Linkedin,
  Twitter,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { RevealText } from "./RevealText";

const schema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  amount: z.string().trim().nonempty("Amount is required").max(50),
  country: z.string().trim().nonempty("Country is required").max(80),
  message: z.string().trim().max(1000).optional(),
  accredited: z.literal(true, {
    errorMap: () => ({ message: "Required for investment proposals" }),
  }),
});

const inputClass =
  "w-full rounded-2xl border border-paper-border bg-paper px-5 py-4 text-[15px] text-paper-foreground placeholder:text-paper-muted/60 transition-all duration-300 focus:border-paper-foreground/30 focus:outline-none focus:ring-2 focus:ring-lime/60";

const contactItems = [
  { icon: MapPin, label: "Office", value: "One Canada Square, Level 39, London" },
  { icon: Mail, label: "Email", value: "invest@soltera.finance" },
  { icon: Briefcase, label: "Investment Desk", value: "desk@soltera.finance" },
  { icon: Phone, label: "Phone", value: "+44 20 7946 0958" },
];

export function ContactSection() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      amount: fd.get("amount"),
      country: fd.get("country"),
      message: fd.get("message") || undefined,
      accredited: fd.get("accredited") === "on",
    });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSuccess(true);
  };

  return (
    <section id="contact" className="bg-background px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1440px] rounded-[48px] bg-paper px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-paper-muted">
          04 — Contact
        </p>
        <h2 className="text-display max-w-4xl text-5xl text-paper-foreground sm:text-6xl lg:text-[5.5rem]">
          <RevealText text="Let's Build Wealth" />
          <br />
          <RevealText text="Together." className="text-paper-muted" />
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          {/* Left — contact info */}
          <div>
            <ul className="space-y-8">
              {contactItems.map(({ icon: Icon, label, value }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper-foreground text-paper">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-paper-muted">
                      {label}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-paper-foreground">
                      {value}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <Magnetic key={label} strength={0.3}>
                  <a
                    href="#contact"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-paper-border text-paper-foreground transition-all duration-300 hover:bg-paper-foreground hover:text-paper"
                  >
                    <Icon className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative rounded-[40px] border border-paper-border bg-paper-card p-8 lg:p-10"
            style={{ boxShadow: "var(--shadow-card-light)" }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex size-16 items-center justify-center rounded-full bg-lime"
                  >
                    <Check className="size-7 text-lime-foreground" />
                  </motion.span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-paper-foreground">
                    Proposal requested.
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] text-paper-muted">
                    Our investment desk will contact you within one business
                    day.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="sr-only">
                        Name
                      </label>
                      <input id="c-name" name="name" placeholder="Name" className={inputClass} />
                      {errors.name && (
                        <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="sr-only">
                        Email
                      </label>
                      <input id="c-email" name="email" type="email" placeholder="Email" className={inputClass} />
                      {errors.email && (
                        <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-amount" className="sr-only">
                        Investment amount
                      </label>
                      <input id="c-amount" name="amount" placeholder="Investment Amount" className={inputClass} />
                      {errors.amount && (
                        <p className="mt-1 text-xs text-destructive">{errors.amount}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="c-country" className="sr-only">
                        Country
                      </label>
                      <input id="c-country" name="country" placeholder="Country" className={inputClass} />
                      {errors.country && (
                        <p className="mt-1 text-xs text-destructive">{errors.country}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      placeholder="Message"
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 py-1 text-[14px] text-paper-muted">
                    <input
                      type="checkbox"
                      name="accredited"
                      className="size-4 accent-[#D7FF4B]"
                    />
                    I am an accredited investor.
                  </label>
                  {errors.accredited && (
                    <p className="-mt-2 text-xs text-destructive">{errors.accredited}</p>
                  )}
                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-paper-foreground px-8 py-4.5 text-[15px] font-semibold text-paper transition-all duration-400 hover:bg-lime hover:text-lime-foreground hover:shadow-[0_10px_40px_-10px_oklch(0.93_0.208_122/50%)]"
                    >
                      Request Investment Proposal
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
