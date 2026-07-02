"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MerchantProductRow } from "@/utils/supabase/queries/get-all-merchant-products";

const statusStyles: Record<"published" | "unpublished", string> = {
  published: "border-emerald-400/50 bg-emerald-50 text-emerald-700",
  unpublished: "border-border bg-card text-text-secondary",
};

const statusLabels: Record<"published" | "unpublished", string> = {
  published: "Published",
  unpublished: "Unpublished",
};

export const columns: ColumnDef<MerchantProductRow>[] = [
  {
    accessorKey: "name_en",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">
          {row.original.name_en}
        </p>
      </div>
    ),
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
    accessorKey: "base_price",
    header: "Price",
    cell: ({ row }) => `${row.original.base_price.toFixed(2)} EGP`,
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.is_published ? "published" : "unpublished";
      return (
        <Badge
          variant="outline"
          className={cn("rounded-full", statusStyles[status])}
        >
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];
