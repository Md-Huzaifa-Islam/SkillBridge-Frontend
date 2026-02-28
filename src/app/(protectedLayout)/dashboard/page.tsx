import { getSession } from "@/lib/auth";
import { apiGetBookings, apiGetTutors } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.student) redirect("/login");

  const token = session.token;

  const [bookingsResult, tutorsResult] = await Promise.allSettled([
    apiGetBookings(token),
    apiGetTutors("limit=3&page=1", 60),
  ]);

  const bookings =
    bookingsResult.status === "fulfilled" &&
    Array.isArray(bookingsResult.value.data)
      ? bookingsResult.value.data
      : [];
  const featuredTutors =
    tutorsResult.status === "fulfilled"
      ? (tutorsResult.value.data?.data ?? [])
      : [];

  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6 p-1">
      {/* Welcome header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back 👋</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here&apos;s an overview of your learning journey.
          </p>
        </div>
        <Link
          href="/tutors"
          className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-sm shadow-primary/25 hover:opacity-90 transition"
        >
          + Book a Session
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming Sessions" value={upcoming.length} icon="📅" color="blue" />
        <StatCard label="Past Sessions" value={past.length} icon="✅" color="green" />
        <StatCard label="Total Bookings" value={bookings.length} icon="📚" color="purple" />
      </div>

      {/* Upcoming bookings */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base tracking-tight">Upcoming Sessions</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="border rounded-2xl py-10 text-center space-y-2 bg-muted/20">
            <p className="text-2xl">📅</p>
            <p className="text-sm text-muted-foreground">No upcoming sessions.</p>
            <Link href="/tutors" className="text-sm text-primary font-semibold hover:underline">
              Browse tutors to book one →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-semibold text-sm">{b.tutor?.user?.name ?? "Tutor"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.date ?? "—"} · {b.startTime ?? "—"}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium capitalize">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured tutors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base tracking-tight">Explore Tutors</h2>
          <Link href="/tutors" className="text-sm text-primary hover:underline font-medium">
            See all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {featuredTutors.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className="border rounded-xl p-4 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                  {t.user?.name?.[0]?.toUpperCase() ?? "T"}
                </div>
                <p className="font-semibold text-sm truncate">{t.user?.name}</p>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {t.description}
              </p>
              <p className="text-xs font-bold text-primary">${t.pricePerHour}/hr</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: "blue" | "green" | "purple" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  };
  return (
    <div className="border rounded-2xl p-5 space-y-3 bg-card hover:shadow-sm transition-shadow">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}
