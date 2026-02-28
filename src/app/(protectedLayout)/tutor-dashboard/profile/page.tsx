import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetCategories } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import TutorProfileForm from "@/components/tutor/TutorProfileForm";
import { PageHeader } from "@/components/dashboard/ui";

export default async function TutorProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const [profileResult, categoriesResult] = await Promise.allSettled([
    apiGetMyTutorProfile(session.token),
    apiGetCategories(),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value.data : null;
  const categories =
    categoriesResult.status === "fulfilled" &&
    Array.isArray(categoriesResult.value.data)
      ? categoriesResult.value.data
      : [];

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title={profile ? "Edit Tutor Profile" : "Create Tutor Profile"}
        description={
          profile
            ? "Update your profile details, rates, and category."
            : "Set up your public tutor profile to start receiving bookings."
        }
        icon={profile ? "✏️" : "✨"}
      />
      <div className="border rounded-2xl p-6 bg-card">
        <TutorProfileForm profile={profile} categories={categories} />
      </div>
    </div>
  );
}
