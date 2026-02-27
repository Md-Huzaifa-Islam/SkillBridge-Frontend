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
    tutorsResult.status === "fulfilled" &&
    Array.isArray(tutorsResult.value.data)
      ? tutorsResult.value.data
      : [];

  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s an overview of your learning journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming Sessions" value={upcoming.length} />
        <StatCard label="Past Sessions" value={past.length} />
        <StatCard label="Total Bookings" value={bookings.length} />
      </div>

      {/* Upcoming bookings */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Upcoming Sessions</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No upcoming sessions.{" "}
            <Link href="/tutors" className="text-primary underline">
              Browse tutors
            </Link>{" "}
            to book one.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-sm">
                    {b.tutor?.user?.name ?? "Tutor"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.date ?? "—"} · {b.startTime ?? "—"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured tutors */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Explore Tutors</h2>
          <Link href="/tutors" className="text-sm text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {featuredTutors.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <p className="font-semibold text-sm">{t.user?.name}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {t.description}
              </p>
              <p className="text-xs mt-2 font-medium">${t.pricePerHour}/hr</p>
            </Link>
          ))}
        </div>
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
