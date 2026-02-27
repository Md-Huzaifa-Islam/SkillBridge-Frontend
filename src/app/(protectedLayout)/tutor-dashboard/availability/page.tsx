import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import AvailabilityManager from "@/components/tutor/AvailabilityManager";

export default async function TutorAvailabilityPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const profileResult = await apiGetMyTutorProfile(session.token).catch(
    () => null,
  );
  const slots = profileResult?.data?.availableSlots ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground text-sm">
          Manage your available time slots for students to book.
        </p>
      </div>
      <AvailabilityManager slots={slots} />
    </div>
  );
}
