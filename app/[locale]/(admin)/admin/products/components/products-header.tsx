"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRICE_MAX = 10_000;

interface Merchant {
  id: string;
  business_name: string;
}

interface ProductsHeaderProps {
  initialSearch?: string;
  initialMerchant?: string;
  initialStatus?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  merchants?: Merchant[];
}

export function ProductsHeader({
  initialSearch = "",
  initialMerchant,
  initialStatus,
  initialMinPrice,
  initialMaxPrice,
  merchants = [],
}: ProductsHeaderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params?.locale as string) ?? "en";

  const [isPending, startTransition] = useTransition();
  const [hasQuery, setHasQuery] = useState(!!initialSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const previousQuery = useRef(initialSearch);

  // Dropdown state
  const [currentMerchant, setCurrentMerchant] = useState(initialMerchant ?? "");
  const [currentStatus, setCurrentStatus] = useState(initialStatus ?? "");

  // Slider state — numbers for the slider, synced to URL on commit
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice ? Math.max(0, parseFloat(initialMinPrice)) : 0,
    initialMaxPrice
      ? Math.min(PRICE_MAX, parseFloat(initialMaxPrice))
      : PRICE_MAX,
  ]);

  const isPriceFiltered = priceRange[0] > 0 || priceRange[1] < PRICE_MAX;

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
    if (currentMerchant) p.set("merchant", currentMerchant);
    if (currentStatus) p.set("status", currentStatus);
    if (priceRange[0] > 0) p.set("min", String(priceRange[0]));
    if (priceRange[1] < PRICE_MAX) p.set("max", String(priceRange[1]));
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
    [pathname, router, currentMerchant, currentStatus, priceRange],
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
  }, [pathname, router, currentMerchant, currentStatus, priceRange]);

  function handleMerchantChange(value: string) {
    const next = value === "_all" ? "" : value;
    setCurrentMerchant(next);
    const qs = buildParams({ merchant: next });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  function handleStatusChange(value: string) {
    const next = value === "_all" ? "" : value;
    setCurrentStatus(next);
    const qs = buildParams({ status: next });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  // onValueChange — update label only (no navigation while dragging)
  function handlePriceChange(values: number[]) {
    setPriceRange([values[0], values[1]]);
  }

  // onValueCommit — fires once on mouse/touch release
  function handlePriceCommit(values: number[]) {
    const [min, max] = values;
    setPriceRange([min, max]);
    const overrides: Record<string, string> = {
      min: min > 0 ? String(min) : "",
      max: max < PRICE_MAX ? String(max) : "",
    };
    const qs = buildParams(overrides);
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  function handlePriceReset() {
    setPriceRange([0, PRICE_MAX]);
    const qs = buildParams({ min: "", max: "" });
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  return (
    <div className="space-y-3 px-4 lg:px-6">
      {/* Row 1 — search + dropdowns + add */}
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
          <SelectTrigger className="h-9 w-full sm:w-36 border-tide/30 focus:border-tide focus:ring-tide/30 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Product */}
        <Button
          onClick={() => router.push(`/${locale}/admin/products/add`)}
          className="bg-tide text-pearl hover:bg-tide/90 flex shrink-0 items-center gap-2"
          size="sm"
          disabled={isPending}
        >
          <IconPlus className="size-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Row 2 — price range slider */}
      {/* <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3">
        <div className="flex min-w-[72px] flex-col">
          <span className="text-xs font-medium text-text-secondary">Price</span>
          <span className="text-xs text-text-tertiary">EGP</span>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Slider
            min={0}
            max={PRICE_MAX}
            step={50}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            disabled={isPending}
            className="[&_[data-slot=slider-range]]:bg-tide [&_[data-slot=slider-thumb]]:border-tide"
          />
          <div className="flex justify-between">
            <span className="text-xs tabular-nums text-text-secondary">
              {priceRange[0].toLocaleString()} EGP
            </span>
            <span className="text-xs tabular-nums text-text-secondary">
              {priceRange[1] >= PRICE_MAX ? `${PRICE_MAX.toLocaleString()}+ EGP` : `${priceRange[1].toLocaleString()} EGP`}
            </span>
          </div>
        </div>

        {isPriceFiltered && (
          <button
            onClick={handlePriceReset}
            className="shrink-0 rounded p-1 transition-colors hover:bg-tide/10"
            title="Reset price filter"
          >
            <IconX className="size-4 text-text-secondary" />
          </button>
        )}
      </div> */}
    </div>
  );
}
