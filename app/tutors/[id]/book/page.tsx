import { getTutorById } from "@/actions/tutors";
import BookingForm from "@/components/booking-form";
import { notFound } from "next/navigation";

export default async function BookTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getTutorById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return <BookingForm tutor={response.data} />;
}
