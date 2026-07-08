import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-10">
        <Link to="/" className="text-sm font-extrabold uppercase tracking-[0.28em] text-foreground">
          Revelle
        </Link>

        {/* Legal navigation links */}
        <div className="flex items-center gap-6 text-[13px] text-muted-foreground">
          <Link
            to="/privacy-policy"
            className="hover:text-foreground transition-colors duration-300 link-underline"
          >
            Privacy Policy
          </Link>
          <span className="size-1 rounded-full bg-border" />
          <Link
            to="/terms-conditions"
            className="hover:text-foreground transition-colors duration-300 link-underline"
          >
            Terms &amp; Conditions
          </Link>
        </div>

        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Revelle Partners. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
