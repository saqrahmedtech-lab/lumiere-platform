"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { updateCategoryOrder } from "../actions";

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at: string;
  parent_id: string | null;
  display_order: number;
}

interface ClientTableProps {
  data: Category[];
  onDataChange?: (data: Category[]) => void;
}

const columnsConfig: ColumnDef<Category>[] = [
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
];

export default function ClientTable({ data, onDataChange }: ClientTableProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

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

  const handleRowSelect = useCallback((selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds);
  }, []);

  function handleDeleted() {
    if (!pendingDelete) return;
    onDataChange?.(data.filter((c) => c.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  function handleReorder(reordered: Category[]) {
    const orderedIds = reordered.map((c) => c.id);
    void updateCategoryOrder(orderedIds);
  }

  return (
    <>
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
    </>
  );
}
