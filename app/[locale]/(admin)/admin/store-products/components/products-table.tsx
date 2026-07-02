"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import type { StoreProductRow } from "@/utils/supabase/queries/get-store-products";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DeleteProductDialog } from "./delete-product-dialog";
import { BulkDeleteProductsDialog } from "./bulk-delete-products-dialog";
import { bulkUpdateStoreProductsPublished } from "../actions";

export function ProductsTable({ products }: { products: StoreProductRow[] }) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const [deleteTarget, setDeleteTarget] = useState<StoreProductRow | null>(
    null,
  );
  const [selectedRows, setSelectedRows] = useState<StoreProductRow[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const actions = useMemo<DataTableAction<StoreProductRow>[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        icon: <IconEdit className="size-4" />,
        onClick: (row) =>
          router.push(`/${locale}/admin/store-products/${row.id}`),
      },
      {
        id: "delete",
        label: "Delete",
        icon: <IconTrash className="size-4" />,
        variant: "destructive",
        onClick: (row) => setDeleteTarget(row),
      },
    ],
    [locale, router],
  );

  const handleRowSelect = useCallback(
    (ids: string[]) => {
      setSelectedRows(products.filter((p) => ids.includes(p.id)));
    },
    [products],
  );

  async function handleBulkPublish() {
    const ids = selectedRows.map((r) => r.id);
    const result = await bulkUpdateStoreProductsPublished(ids, true);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSelectedRows([]);
      router.refresh();
    }
  }

  async function handleBulkUnpublish() {
    const ids = selectedRows.map((r) => r.id);
    const result = await bulkUpdateStoreProductsPublished(ids, false);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSelectedRows([]);
      router.refresh();
    }
  }

  function handleBulkDeleted() {
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

      <DataTable<StoreProductRow>
        data={products}
        columns={columns}
        actions={actions}
        onRowSelect={handleRowSelect}
      />

      <DeleteProductDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        productId={deleteTarget?.id ?? ""}
        productName={deleteTarget?.name_en ?? ""}
      />

      <BulkDeleteProductsDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        productIds={selectedRows.map((r) => r.id)}
        onDeleted={handleBulkDeleted}
      />
    </>
  );
}
