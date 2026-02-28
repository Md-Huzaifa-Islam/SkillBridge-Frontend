import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import CategoryManager from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/dashboard/ui";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Categories"
        description="Add, edit, or delete tutor subject categories."
        icon="🏷️"
      />
      <div className="border rounded-2xl p-6 bg-card">
        <CategoryManager />
      </div>
    </div>
  );
}
