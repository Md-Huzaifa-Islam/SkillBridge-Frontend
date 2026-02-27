import { getSession } from "@/lib/auth";
import { apiGetTutors } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const { data: tutors } = await apiGetTutors("limit=100", 0).catch(() => ({
    data: [],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <section>
        <h2 className="font-semibold text-lg mb-3">
          Tutors{" "}
          <span className="text-muted-foreground font-normal text-sm">
            ({tutors.length})
          </span>
        </h2>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Rate</th>
                <th className="px-4 py-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((t) => (
                <tr key={t.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2 font-medium">{t.user?.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {t.user?.email}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground text-xs">
                    {t.title}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {t.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right">${t.pricePerHour}</td>
                  <td className="px-4 py-2 text-right">
                    {t.avgRating?.toFixed(1) ?? "—"}
                  </td>
                </tr>
              ))}
              {tutors.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No tutors registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
