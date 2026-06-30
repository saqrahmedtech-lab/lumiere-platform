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

  return (
    <div className="flex flex-col gap-4">
      <CategoriesHeader onDataChange={setData} />
      <ClientTable data={data} onDataChange={setData} />
    </div>
  );
}
