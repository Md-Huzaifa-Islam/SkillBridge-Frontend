import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import AvailabilityManager from "@/components/tutor/AvailabilityManager";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import Link from "next/link";

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
      <div className="space-y-6">
        <PageHeader
          title="Availability"
          description="Set the days and times you are available to teach."
          icon="📅"
        />
        <EmptyState
          icon="⚠️"
          title="No tutor profile found"
          description="You need to create a tutor profile before managing your availability."
          action={
            <Link
              href="/tutor-dashboard/profile"
              className="inline-block text-sm bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Create Profile
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability"
        description="Select the days of the week you are available to teach."
        icon="📅"
      />
      <div className="border rounded-2xl p-6 bg-card">
        <AvailabilityManager
          availabilities={profile.availabilities ?? []}
          tutorProfileId={profile.id}
        />
      </div>
    </div>
  );
}
