import { getSession } from "@/lib/auth";
import { apiGetCategories } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const { data: categories } = await apiGetCategories().catch(() => ({
    data: [],
  }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Add, edit or delete tutor categories.
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
