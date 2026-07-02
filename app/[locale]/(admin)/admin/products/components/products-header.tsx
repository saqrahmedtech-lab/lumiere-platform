"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Merchant {
  id: string;
  business_name: string;
}

interface ProductsHeaderProps {
  initialSearch?: string;
  initialStatus?: string;
  initialMerchant?: string;
  merchants?: Merchant[];
}

export function ProductsHeader({
  initialSearch = "",
  initialStatus,
  initialMerchant,
  merchants = [],
}: ProductsHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [hasQuery, setHasQuery] = useState(!!initialSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const previousQuery = useRef(initialSearch);

  const [currentStatus, setCurrentStatus] = useState(initialStatus ?? "");
  const [currentMerchant, setCurrentMerchant] = useState(initialMerchant ?? "");

  // Restore focus after navigation
  useEffect(() => {
    if (!isPending && hasQuery) inputRef.current?.focus();
  }, [isPending, hasQuery]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  function buildParams(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    const q = inputRef.current?.value.trim() ?? previousQuery.current;
    if (q) p.set("q", q);
    if (currentStatus) p.set("status", currentStatus);
    if (currentMerchant) p.set("merchant", currentMerchant);
    for (const [key, val] of Object.entries(overrides)) {
      if (val) p.set(key, val);
      else p.delete(key);
    }
    return p.toString();
  }

  const handleSearch = useCallback(
    (query: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        if (previousQuery.current === query) return;
        previousQuery.current = query;
        setHasQuery(query.length > 0);
        const qs = buildParams({ q: query.trim() });
        startTransition(() => {
          router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
        });
      }, 500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router, currentStatus, currentMerchant],
  );

  const handleClear = useCallback(() => {
    previousQuery.current = "";
    setHasQuery(false);
    if (inputRef.current) inputRef.current.value = "";
    const qs = buildParams({ q: "" });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, currentStatus, currentMerchant]);

  function handleStatusChange(value: string) {
    const next = value === "_all" ? "" : value;
    setCurrentStatus(next);
    const qs = buildParams({ status: next });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  function handleMerchantChange(value: string) {
    const next = value === "_all" ? "" : value;
    setCurrentMerchant(next);
    const qs = buildParams({ merchant: next });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  return (
    <div className="space-y-3 px-4 lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

        {/* Merchant filter */}
        {merchants.length > 0 && (
          <Select
            value={currentMerchant || "_all"}
            onValueChange={handleMerchantChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-9 w-full sm:w-44 border-tide/30 focus:border-tide focus:ring-tide/30 text-sm">
              <SelectValue placeholder="All merchants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All merchants</SelectItem>
              {merchants.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.business_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Status filter */}
        <Select
          value={currentStatus || "_all"}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="h-9 w-full sm:w-44 border-tide/30 focus:border-tide focus:ring-tide/30 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
