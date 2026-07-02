"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { MerchantProductOption } from "@/utils/supabase/queries/get-merchant-products";

const PAGE_SIZE = 4;

type MerchantGroup = {
  merchantId: string;
  businessName: string;
  products: MerchantProductOption[];
};

export function MerchantProductPicker({
  products,
  selectedId,
  onSelect,
  onTabChange,
}: {
  products: MerchantProductOption[];
  selectedId: string | null;
  onSelect: (product: MerchantProductOption) => void;
  onTabChange?: (merchantId: string) => void;
}) {
  const groups = useMemo<MerchantGroup[]>(() => {
    const map = new Map<string, MerchantGroup>();

    for (const p of products) {
      const id = p.merchant_id;

      if (!map.has(id)) {
        map.set(id, {
          merchantId: id,
          businessName: p.merchants?.business_name ?? "Unknown merchant",
          products: [],
        });
      }

      map.get(id)!.products.push(p);
    }

    return Array.from(map.values());
  }, [products]);

  const [activeTab, setActiveTab] = useState(groups[0]?.merchantId ?? "");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  function handleTabChange(merchantId: string) {
    setActiveTab(merchantId);
    setSearch("");
    setPage(0);
    onTabChange?.(merchantId);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card px-4 py-10 text-center">
        <p className="text-sm font-medium text-text-primary">
          No merchant products available
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Approved merchant products will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        {/* Merchant tabs */}
        <div className="border-b border-border bg-pearl/40 px-4 pt-3">
          <TabsList
            variant="line"
            className="flex h-auto w-full flex-wrap items-end justify-start gap-x-1 gap-y-0 overflow-visible rounded-none bg-transparent p-0"
          >
            {groups.map((group) => {
              const availableCount = group.products.filter(
                (product) => !product.is_in_store,
              ).length;

              return (
                <TabsTrigger
                  key={group.merchantId}
                  value={group.merchantId}
                  className={cn(
                    "relative -mb-px min-w-0 max-w-50 flex-none justify-start rounded-none rounded-ss-lg border border-border/70 bg-pearl/70 px-3.5 py-2 text-start text-sm font-medium text-text-secondary transition-colors duration-200 after:hidden",
                    "hover:bg-surface/70 hover:text-text-primary",
                    "data-[state=active]:border-b-card data-[state=active]:bg-card data-[state=active]:text-text-primary",
                  )}
                >
                  <span className="min-w-0 truncate">{group.businessName}</span>
                  <span className="ms-1 shrink-0 text-xs font-normal text-text-secondary/70">
                    ({availableCount})
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {groups.map((group) => (
          <MerchantPanel
            key={group.merchantId}
            group={group}
            search={search}
            page={page}
            selectedId={selectedId}
            onSearch={handleSearch}
            onPageChange={setPage}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Tabs>
  );
}

function MerchantPanel({
  group,
  search,
  page,
  selectedId,
  onSearch,
  onPageChange,
  onSelect,
}: {
  group: MerchantGroup;
  search: string;
  page: number;
  selectedId: string | null;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelect: (product: MerchantProductOption) => void;
}) {
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return group.products;

    return group.products.filter(
      (product) =>
        product.name_en.toLowerCase().includes(query) ||
        (product.name_ar ?? "").toLowerCase().includes(query),
    );
  }, [group.products, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));

  const paged = filtered.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );

  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min((safePage + 1) * PAGE_SIZE, filtered.length);
  const availableCount = group.products.filter((p) => !p.is_in_store).length;

  return (
    <TabsContent value={group.merchantId} className="mt-0">
      <div className="bg-card p-4 sm:p-5">
        {/* Panel header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              {group.businessName}
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Select an approved product from this merchant catalog.
            </p>
          </div>

          <Badge className="w-fit rounded-xl bg-primary-light px-3 py-1.5 text-sm font-semibold text-tide hover:bg-primary-light">
            {availableCount} available
          </Badge>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />

            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search products..."
              className="h-11 rounded-xl border-border bg-pearl ps-9 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:border-tide focus-visible:ring-2 focus-visible:ring-tide/20"
            />
          </div>
        </div>

        {/* Product list */}
        <div className="space-y-2">
          {paged.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-pearl/60 px-4 py-10 text-center">
              <p className="text-sm font-medium text-text-primary">
                {search ? "No products match your search" : "No products found"}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Try another merchant or search term.
              </p>
            </div>
          ) : (
            paged.map((product) => (
              <MerchantProductRow
                key={product.id}
                product={product}
                isSelected={selectedId === product.id}
                onSelect={onSelect}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange(safePage - 1)}
                disabled={safePage === 0}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-pearl text-text-secondary transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <IconChevronLeft size={15} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onPageChange(index)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition",
                    index === safePage
                      ? "border-tide bg-tide text-pearl"
                      : "border-border bg-pearl text-text-secondary hover:bg-sand",
                  )}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => onPageChange(safePage + 1)}
                disabled={safePage >= totalPages - 1}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-pearl text-text-secondary transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <IconChevronRight size={15} aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Showing {from}–{to} of {filtered.length} products
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}

function MerchantProductRow({
  product,
  isSelected,
  onSelect,
}: {
  product: MerchantProductOption;
  isSelected: boolean;
  onSelect: (product: MerchantProductOption) => void;
}) {
  const isDisabled = product.is_in_store;
  const thumb = product.images?.[0] ?? null;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) onSelect(product);
      }}
      className={cn(
        "group/product relative flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-start transition-all",
        "border-border/70 bg-pearl hover:border-drift/70 hover:bg-surface/60",
        isSelected && "border-tide/60 bg-primary-light/45 shadow-sm",
        isDisabled && "cursor-not-allowed opacity-60 hover:border-border/70",
      )}
    >
      {/* Selected indicator */}
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border transition",
          isSelected
            ? "border-tide bg-tide text-pearl"
            : "border-border bg-card text-transparent",
        )}
      >
        <IconCheck size={14} strokeWidth={3} aria-hidden="true" />
      </div>

      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {thumb ? (
          <Image
            src={thumb}
            alt={product.name_en}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-text-tertiary">
            <IconSearch size={18} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {product.name_en}
        </p>

        {product.name_ar && (
          <p className="mt-0.5 truncate text-xs text-text-secondary" dir="rtl">
            {product.name_ar}
          </p>
        )}

        <p className="mt-1 text-xs text-text-secondary">
          {product.merchants?.business_name ?? "Merchant product"}
        </p>
      </div>

      {/* Price + status */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-sm font-semibold tabular-nums text-text-primary">
          {product.base_price.toLocaleString()} EGP
        </span>

        {product.is_in_store ? (
          <Badge
            variant="outline"
            className="rounded-full border-tide/30 bg-primary-light/60 px-2 text-[11px] font-semibold text-tide"
          >
            In store
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-2 text-[11px] font-medium text-text-secondary"
          >
            Available
          </Badge>
        )}
      </div>
    </button>
  );
}
