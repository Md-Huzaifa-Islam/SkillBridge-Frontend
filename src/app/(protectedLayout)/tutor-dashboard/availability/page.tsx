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

  const profile = profileResult?.data ?? null;

  if (!profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground text-sm">
          You need to create a tutor profile first before managing availability.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground text-sm">
          Select the days of the week you are available to teach.
        </p>
      </div>
      <AvailabilityManager
        availabilities={profile.availabilities ?? []}
        tutorProfileId={profile.id}
      />
    </div>
  );
}
