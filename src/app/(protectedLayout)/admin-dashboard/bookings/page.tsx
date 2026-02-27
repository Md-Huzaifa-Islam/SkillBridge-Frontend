import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-muted text-muted-foreground",
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
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Bookings</h1>

      {/* Stats bar */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
        {Object.entries(stats).map(([label, count]) => (
          <div key={label} className="border rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground capitalize">{label}</p>
            <p className="text-xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">Student</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Tutor</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Time</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-2 text-right whitespace-nowrap">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-2">{b.student?.name ?? "—"}</td>
                <td className="px-4 py-2">{b.tutor?.user?.name ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {b.slot?.date ?? "—"}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {b.slot?.startTime ?? "—"} – {b.slot?.endTime ?? "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[b.status] ?? ""}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  ${b.totalPrice}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
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
