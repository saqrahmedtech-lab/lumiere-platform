"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { deleteCategory } from "../actions";

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (result.error) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) setError(null); onOpenChange(o); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{categoryName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category from your storefront.
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
