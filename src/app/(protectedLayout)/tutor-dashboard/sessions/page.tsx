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

  // Bookings start as "confirmed" — there is no pending status
  const active = bookings.filter((b) => b.status === "confirmed");
  const history = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Sessions</h1>

      <section>
        <h2 className="font-semibold text-lg mb-3">
          Confirmed Sessions{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({active.length})
          </span>
        </h2>
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
        <h2 className="font-semibold text-lg mb-3">
          History{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({history.length})
          </span>
        </h2>
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
