"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconRocket } from "@tabler/icons-react";
import type { MerchantProductRow } from "@/utils/supabase/queries/get-all-merchant-products";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { BulkDeleteProductsDialog } from "./bulk-delete-products-dialog";

export function ProductsTable({
  products,
}: {
  products: MerchantProductRow[];
}) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const [selectedRows, setSelectedRows] = useState<MerchantProductRow[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const actions = useMemo<DataTableAction<MerchantProductRow>[]>(
    () => [
      {
        id: "publish",
        label: "Publish",
        icon: <IconRocket className="size-4" />,
        onClick: (row) => router.push(`/${locale}/admin/products/${row.id}`),
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

      <DataTable<MerchantProductRow>
        data={products}
        columns={columns}
        actions={actions}
        onRowSelect={handleRowSelect}
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
