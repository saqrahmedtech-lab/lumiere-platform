"use client";

import { useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconX, IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCategoriesClient } from "@/utils/supabase/queries/get-categories-client";
import { Category } from "./client-table";

interface CategoriesHeaderProps {
  onDataChange: (data: Category[]) => void;
}

export default function CategoriesHeader({ onDataChange }: CategoriesHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const previousQuery = useRef("");

  const handleSearch = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (previousQuery.current === query) return;
      previousQuery.current = query;

      startTransition(async () => {
        const results = await getCategoriesClient(query);
        onDataChange(results);
      });
    }, 500);
  }, [onDataChange]);

  // Restore focus after search completes
  useEffect(() => {
    if (!isPending && previousQuery.current.length > 0) {
      inputRef.current?.focus();
    }
  }, [isPending]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleClear = useCallback(() => {
    previousQuery.current = "";
    if (inputRef.current) inputRef.current.value = "";
    startTransition(async () => {
      const results = await getCategoriesClient("");
      onDataChange(results);
    });
  }, [onDataChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center px-4 lg:px-6">
      {/* Search */}
      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Search categories..."
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
          className="h-9 pl-9 pr-9 border-tide/30 focus-visible:border-tide focus-visible:ring-tide/30 placeholder:text-text-tertiary"
        />
        {isPending ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin size-4 border-2 border-tide border-t-transparent rounded-full" />
          </div>
        ) : previousQuery.current.length > 0 ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-tide/10 rounded transition-colors"
          >
            <IconX className="size-4 text-text-secondary" />
          </button>
        ) : null}
      </div>

      {/* Add Button */}
      <Button
        onClick={() => router.push("categories/add")}
        variant="outline"
        size="sm"
        className="border-tide/30 hover:bg-tide/5 dark:hover:bg-tide/10 text-tide hover:text-tide flex items-center gap-2"
      >
        <IconPlus className="size-4" />
        <span>Add Category</span>
      </Button>
    </div>
  );
}
