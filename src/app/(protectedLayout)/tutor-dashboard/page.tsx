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
    bookingsResult.status === "fulfilled" ? bookingsResult.value.data : [];

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage your sessions and profile.
          </p>
        </div>
        {!profile && (
          <Link
            href="/tutor-dashboard/profile"
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg"
          >
            Create Profile
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Confirmed" value={confirmed.length} />
        <StatCard label="Completed" value={completed.length} />
        <StatCard label="Cancelled" value={cancelled.length} />
        <StatCard label="Total Sessions" value={bookings.length} />
      </div>

      {/* Profile status */}
      {profile && (
        <div className="border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your Profile</h2>
            <Link
              href="/tutor-dashboard/profile"
              className="text-xs text-primary hover:underline"
            >
              Edit
            </Link>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.description}
          </p>
          <div className="flex gap-3 text-sm">
            <span className="font-medium">${profile.pricePerHour}/hr</span>
            <span className="text-muted-foreground">{profile.title}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Rating:{" "}
            <span className="font-medium text-foreground">
              {profile.avgRating?.toFixed(1) ?? "—"}
            </span>
          </p>
        </div>
      )}

      {/* Recent bookings */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Recent Sessions</h2>
          <Link
            href="/tutor-dashboard/sessions"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No sessions yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-sm">
                    {b.student?.name ?? "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.date ?? "—"} · {b.startTime ?? "—"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "completed"
                        ? "bg-blue-100 text-blue-700"
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-xl p-4 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
