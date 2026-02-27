import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import BookingCard from "@/components/dashboard/BookingCard";

export default async function TutorSessionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const { data: bookings } = await apiGetBookings(session.token).catch(() => ({
    data: [],
  }));

  const pending = bookings.filter((b) => b.status === "PENDING");
  const active = bookings.filter((b) => b.status === "CONFIRMED");
  const history = bookings.filter((b) =>
    ["COMPLETED", "CANCELLED"].includes(b.status),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Sessions</h1>

      <section>
        <h2 className="font-semibold text-lg mb-3">
          Pending Requests{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({pending.length})
          </span>
        </h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending requests.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pending.map((b) => (
              <BookingCard key={b.id} booking={b} role="tutor" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-3">Confirmed Sessions</h2>
        {active.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No confirmed sessions.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((b) => (
              <BookingCard key={b.id} booking={b} role="tutor" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-3">History</h2>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm">No past sessions.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {history.map((b) => (
              <BookingCard key={b.id} booking={b} role="tutor" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
