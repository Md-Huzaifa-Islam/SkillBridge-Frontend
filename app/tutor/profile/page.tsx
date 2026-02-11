import { getTutorProfile } from "@/actions/tutor";
import { getCategories } from "@/actions/categories";
import TutorProfileForm from "@/components/tutor-profile-form";

export default async function TutorProfilePage() {
  const [profileResponse, categoriesResponse] = await Promise.all([
    getTutorProfile(),
    getCategories(),
  ]);

  const profile = profileResponse.success
    ? (profileResponse.data ?? null)
    : null;
  const categories = categoriesResponse.success
    ? categoriesResponse.data || []
    : [];

  return <TutorProfileForm profile={profile} categories={categories} />;
}
