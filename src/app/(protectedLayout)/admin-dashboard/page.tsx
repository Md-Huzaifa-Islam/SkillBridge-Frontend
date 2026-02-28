import { getSession } from "@/lib/auth";
import { apiGetBookings, apiGetTutors, apiGetCategories } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import {
  PageHeader,
  StatCard,
  SectionTitle,
  StatusBadge,
} from "@/components/dashboard/ui";

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
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and management."
        icon="📊"
        badge={`${tutors.length} tutors · ${bookings.length} bookings`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tutors"
          value={tutors.length}
          icon="👨‍🏫"
          color="purple"
          sub="registered tutors"
        />
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          icon="📚"
          color="blue"
          sub="all time"
        />
        <StatCard
          label="Confirmed"
          value={confirmedBookings.length}
          icon="✅"
          color="green"
          sub="active sessions"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon="🏷️"
          color="orange"
          sub="subjects available"
        />
      </div>

      <section className="space-y-3">
        <SectionTitle
          action={
            <Link
              href="/admin-dashboard/bookings"
              className="text-sm text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          }
        >
          Recent Bookings
        </SectionTitle>
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
                    <StatusBadge status={b.status} />
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

      <section className="grid gap-4 sm:grid-cols-3">
        {(
          [
            {
              href: "/admin-dashboard/users",
              label: "Manage Users",
              desc: "View tutors and students",
              icon: "👥",
            },
            {
              href: "/admin-dashboard/bookings",
              label: "All Bookings",
              desc: "Monitor all sessions",
              icon: "📋",
            },
            {
              href: "/admin-dashboard/categories",
              label: "Categories",
              desc: "Add or edit categories",
              icon: "🏷️",
            },
          ] as const
        ).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 bg-card flex items-start gap-3"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
