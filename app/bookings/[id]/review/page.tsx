import ReviewForm from "@/components/review-form";

export default function ReviewPage({ params }: { params: { id: string } }) {
  return <ReviewForm bookingId={params.id} />;
}
