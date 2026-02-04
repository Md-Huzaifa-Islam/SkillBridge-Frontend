import { getCategories } from "@/actions/categories";
import CategoriesClient from "@/components/admin/categories-client";

export default async function AdminCategoriesPage() {
  const response = await getCategories();
  const categories = response.success ? response.data || [] : [];

  return <CategoriesClient initialCategories={categories} />;
}
