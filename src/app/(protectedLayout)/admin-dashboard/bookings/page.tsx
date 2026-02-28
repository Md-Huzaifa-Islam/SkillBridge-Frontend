import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import { PageHeader, StatCard, StatusBadge } from "@/components/dashboard/ui";

export default async function AdminBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const { data: bookings } = await apiGetBookings(session.token).catch(() => ({
    data: [],
  }));

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Bookings"
        description="Monitor all tutoring sessions across the platform."
        icon="📊"
        badge={`${stats.total} total`}
      />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon="📚" color="purple" />
        <StatCard
          label="Confirmed"
          value={stats.confirmed}
          icon="✅"
          color="green"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon="🎓"
          color="blue"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          icon="✕"
          color="red"
        />
      </div>

      <div className="border rounded-2xl overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Student
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Tutor
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">
                  {b.student?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.tutor?.user?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.date ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.startTime ?? "—"} – {b.endTime ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  ${b.totalPrice}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <p className="text-2xl mb-2">📋</p>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
