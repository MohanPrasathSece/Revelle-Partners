import React, { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../../lib/phoneValidation";
import { ChevronDown, Check, Search } from "lucide-react";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  /** Use "paper" theme for light bg sections, "dark" for dark modals */
  theme?: "paper" | "dark";
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = "",
  theme = "paper",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  );

  const isDark = theme === "dark";

  const triggerCls = isDark
    ? "flex items-center justify-between gap-1 rounded-2xl border border-input bg-background/50 px-3 py-4 text-sm text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20 transition h-[56px] w-full cursor-pointer hover:bg-muted/20 whitespace-nowrap"
    : "flex items-center justify-between gap-1 rounded-2xl border border-paper-border bg-paper px-3 py-4 text-sm text-paper-foreground outline-none focus:border-lime/40 focus:ring-2 focus:ring-lime/20 transition h-[58px] w-full cursor-pointer hover:bg-paper/80 whitespace-nowrap";

  const dropdownCls = isDark
    ? "absolute top-full left-0 z-50 mt-2 max-h-72 w-[min(270px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-2xl flex flex-col"
    : "absolute top-full left-0 z-50 mt-2 max-h-72 w-[min(270px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-paper-border bg-white p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] flex flex-col";

  const searchInputCls = isDark
    ? "w-full rounded-xl bg-muted/40 border border-border pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-accent/60 transition"
    : "w-full rounded-xl bg-paper/80 border border-paper-border pl-8 pr-3 py-1.5 text-xs text-paper-foreground outline-none focus:border-lime/60 transition";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(""); }}
        className={triggerCls}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className={`text-xs font-semibold ${isDark ? "text-foreground/80" : "text-paper-foreground/80"}`}>
            {selectedCountry.code === "GEN" ? "Other" : selectedCountry.dialCode || selectedCountry.code}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${isDark ? "text-muted-foreground" : "text-paper-muted"}`}
        />
      </button>

      {isOpen && (
        <div className={dropdownCls}>
          <div className={`relative mb-1.5 p-1 flex items-center border-b ${isDark ? "border-border" : "border-paper-border"}`}>
            <Search className={`absolute left-3 h-3.5 w-3.5 ${isDark ? "text-muted-foreground" : "text-paper-muted"}`} />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={searchInputCls}
            />
          </div>
          <div className="flex-1 overflow-y-auto max-h-52 space-y-0.5 overscroll-contain">
            {filtered.length > 0 ? (
              filtered.map((c) => {
                const isSelected = c.code === value;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onChange(c.code); setIsOpen(false); }}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-left text-xs transition duration-150 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? "bg-foreground text-background font-bold"
                          : "bg-paper-foreground text-paper font-bold"
                        : isDark
                          ? "text-foreground hover:bg-muted/40"
                          : "text-paper-foreground hover:bg-paper-border/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="font-medium line-clamp-1">{c.name}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${isSelected ? "opacity-70" : isDark ? "text-muted-foreground" : "text-paper-muted"}`}>
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className={`py-4 text-center text-xs ${isDark ? "text-muted-foreground" : "text-paper-muted"}`}>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
