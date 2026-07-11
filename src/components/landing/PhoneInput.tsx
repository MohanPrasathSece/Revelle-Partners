import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { COUNTRIES, validateLocalPhone, type Country } from "@/lib/phoneCountries";

interface PhoneInputProps {
  /** Called whenever the full number or validation state changes */
  onChange: (full: string, error: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /** Optional initial country ISO code */
  defaultCountry?: string;
  /** base input class skin — dark (modals) or light (contact section) */
  skin?: "dark" | "light";
}

export function PhoneInput({
  onChange,
  onBlur,
  disabled = false,
  defaultCountry = "GB",
  skin = "dark",
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountry) ?? COUNTRIES[0],
  );
  const [local, setLocal] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const handleCountrySelect = (c: Country) => {
    setSelected(c);
    setOpen(false);
    setSearch("");
    // Re-validate with new country
    if (touched) {
      const err = validateLocalPhone(local, c);
      setError(err);
      onChange(`${c.dial}${local}`, err);
    }
    console.log(`%c[PhoneInput] Country selected: ${c.name} ${c.dial}`, "color:#D7FF4B;font-weight:bold");
  };

  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocal(val);
    const err = touched ? validateLocalPhone(val, selected) : "";
    setError(err);
    const full = `${selected.dial}${val}`;
    console.log(`%c[PhoneInput] phone:`, "color:#D7FF4B;font-weight:bold", full, err ? `error: ${err}` : "valid");
    onChange(full, err);
  };

  const handleLocalBlur = () => {
    setTouched(true);
    const err = validateLocalPhone(local, selected);
    setError(err);
    onChange(`${selected.dial}${local}`, err);
    onBlur?.();
    console.log(`%c[PhoneInput] blur - error: "${err || "none"}"`, "color:#aaa");
  };

  // Determine input visual state
  const isValid = touched && local.trim() && !error;
  const isInvalid = touched && !!error;

  // Skin-aware classes
  const baseInputCls =
    skin === "dark"
      ? "bg-background/50 text-foreground placeholder:text-muted-foreground/60 border-input"
      : "bg-paper text-paper-foreground placeholder:text-paper-muted/60 border-paper-border";

  const validCls = isValid ? "border-emerald-500/50 bg-emerald-500/5" : "";
  const invalidCls = isInvalid ? "border-destructive/60 bg-destructive/5" : "";

  const btnCls =
    skin === "dark"
      ? "border-input bg-background/50 text-foreground hover:bg-card"
      : "border-paper-border bg-paper text-paper-foreground hover:bg-paper-muted/10";

  const dropCls =
    skin === "dark"
      ? "bg-card border-border text-foreground"
      : "bg-white border-paper-border text-paper-foreground";

  const hoverRowCls =
    skin === "dark" ? "hover:bg-white/5" : "hover:bg-paper-foreground/5";

  return (
    <div className="space-y-0">
      <div className="flex gap-2">
        {/* Country selector */}
        <div ref={dropRef} className="relative shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((p) => !p)}
            className={`flex h-full min-h-[54px] items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 ${btnCls} ${isValid ? "border-emerald-500/50" : ""} ${isInvalid ? "border-destructive/60" : ""}`}
          >
            <span className="text-xl leading-none">{selected.flag}</span>
            <span className="font-mono text-xs font-semibold">{selected.dial}</span>
            <ChevronDown
              className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border shadow-2xl backdrop-blur-sm ${dropCls}`}
              >
                {/* Search */}
                <div className="p-2 border-b border-inherit">
                  <div className="flex items-center gap-2 rounded-xl border border-inherit px-3 py-2">
                    <Search className="size-3.5 shrink-0 opacity-40" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full bg-transparent text-xs outline-none placeholder:opacity-40"
                    />
                  </div>
                </div>

                {/* Country list */}
                <ul className="max-h-52 overflow-y-auto p-1">
                  {filtered.length === 0 && (
                    <li className="px-3 py-4 text-center text-xs opacity-40">No results</li>
                  )}
                  {filtered.map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => handleCountrySelect(c)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 ${hoverRowCls} ${selected.code === c.code ? "font-semibold" : ""}`}
                      >
                        <span className="text-lg leading-none">{c.flag}</span>
                        <span className="flex-1 truncate text-xs">{c.name}</span>
                        <span className="font-mono text-[11px] opacity-50">{c.dial}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Local number input */}
        <div className="relative flex-1">
          
<input
            type="tel"
            placeholder={selected.placeholder}
            value={local}
            onChange={handleLocalChange}
            onBlur={handleLocalBlur}
            disabled={disabled}
            className={`w-full rounded-2xl border px-5 py-4 pr-11 text-[15px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 ${baseInputCls} ${validCls} ${invalidCls}`}
           />
          {/* Status icon */}
          <AnimatePresence mode="wait">
            {touched && local.trim() && (
              <motion.span
                key={isInvalid ? "err" : "ok"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              >
                {isInvalid ? (
                  <AlertCircle className="size-4 text-destructive" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Validation message - only for phone */}
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
          >
            <AlertCircle className="size-3 shrink-0" />
            {error}
          </motion.p>
        )}
        {touched && !error && local.trim() && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-emerald-500"
          >
            <CheckCircle2 className="size-3 shrink-0" />
            Valid {selected.name} number
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
