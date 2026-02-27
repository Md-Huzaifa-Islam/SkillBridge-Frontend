import { getSession } from "@/lib/auth";
import { apiGetBookings, apiGetTutors, apiGetCategories } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const token = session.token;

  const [tutorsResult, bookingsResult, categoriesResult] =
    await Promise.allSettled([
      apiGetTutors("limit=100", 30),
      apiGetBookings(token),
      apiGetCategories(),
    ]);

  const tutors =
    tutorsResult.status === "fulfilled"
      ? (tutorsResult.value.data?.data ?? [])
      : [];
  const bookings =
    bookingsResult.status === "fulfilled" &&
    Array.isArray(bookingsResult.value.data)
      ? bookingsResult.value.data
      : [];
  const categories =
    categoriesResult.status === "fulfilled" &&
    Array.isArray(categoriesResult.value.data)
      ? categoriesResult.value.data
      : [];

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Platform overview and management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tutors"
          value={tutors.length}
          href="/admin-dashboard/users"
        />
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          href="/admin-dashboard/bookings"
        />
        <StatCard
          label="Confirmed Bookings"
          value={confirmedBookings.length}
          href="/admin-dashboard/bookings"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          href="/admin-dashboard/categories"
        />
      </div>

      {/* Recent bookings summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Recent Bookings</h2>
          <Link
            href="/admin-dashboard/bookings"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Tutor</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.student?.name ?? "—"}</td>
                  <td className="px-4 py-2">{b.tutor?.user?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {b.date ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">${b.totalPrice}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick links */}
      <section className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/admin-dashboard/users"
          label="Manage Users"
          desc="View tutors and students"
        />
        <QuickLink
          href="/admin-dashboard/bookings"
          label="All Bookings"
          desc="Monitor all sessions"
        />
        <QuickLink
          href="/admin-dashboard/categories"
          label="Categories"
          desc="Add or edit categories"
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border rounded-xl p-4 space-y-1 hover:bg-muted/40 transition-colors block"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="border rounded-xl p-4 hover:bg-muted/40 transition-colors"
    >
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Link>
  );
}
