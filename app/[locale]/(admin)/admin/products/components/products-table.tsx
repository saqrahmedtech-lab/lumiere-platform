"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { StoreProductRow } from "@/utils/supabase/queries/get-store-products";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { columns } from "./columns";
import { DeleteProductDialog } from "./delete-product-dialog";

export function ProductsTable({ products }: { products: StoreProductRow[] }) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const [deleteTarget, setDeleteTarget] = useState<StoreProductRow | null>(
    null,
  );

  const actions = useMemo<DataTableAction<StoreProductRow>[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        icon: <IconEdit className="size-4" />,
        onClick: (row) => router.push(`/${locale}/admin/products/${row.id}`),
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

  return (
    <>
      <DataTable<StoreProductRow>
        data={products}
        columns={columns}
        actions={actions}
      />

      <DeleteProductDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        productId={deleteTarget?.id ?? ""}
        productName={deleteTarget?.name_en ?? ""}
      />
    </>
  );
}
