import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";

const STATUS_COLOR: Record<string, string> = {
  confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

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
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">All Bookings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Monitor all tutoring sessions across the platform.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {Object.entries(stats).map(([label, count]) => (
          <div
            key={label}
            className="border rounded-2xl px-4 py-4 text-center bg-card hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-muted-foreground capitalize font-medium">
              {label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{count}</p>
          </div>
        ))}
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
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLOR[b.status] ?? ""}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
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
