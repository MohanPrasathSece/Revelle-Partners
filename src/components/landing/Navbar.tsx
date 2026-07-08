import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { useAuth } from "../../App";
import { AuthModals } from "./AuthModals";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, setLoginOpen, setSignupOpen } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "/#about" },
    { label: "Strategy", href: "/#strategy" },
    { label: "Performance", href: "/#performance" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? "glass-nav py-3" : "bg-transparent py-6"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10"
          aria-label="Primary"
        >
          <a
            href="/"
            className="text-sm font-extrabold uppercase tracking-[0.28em] text-foreground"
          >
            Revelle
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="link-underline text-[13px] font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <a
                  href="/loggedin"
                  className="link-underline text-[13px] font-semibold text-accent transition-colors duration-300"
                >
                  Client Portal
                </a>
              </li>
            )}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Log Out
                </button>
                <Magnetic strength={0.25}>
                  <a
                    href="/loggedin"
                    className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-accent-foreground transition-transform duration-300 hover:scale-105"
                  >
                    View Portal
                  </a>
                </Magnetic>
              </>
            ) : (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Log In
                </button>
                <Magnetic strength={0.25}>
                  <button
                    onClick={() => setSignupOpen(true)}
                    className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-accent-foreground transition-transform duration-300 hover:scale-105 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </Magnetic>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 md:hidden"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[340px] rounded-3xl border border-border bg-card p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground z-10"
                >
                  <X className="size-5" />
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">Menu</span>
                </div>

                <ul className="space-y-1">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-4 py-3 text-[14px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                  <li className="my-3 border-t border-border/50"></li>
                  {isAuthenticated ? (
                    <>
                      <li>
                        <a
                          href="/loggedin"
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-4 py-3 text-[14px] font-semibold text-accent hover:bg-accent/10 transition-colors"
                        >
                          Client Portal
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="block w-full text-left rounded-xl px-4 py-3 text-[14px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                        >
                          Log Out
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="pt-2 flex flex-col gap-3 px-2">
                      <button
                        onClick={() => {
                          setLoginOpen(true);
                          setOpen(false);
                        }}
                        className="w-full rounded-2xl border border-input bg-background/50 px-5 py-3.5 text-[14px] font-medium text-foreground hover:bg-muted/20 transition-colors"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setSignupOpen(true);
                          setOpen(false);
                        }}
                        className="w-full rounded-2xl bg-foreground px-5 py-3.5 text-[14px] font-semibold text-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        Sign Up
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <AuthModals />
    </>
  );
}
