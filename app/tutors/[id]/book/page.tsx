import { getTutorById } from "@/actions/tutors";
import BookingForm from "@/components/booking-form";
import { notFound } from "next/navigation";

export default async function BookTutorPage({ params }: { params: { id: string } }) {
  const response = await getTutorById(params.id);

  if (!response.success || !response.data) {
    notFound();
  }

  return <BookingForm tutor={response.data} />;
}
