import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";

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
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Tutor Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your sessions and profile.
          </p>
        </div>
        {!profile && (
          <Link
            href="/tutor-dashboard/profile"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-sm shadow-primary/25 hover:opacity-90 transition"
          >
            + Create Profile
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Confirmed"
          value={confirmed.length}
          icon="✅"
          color="green"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon="🎓"
          color="blue"
        />
        <StatCard
          label="Cancelled"
          value={cancelled.length}
          icon="✕"
          color="red"
        />
        <StatCard
          label="Total Sessions"
          value={bookings.length}
          icon="📚"
          color="purple"
        />
      </div>

      {/* Profile status */}
      {profile && (
        <div className="border rounded-2xl p-5 bg-card space-y-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base tracking-tight">Your Profile</h2>
            <Link
              href="/tutor-dashboard/profile"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Edit →
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {profile.title?.[0]?.toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold text-sm">{profile.title}</p>
              {profile.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {profile.description}
                </p>
              )}
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs font-bold text-primary">
                  ${profile.pricePerHour}/hr
                </span>
                {profile.avgRating != null && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    ⭐ {profile.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base tracking-tight">
            Recent Sessions
          </h2>
          <Link
            href="/tutor-dashboard/sessions"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="border rounded-2xl py-10 text-center space-y-2 bg-muted/20">
            <p className="text-2xl">📋</p>
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {b.student?.name ?? "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.date ?? "—"} · {b.startTime ?? "—"}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type StatColor = "green" | "blue" | "red" | "purple";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: StatColor;
}) {
  const colorMap: Record<StatColor, string> = {
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    red: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    purple:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  };
  return (
    <div className="border rounded-2xl p-5 space-y-3 bg-card hover:shadow-sm transition-shadow">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}
