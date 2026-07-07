export function Footer() {
  return (
    <footer className="bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-foreground">
          Soltera
        </p>
        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Soltera Finance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
