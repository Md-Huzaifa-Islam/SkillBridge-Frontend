import { getTutors } from "@/actions/tutors";
import { getCategories } from "@/actions/categories";
import TutorsClient from "@/components/tutors-client";

export default async function TutorsPage() {
  const [tutorsResponse, categoriesResponse] = await Promise.all([
    getTutors(),
    getCategories(),
  ]);

  const tutors =
    tutorsResponse.success && tutorsResponse.data
      ? tutorsResponse.data.data
      : [];
  const categories = categoriesResponse.success
    ? categoriesResponse.data || []
    : [];

  return <TutorsClient initialTutors={tutors} categories={categories} />;
}
