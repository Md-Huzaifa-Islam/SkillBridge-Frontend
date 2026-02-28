import { getSession } from "@/lib/auth";
import { apiGetBookings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import BookingCard from "@/components/dashboard/BookingCard";
import {
  PageHeader,
  EmptyState,
  SectionTitle,
} from "@/components/dashboard/ui";

export default async function StudentBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.student) redirect("/login");

  const { data: bookings } = await apiGetBookings(session.token).catch(() => ({
    data: [],
  }));

  const active = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        description="All your scheduled and past tutoring sessions."
        icon="📚"
        badge={`${bookings.length} total`}
      />

      <section>
        <SectionTitle badge={active.length}>Upcoming Sessions</SectionTitle>
        {active.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No upcoming sessions"
            description="Your confirmed sessions will appear here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((b) => (
              <BookingCard key={b.id} booking={b} role="student" />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle badge={past.length}>Past Sessions</SectionTitle>
        {past.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No past sessions yet"
            description="Completed and cancelled sessions will appear here."
          />
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
