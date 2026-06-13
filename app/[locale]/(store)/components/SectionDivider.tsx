type SectionDividerProps = {
  variant?: "line" | "fade" | "glow";
  from?: string;
  to?: string;
  className?: string;
};

export function SectionDivider({
  variant = "line",
  from = "var(--color-surface)",
  to = "var(--color-pearl)",
  className = "",
}: SectionDividerProps) {
  if (variant === "fade") {
    return (
      <div
        aria-hidden="true"
        className={`h-10 w-full ${className}`}
        style={{
          background: `linear-gradient(to bottom, ${from}, ${to})`,
        }}
      />
    );
  }

  if (variant === "glow") {
    return (
      <div
        aria-hidden="true"
        className={`relative h-12 overflow-hidden ${className}`}
      >
        <div className="absolute left-1/2 top-1/2 h-10 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seafoam/25 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-tide/20 to-transparent" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`container mx-auto px-4 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-drift/35 to-transparent" />
    </div>
  );
}
