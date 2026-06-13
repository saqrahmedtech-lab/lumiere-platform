import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-deep">{title}</h2>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm font-medium text-tide no-underline transition hover:text-primary-dark"
        >
          {linkLabel}
          <ArrowRight
            size={13}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
