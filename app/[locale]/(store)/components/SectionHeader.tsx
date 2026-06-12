import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  href,
  linkLabel = "See all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-deep">{title}</h2>
      {href && (
        <a href={href} className="flex items-center gap-1 text-sm text-tide">
          {linkLabel}
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
