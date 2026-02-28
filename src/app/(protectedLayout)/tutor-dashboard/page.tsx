import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import {
  PageHeader,
  StatCard,
  EmptyState,
  SectionTitle,
  StatusBadge,
} from "@/components/dashboard/ui";

export default async function TutorDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const token = session.token;

  const [profileResult, bookingsResult] = await Promise.allSettled([
    apiGetMyTutorProfile(token),
    apiGetBookings(token),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value.data : null;
  const bookings =
    bookingsResult.status === "fulfilled" &&
    Array.isArray(bookingsResult.value.data)
      ? bookingsResult.value.data
      : [];

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hey, ${session.user.name?.split(" ")[0] ?? "Tutor"} 👋`}
        description="Manage your sessions, profile, and availability."
        icon="🏫"
        action={
          !profile ? (
            <Link
              href="/tutor-dashboard/profile"
              className="text-sm bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/25 hover:opacity-90 transition"
            >
              + Create Profile
            </Link>
          ) : null
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Confirmed"
          value={confirmed.length}
          icon="✅"
          color="green"
          sub="upcoming sessions"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon="🎓"
          color="blue"
          sub="past sessions"
        />
        <StatCard
          label="Cancelled"
          value={cancelled.length}
          icon="✕"
          color="red"
          sub="cancelled sessions"
        />
        <StatCard
          label="Total Sessions"
          value={bookings.length}
          icon="📚"
          color="purple"
          sub="all time"
        />
      </div>

      {/* Profile card */}
      {profile && (
        <div className="border rounded-2xl p-5 bg-card hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base tracking-tight">
              Your Public Profile
            </h2>
            <Link
              href="/tutor-dashboard/profile"
              className="text-xs text-primary hover:underline font-semibold border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition"
            >
              Edit Profile
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-xl font-bold text-primary shrink-0 border border-primary/10">
              {profile.title?.[0]?.toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0 space-y-1.5 flex-1">
              <p className="font-bold text-base">{profile.title}</p>
              {profile.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {profile.description}
                </p>
              )}
              <div className="flex gap-3 flex-wrap items-center pt-1">
                <span className="text-sm font-bold text-primary">
                  ${profile.pricePerHour}/hr
                </span>
                {profile.avgRating != null && (
                  <span className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                    ⭐ {profile.avgRating.toFixed(1)}
                  </span>
                )}
                {profile.category && (
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                    {profile.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No profile banner */}
      {!profile && (
        <div className="border border-dashed border-primary/30 rounded-2xl p-6 text-center space-y-2 bg-primary/3">
          <p className="text-3xl">✏️</p>
          <p className="font-semibold">You don’t have a tutor profile yet</p>
          <p className="text-sm text-muted-foreground">
            Create your profile so students can find and book you.
          </p>
          <Link
            href="/tutor-dashboard/profile"
            className="inline-block mt-2 text-sm bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Create Profile
          </Link>
        </div>
      )}

      {/* Recent bookings */}
      <section>
        <SectionTitle
          badge={bookings.length}
          action={
            <Link
              href="/tutor-dashboard/sessions"
              className="text-sm text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          }
        >
          Recent Sessions
        </SectionTitle>
        {bookings.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No sessions yet"
            description="Students will appear here once they book with you."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-xl p-4 bg-card hover:shadow-sm hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {(b.student?.name ?? "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {b.student?.name ?? "Student"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.date ?? "—"} · {b.startTime ?? "—"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
