import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import BookingCard from "@/components/dashboard/BookingCard";

export default async function StudentBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.student) redirect("/login");

  const { data: bookings } = await apiGetBookings(session.token).catch(() => ({
    data: [],
  }));

  // Bookings start as "confirmed" — no pending status in the system
  const active = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          All your scheduled and past sessions.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base tracking-tight">
            Upcoming Sessions
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
            {active.length}
          </span>
        </div>
        {active.length === 0 ? (
          <div className="border rounded-2xl py-10 text-center space-y-2 bg-muted/20">
            <p className="text-2xl">📅</p>
            <p className="text-sm text-muted-foreground">
              No upcoming sessions.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((b) => (
              <BookingCard key={b.id} booking={b} role="student" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base tracking-tight">Past Sessions</h2>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
            {past.length}
          </span>
        </div>
        {past.length === 0 ? (
          <div className="border rounded-2xl py-10 text-center space-y-2 bg-muted/20">
            <p className="text-2xl">📋</p>
            <p className="text-sm text-muted-foreground">
              No past sessions yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} role="student" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
