"use client";

import { useState } from "react";
import ClientTable from "./client-table";
import CategoriesHeader from "./categories-header";
import { Category } from "./client-table";

interface CategoriesContainerProps {
  initialData: Category[];
}

export default function CategoriesContainer({ initialData }: CategoriesContainerProps) {
  const [data, setData] = useState<Category[]>(initialData);
  const [syncedInitialData, setSyncedInitialData] = useState(initialData);

  // Bulk actions call router.refresh() to re-fetch server data. Adjust state
  // during render (rather than in an effect) when the prop changes, per
  // https://react.dev/learn/you-might-not-need-an-effect.
  if (initialData !== syncedInitialData) {
    setSyncedInitialData(initialData);
    setData(initialData);
  }

  return (
    <div className="flex flex-col gap-4">
      <CategoriesHeader onDataChange={setData} />
      <ClientTable data={data} onDataChange={setData} />
    </div>
  );
}
