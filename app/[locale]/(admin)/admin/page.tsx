import ClientTable from "./categories/components/client-table";
import { getCategories } from "@/utils/supabase/queries/get-categories";

export default async function AdminDashboardPage() {
  const categories = await getCategories();

  return <ClientTable data={categories} />;
}
