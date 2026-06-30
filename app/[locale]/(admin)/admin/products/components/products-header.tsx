"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductsHeaderProps {
  initialSearch?: string;
}

export function ProductsHeader({ initialSearch = "" }: ProductsHeaderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params?.locale as string) ?? "en";

  const [isPending, startTransition] = useTransition();
  const [hasQuery, setHasQuery] = useState(!!initialSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const previousQuery = useRef(initialSearch);

  // Restore focus after navigation completes
  useEffect(() => {
    if (!isPending && hasQuery) inputRef.current?.focus();
  }, [isPending, hasQuery]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        if (previousQuery.current === query) return;
        previousQuery.current = query;
        setHasQuery(query.length > 0);

        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        const qs = params.toString();

        startTransition(() => {
          router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
        });
      }, 500);
    },
    [pathname, router],
  );

  const handleClear = useCallback(() => {
    previousQuery.current = "";
    setHasQuery(false);
    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => {
      router.replace(pathname);
    });
  }, [pathname, router]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center px-4 lg:px-6">
      {/* Search */}
      <div className="relative flex-1">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
        <Input
          ref={inputRef}
          defaultValue={initialSearch}
          placeholder="Search products..."
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
          className="h-9 pl-9 pr-9 border-tide/30 focus-visible:border-tide focus-visible:ring-tide/30 placeholder:text-text-tertiary"
        />
        {isPending ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 animate-spin rounded-full border-2 border-tide border-t-transparent" />
          </div>
        ) : hasQuery ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-tide/10"
          >
            <IconX className="size-4 text-text-secondary" />
          </button>
        ) : null}
      </div>

      {/* Add Product */}
      <Button
        onClick={() => router.push(`/${locale}/admin/products/add`)}
        className="bg-tide text-pearl hover:bg-tide/90 flex items-center gap-2"
        size="sm"
      >
        <IconPlus className="size-4" />
        <span>Add Product</span>
      </Button>
    </div>
  );
}
