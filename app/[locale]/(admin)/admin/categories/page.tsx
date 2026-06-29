import { getCategories } from "@/utils/supabase/queries/get-categories";
import CategoriesContainer from "./components/categories-container";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesContainer initialData={categories} />;
}
