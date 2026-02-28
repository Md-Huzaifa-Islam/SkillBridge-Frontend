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
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Platform overview and management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tutors"
          value={tutors.length}
          href="/admin-dashboard/users"
          icon="👨‍🏫"
          color="violet"
        />
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          href="/admin-dashboard/bookings"
          icon="📚"
          color="blue"
        />
        <StatCard
          label="Confirmed"
          value={confirmedBookings.length}
          href="/admin-dashboard/bookings"
          icon="✅"
          color="green"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          href="/admin-dashboard/categories"
          icon="🏷️"
          color="orange"
        />
      </div>

      {/* Recent bookings summary */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base tracking-tight">
            Recent Bookings
          </h2>
          <Link
            href="/admin-dashboard/bookings"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                  Student
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                  Tutor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {bookings.slice(0, 8).map((b) => (
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
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : b.status === "completed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-muted text-muted-foreground"
                      }`}
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
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
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
          icon="👥"
        />
        <QuickLink
          href="/admin-dashboard/bookings"
          label="All Bookings"
          desc="Monitor all sessions"
          icon="📋"
        />
        <QuickLink
          href="/admin-dashboard/categories"
          label="Categories"
          desc="Add or edit categories"
          icon="🏷️"
        />
      </section>
    </div>
  );
}

type StatColor = "violet" | "blue" | "green" | "orange";

function StatCard({
  label,
  value,
  href,
  icon,
  color,
}: {
  label: string;
  value: number;
  href: string;
  icon: string;
  color: StatColor;
}) {
  const colorMap: Record<StatColor, string> = {
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  };
  return (
    <Link
      href={href}
      className="border rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 bg-card block"
    >
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  desc,
  icon,
}: {
  href: string;
  label: string;
  desc: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 bg-card flex items-start gap-3"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
