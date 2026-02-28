import { getSession } from "@/lib/auth";
import { apiAdminGetUsers } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import { Suspense } from "react";
import BanButton from "@/components/admin/BanButton";
import UsersFilterBar from "@/components/admin/UsersFilterBar";
import { PageHeader, StatusBadge } from "@/components/dashboard/ui";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.role && sp.role !== "all") query.set("role", sp.role);
  if (sp.status && sp.status !== "all") query.set("status", sp.status);
  if (sp.search) query.set("search", sp.search);
  if (sp.page) query.set("page", sp.page);
  query.set("size", "50");

  const result = await apiAdminGetUsers(session.token, query.toString()).catch(
    () => ({ data: { users: [], total: 0, pages: 0 } }),
  );
  const { users, total } = result.data;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        description="Manage all students, tutors, and admins on the platform."
        icon="👥"
        badge={`${total} total`}
      />

      <Suspense>
        <UsersFilterBar />
      </Suspense>

      <div className="border rounded-2xl overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Role
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Tutor Profile
              </th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {u.name[0]?.toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {u.tutorProfiles ? (
                    <span>
                      {u.tutorProfiles.title} ·{" "}
                      {u.tutorProfiles.category?.name ?? "—"} · $
                      {u.tutorProfiles.pricePerHour}/hr
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin-dashboard/users/${u.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors font-medium"
                    >
                      View
                    </Link>
                    <BanButton userId={u.id} currentStatus={u.status} />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <p className="text-2xl mb-2">👥</p>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
