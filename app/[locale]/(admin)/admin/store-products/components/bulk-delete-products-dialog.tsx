"use client";

import { useState, useTransition } from "react";
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
import { bulkDeleteStoreProducts } from "../actions";

export function BulkDeleteProductsDialog({
  open,
  onOpenChange,
  productIds,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productIds: string[];
  onDeleted?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await bulkDeleteStoreProducts(productIds);

      if (result.error) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
      onDeleted?.();
    });
  }

  const count = productIds.length;

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
            Delete {count} product{count === 1 ? "" : "s"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the selected product{count === 1 ? "" : "s"} from
            your storefront permanently. This action cannot be undone.
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
              handleDelete();
            }}
            disabled={isPending}
            className="bg-bloom text-pearl hover:bg-bloom-dark"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
