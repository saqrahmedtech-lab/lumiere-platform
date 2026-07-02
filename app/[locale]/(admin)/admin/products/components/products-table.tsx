"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconRocket } from "@tabler/icons-react";
import type { MerchantProductRow } from "@/utils/supabase/queries/get-all-merchant-products";
import {
  DataTable,
  type DataTableAction,
} from "../../../components/data-table";
import { columns } from "./columns";

export function ProductsTable({
  products,
}: {
  products: MerchantProductRow[];
}) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";

  const actions = useMemo<DataTableAction<MerchantProductRow>[]>(
    () => [
      {
        id: "publish",
        label: "Publish",
        icon: <IconRocket className="size-4" />,
        onClick: (row) =>
          router.push(`/${locale}/admin/products/publish/${row.id}`),
      },
    ],
    [locale, router],
  );

  return (
    <DataTable<MerchantProductRow>
      data={products}
      columns={columns}
      actions={actions}
    />
  );
}
