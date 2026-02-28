import { getSession } from "@/lib/auth";
import { apiGetBookings, apiGetTutors } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import {
  PageHeader,
  StatCard,
  EmptyState,
  SectionTitle,
} from "@/components/dashboard/ui";

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
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${session.user.name?.split(" ")[0] ?? "there"} 👋`}
        description="Here's an overview of your learning journey."
        icon="🎓"
        action={
          <Link
            href="/tutors"
            className="text-sm bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/25 hover:opacity-90 transition"
          >
            + Book a Session
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Upcoming Sessions"
          value={upcoming.length}
          icon="📅"
          color="blue"
          sub="confirmed bookings"
        />
        <StatCard
          label="Past Sessions"
          value={past.length}
          icon="✅"
          color="green"
          sub="completed & cancelled"
        />
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          icon="📚"
          color="purple"
          sub="all time"
        />
      </div>

      {/* Upcoming bookings */}
      <section>
        <SectionTitle
          badge={upcoming.length}
          action={
            <Link
              href="/dashboard/bookings"
              className="text-sm text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          }
        >
          Upcoming Sessions
        </SectionTitle>
        {upcoming.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No upcoming sessions"
            description="Find a tutor and book your first session to get started."
            action={
              <Link
                href="/tutors"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Browse tutors →
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-xl p-4 bg-card hover:shadow-sm hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {(b.tutor?.user?.name ?? "T")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {b.tutor?.user?.name ?? "Tutor"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.date ?? "—"} · {b.startTime ?? "—"}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium capitalize shrink-0">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured tutors */}
      <section>
        <SectionTitle
          action={
            <Link
              href="/tutors"
              className="text-sm text-primary hover:underline font-medium"
            >
              See all →
            </Link>
          }
        >
          Explore Tutors
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {featuredTutors.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className="border rounded-xl p-4 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-2 group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                  {t.user?.name?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {t.user?.name}
                  </p>
                  {t.category && (
                    <p className="text-xs text-muted-foreground">
                      {t.category.name}
                    </p>
                  )}
                </div>
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <p className="text-xs font-bold text-primary">
                  ${t.pricePerHour}/hr
                </p>
                {t.avgRating != null && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    ⭐ {t.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
