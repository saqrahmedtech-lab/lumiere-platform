"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MerchantProductOption } from "@/utils/supabase/queries/get-merchant-products";

export function MerchantProductPicker({
  products,
  selectedId,
  onSelect,
}: {
  products: MerchantProductOption[];
  selectedId: string | null;
  onSelect: (product: MerchantProductOption) => void;
}) {
  return (
    <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
      {products.length === 0 && (
        <p className="px-3 py-6 text-center text-sm text-text-secondary">
          No merchant products found
        </p>
      )}

      {products.map((product) => {
        const isSelected = selectedId === product.id;
        const isDisabled = product.is_in_store;

        return (
          <button
            key={product.id}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect(product)}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
              isSelected && "border-tide bg-tide-light",
              !isSelected &&
                !isDisabled &&
                "border-border bg-background hover:bg-sand",
              isDisabled &&
                "cursor-not-allowed border-border bg-sand/50 opacity-60",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-text-primary">
                  {product.name_en}
                </p>
                {product.is_in_store && (
                  <Badge
                    variant="outline"
                    className="shrink-0 border-tide/40 text-xs text-tide"
                  >
                    In store
                  </Badge>
                )}
              </div>
              <p className="text-xs text-text-secondary">
                {product.merchants?.business_name} · {product.base_price} EGP
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
