"use client";

import { useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { StoreProductRow } from "@/utils/supabase/queries/get-store-products";
import { toggleProductPublished } from "../actions";

function PublishToggle({ product }: { product: StoreProductRow }) {
  const [isPublished, setIsPublished] = useState(product.is_published);
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    setIsPublished(checked); // optimistic
    startTransition(async () => {
      const result = await toggleProductPublished(product.id, checked);
      if (result.error) {
        setIsPublished(!checked); // revert on failure
      }
    });
  }

  return (
    <Switch
      checked={isPublished}
      onCheckedChange={handleToggle}
      disabled={isPending}
      className="data-[state=checked]:bg-tide"
    />
  );
}

export const columns: ColumnDef<StoreProductRow>[] = [
  {
    accessorKey: "name_en",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">
          {row.original.name_en}
        </p>
        <p className="truncate text-xs text-text-secondary" dir="rtl">
          {row.original.name_ar}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: ({ row }) => row.original.categories?.name_en ?? "—",
  },
  {
    accessorKey: "merchants",
    header: "Merchant",
    cell: ({ row }) =>
      row.original.merchants?.business_name ? (
        <span className="text-sm text-text-primary">
          {row.original.merchants.business_name}
        </span>
      ) : (
        <span className="text-sm text-text-secondary">—</span>
      ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.source === "merchant"
            ? "border-tide/40 text-tide"
            : "border-drift text-text-secondary"
        }
      >
        {row.original.source === "merchant" ? "Merchant" : "Manual"}
      </Badge>
    ),
  },
  {
    accessorKey: "final_price",
    header: "Price",
    cell: ({ row }) => `${row.original.final_price.toFixed(2)} EGP`,
  },
  {
    accessorKey: "is_published",
    header: "Published",
    cell: ({ row }) => <PublishToggle product={row.original} />,
  },
];
