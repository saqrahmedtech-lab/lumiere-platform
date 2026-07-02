"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  IconEdit,
  IconEraser,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { BulkDeleteCategoriesDialog } from "./bulk-delete-categories-dialog";
import { ClearCategoryProductsDialog } from "./clear-category-products-dialog";
import {
  updateCategoryOrder,
  updateCategoryPublished,
  bulkUpdateCategoriesPublished,
} from "../actions";
import type { CategoryRow } from "@/utils/supabase/queries/get-categories";

export type Category = CategoryRow;

interface ClientTableProps {
  data: Category[];
  onDataChange?: (data: Category[]) => void;
}

function PublishToggle({ category }: { category: Category }) {
  const [isPublished, setIsPublished] = useState(category.is_published);
  // Tracks the last external value we've synced to. DataTable reuses this
  // component instance across re-renders (same row id), so when a bulk
  // action updates the parent's data array, isPublished otherwise never
  // picks up the new prop — it stays stuck at whatever it was on mount.
  const [syncedPublished, setSyncedPublished] = useState(category.is_published);
  const [isPending, startTransition] = useTransition();

  if (category.is_published !== syncedPublished) {
    setSyncedPublished(category.is_published);
    setIsPublished(category.is_published);
  }

  function handleToggle(checked: boolean) {
    setSyncedPublished(checked);
    setIsPublished(checked); // optimistic
    startTransition(async () => {
      const result = await updateCategoryPublished(category.id, checked);
      if (result.error) {
        setSyncedPublished(!checked);
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

const MAX_VISIBLE_PRODUCTS = 3;

function ProductsCell({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const products = category.store_products;

  if (products.length === 0) {
    return <span className="text-sm text-text-tertiary">—</span>;
  }

  const visible = products.slice(0, MAX_VISIBLE_PRODUCTS);
  const remaining = products.length - visible.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex max-w-56 flex-wrap items-center gap-1 rounded-lg px-1 py-0.5 text-left hover:bg-tide/5"
        >
          {visible.map((product) => (
            <span
              key={product.id}
              className="max-w-24 truncate rounded-full border border-border bg-pearl px-2 py-0.5 text-xs text-text-secondary"
            >
              {product.name_en}
            </span>
          ))}
          {remaining > 0 && (
            <span className="shrink-0 rounded-full bg-tide/10 px-2 py-0.5 text-xs font-medium text-tide">
              +{remaining} more
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{category.name_en}</SheetTitle>
          <SheetDescription>
            {products.length} product{products.length === 1 ? "" : "s"} in
            this category.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-pearl/60 px-3 py-2.5"
            >
              <span className="truncate text-sm font-medium text-text-primary">
                {product.name_en}
              </span>
              <span className="shrink-0 text-sm font-semibold text-text-primary">
                {product.final_price.toFixed(2)} EGP
              </span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const columnsConfig: ColumnDef<Category>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      row.original.image ? (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
          <Image
            src={row.original.image}
            alt={row.original.name_en}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-pearl/60 text-text-tertiary">
          <IconPhoto size={16} aria-hidden="true" />
        </div>
      ),
  },
  {
    accessorKey: "name_en",
    header: "Name (English)",
    cell: ({ row }) => (
      <Button
        variant="link"
        className="p-0 text-left font-medium text-tide hover:text-tide/80"
      >
        {row.original.name_en}
      </Button>
    ),
  },
  {
    accessorKey: "name_ar",
    header: "Name (Arabic)",
    cell: ({ row }) => (
      <span className="font-medium text-right" dir="rtl">
        {row.original.name_ar}
      </span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="px-2 py-1 bg-tide/10 dark:bg-tide/20 text-tide border-none font-medium"
      >
        {row.original.slug}
      </Badge>
    ),
  },
  {
    accessorKey: "display_order",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.display_order}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "product_count",
    header: "Products",
    cell: ({ row }) =>
      row.original.product_count > 0 ? (
        <Badge variant="outline" className="whitespace-nowrap">
          {row.original.product_count} product
          {row.original.product_count === 1 ? "" : "s"}
        </Badge>
      ) : (
        <span className="text-sm text-text-tertiary">—</span>
      ),
  },
  {
    id: "products_list",
    header: "In this category",
    cell: ({ row }) => <ProductsCell category={row.original} />,
  },
  {
    accessorKey: "is_published",
    header: "Published",
    cell: ({ row }) => <PublishToggle category={row.original} />,
  },
];

export default function ClientTable({ data, onDataChange }: ClientTableProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [clearTarget, setClearTarget] = useState<Category | null>(null);
  const [selectedRows, setSelectedRows] = useState<Category[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const columns = useMemo(() => columnsConfig, []);

  const actions = useMemo<DataTableAction<Category>[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        icon: <IconEdit className="size-4" />,
        onClick: (row: Category) => {
          router.push(`/${locale}/admin/categories/${row.id}`);
        },
      },
      {
        id: "clear-products",
        label: "Clear from products",
        icon: <IconEraser className="size-4" />,
        onClick: (row: Category) => {
          setClearTarget(row);
        },
      },
      {
        id: "delete",
        label: "Delete",
        icon: <IconTrash className="size-4" />,
        variant: "destructive",
        onClick: (row: Category) => {
          setPendingDelete(row);
        },
      },
    ],
    [locale, router],
  );

  const handleRowSelect = useCallback(
    (ids: string[]) => {
      setSelectedRows(data.filter((c) => ids.includes(c.id)));
    },
    [data],
  );

  function handleDeleted() {
    if (!pendingDelete) return;
    onDataChange?.(data.filter((c) => c.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  function handleReorder(reordered: Category[]) {
    const orderedIds = reordered.map((c) => c.id);
    void updateCategoryOrder(orderedIds);
  }

  async function handleBulkPublish() {
    const ids = selectedRows.map((r) => r.id);
    const result = await bulkUpdateCategoriesPublished(ids, true);
    if (result.error) {
      toast.error(result.error);
    } else {
      onDataChange?.(
        data.map((c) =>
          ids.includes(c.id) ? { ...c, is_published: true } : c,
        ),
      );
      setSelectedRows([]);
      router.refresh();
    }
  }

  async function handleBulkUnpublish() {
    const ids = selectedRows.map((r) => r.id);
    const result = await bulkUpdateCategoriesPublished(ids, false);
    if (result.error) {
      toast.error(result.error);
    } else {
      onDataChange?.(
        data.map((c) =>
          ids.includes(c.id) ? { ...c, is_published: false } : c,
        ),
      );
      setSelectedRows([]);
      router.refresh();
    }
  }

  function handleBulkDeleted() {
    const deletedIds = selectedRows.map((r) => r.id);
    onDataChange?.(data.filter((c) => !deletedIds.includes(c.id)));
    setBulkDeleteOpen(false);
    setSelectedRows([]);
    router.refresh();
  }

  return (
    <>
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-tide/30 bg-tide/10 px-4 py-2.5">
          <span className="text-sm font-medium text-primary-dark">
            {selectedRows.length} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkPublish}>
              Publish
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkUnpublish}>
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <DataTable<Category>
        data={data}
        columns={columns}
        actions={actions}
        sortable={true}
        onRowSelect={handleRowSelect}
        onReorder={handleReorder}
      />

      <DeleteCategoryDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        categoryId={pendingDelete?.id ?? ""}
        categoryName={pendingDelete?.name_en ?? ""}
        onDeleted={handleDeleted}
      />

      <ClearCategoryProductsDialog
        open={clearTarget !== null}
        onOpenChange={(open) => {
          if (!open) setClearTarget(null);
        }}
        categoryId={clearTarget?.id ?? ""}
        categoryName={clearTarget?.name_en ?? ""}
        onCleared={() => setClearTarget(null)}
      />

      <BulkDeleteCategoriesDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        categoryIds={selectedRows.map((r) => r.id)}
        onDeleted={handleBulkDeleted}
      />
    </>
  );
}
