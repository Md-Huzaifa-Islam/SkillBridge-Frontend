import { apiGetCategories } from "@/lib/api";
import CreateCategoryForm from "./CreateCategoryForm";
import CategoryItem from "./CategoryItem";

export default async function CategoryManager() {
  const { data: categories } = await apiGetCategories().catch(() => ({
    data: [],
  }));

  return (
    <div className="space-y-6">
      <CreateCategoryForm />

      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No categories yet. Add one above.
          </p>
        )}
        {categories.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
