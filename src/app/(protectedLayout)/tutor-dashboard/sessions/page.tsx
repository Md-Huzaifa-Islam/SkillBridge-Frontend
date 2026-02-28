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

export default async function TutorSessionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const { data: bookings } = await apiGetBookings(session.token).catch(() => ({
    data: [],
  }));

  const active = bookings.filter((b) => b.status === "confirmed");
  const history = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Sessions"
        description="Manage your upcoming and past tutoring sessions."
        icon="📊"
        badge={`${bookings.length} total`}
      />

      <section>
        <SectionTitle badge={active.length}>Confirmed Sessions</SectionTitle>
        {active.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No confirmed sessions"
            description="Sessions booked by students will appear here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((b) => (
              <BookingCard key={b.id} booking={b} role="tutor" />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle badge={history.length}>Session History</SectionTitle>
        {history.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No past sessions"
            description="Your completed and cancelled sessions will appear here."
          />
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
