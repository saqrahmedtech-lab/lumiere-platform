"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AdminBreadcrumbProps = {
  locale: string;
};

const ignoredSegments = new Set(["admin"]);

function formatSegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AdminBreadcrumb({ locale }: AdminBreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== locale)
    .filter((segment) => !ignoredSegments.has(segment));

  if (!segments.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const label = formatSegment(segment);

          const href = `/${locale}/admin/${segments
            .slice(0, index + 1)
            .join("/")}`;

          return (
            <div
              key={`${segment}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
