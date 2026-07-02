"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { clearCategoryFromProducts } from "../actions";

export function ClearCategoryProductsDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onCleared,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onCleared?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!open || !categoryId) return;

    async function loadCount() {
      setCount(null);
      setIsCounting(true);

      const supabase = createClient();
      const { count: productCount } = await supabase
        .from("store_products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", categoryId);

      setCount(productCount ?? 0);
      setIsCounting(false);
    }

    loadCount();
  }, [open, categoryId]);

  function handleClear() {
    setError(null);
    setIsPending(true);

    clearCategoryFromProducts(categoryId).then((result) => {
      setIsPending(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
      onCleared?.();
      toast.success(`Cleared from ${result.cleared} product${result.cleared === 1 ? "" : "s"}`);
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setError(null);
        onOpenChange(o);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Clear &quot;{categoryName}&quot; from products?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the category assignment from all products in{" "}
            {categoryName}. Products won&apos;t be deleted — they&apos;ll
            just become uncategorized.
            <br />
            <span className="mt-2 inline-block font-medium text-text-primary">
              {isCounting ? "Counting products..." : `${count ?? 0} product${count === 1 ? "" : "s"}`}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="rounded-lg border border-bloom/30 bg-bloom/10 px-3 py-2 text-sm text-bloom">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleClear();
            }}
            disabled={isPending || isCounting || count === 0}
            className="bg-tide text-pearl hover:bg-tide/90"
          >
            {isPending ? "Clearing..." : "Clear from products"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
