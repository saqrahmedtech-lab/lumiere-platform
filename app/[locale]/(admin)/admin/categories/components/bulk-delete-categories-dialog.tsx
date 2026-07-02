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
import { bulkDeleteCategories } from "../actions";

export function BulkDeleteCategoriesDialog({
  open,
  onOpenChange,
  categoryIds,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryIds: string[];
  onDeleted?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await bulkDeleteCategories(categoryIds);

      if (result.error) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
      onDeleted?.();
    });
  }

  const count = categoryIds.length;

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
            Delete {count} categor{count === 1 ? "y" : "ies"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected categor{count === 1 ? "y" : "ies"} from your storefront.
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
