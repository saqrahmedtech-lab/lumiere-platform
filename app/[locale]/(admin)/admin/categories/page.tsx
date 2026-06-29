import { getCategories } from "@/utils/supabase/queries/get-categories";
import ClientTable from "./components/client-table";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <ClientTable data={categories} />;
}
