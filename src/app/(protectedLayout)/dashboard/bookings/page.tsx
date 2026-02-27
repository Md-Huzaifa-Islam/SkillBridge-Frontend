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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      <section>
        <h2 className="font-semibold text-lg mb-3">
          Upcoming Sessions{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({active.length})
          </span>
        </h2>
        {active.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming sessions.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((b) => (
              <BookingCard key={b.id} booking={b} role="student" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-3">
          Past Sessions{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({past.length})
          </span>
        </h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground text-sm">No past sessions yet.</p>
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
