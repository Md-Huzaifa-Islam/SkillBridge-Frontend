import { getSession } from "@/lib/auth";
import { apiAdminGetUsers } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import { Suspense } from "react";
import BanButton from "@/components/admin/BanButton";
import UsersFilterBar from "@/components/admin/UsersFilterBar";

const ROLE_BADGE: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  tutor: "bg-purple-100 text-purple-700",
  admin: "bg-yellow-100 text-yellow-700",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  banned: "bg-red-100 text-red-600",
};

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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">
          Users{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({total})
          </span>
        </h1>
      </div>

      <Suspense>
        <UsersFilterBar />
      </Suspense>

      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Email</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Role</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Tutor Profile
              </th>
              <th className="px-4 py-2 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {u.name}
                </td>
                <td className="px-4 py-2 text-muted-foreground text-xs">
                  {u.email}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[u.role] ?? ""}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[u.status] ?? ""}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {u.tutorProfiles ? (
                    <span>
                      {u.tutorProfiles.title} ·{" "}
                      {u.tutorProfiles.category?.name ?? "—"} · $
                      {u.tutorProfiles.pricePerHour}/hr
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin-dashboard/users/${u.id}`}
                      className="text-xs px-3 py-1 rounded-lg border hover:bg-muted transition-colors"
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
                  className="px-4 py-8 text-center text-muted-foreground"
                >
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
