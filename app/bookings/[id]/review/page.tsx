import ReviewForm from "@/components/review-form";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReviewForm bookingId={id} />;
}
