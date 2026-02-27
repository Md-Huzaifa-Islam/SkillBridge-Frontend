import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetCategories } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import TutorProfileForm from "@/components/tutor/TutorProfileForm";

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
      <h1 className="text-2xl font-bold">
        {profile ? "Edit Profile" : "Create Tutor Profile"}
      </h1>
      <TutorProfileForm profile={profile} categories={categories} />
    </div>
  );
}
