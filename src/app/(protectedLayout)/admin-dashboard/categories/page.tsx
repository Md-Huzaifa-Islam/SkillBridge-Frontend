import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl p-1">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Add, edit or delete tutor categories.
        </p>
      </div>
      <CategoryManager />
    </div>
  );
}
