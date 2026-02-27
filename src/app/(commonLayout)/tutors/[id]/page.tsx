import { apiGetTutor, apiGetReviews } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { UserRoles } from "@/constants/roles";
import { notFound } from "next/navigation";
import BookingPanel from "@/components/tutors/BookingPanel";
import ReviewForm from "@/components/tutors/ReviewForm";

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

export default async function TutorDetailPage({ params }: PageProps) {
  const { id } = await params;

  const tutorResult = await apiGetTutor(id).catch(() => null);
  if (!tutorResult) notFound();
  const tutor = tutorResult.data;

  const session = await getSession();
  const isLoggedIn = !!session;
  const isStudent = session?.user.role === UserRoles.student;

  const reviews = await apiGetReviews(id, session?.token ?? "")
    .then((r) => r.data)
    .catch(() => []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const slots = tutor.availableSlots ?? [];

  return (
    <div className="pt-20 pb-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: tutor info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold uppercase text-primary shrink-0">
              {tutor.user?.name?.[0] ?? "T"}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{tutor.user?.name}</h1>
              {tutor.category && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {tutor.category.name}
                </span>
              )}
              {avgRating && (
                <p className="text-sm text-muted-foreground">
                  ⭐ {avgRating}{" "}
                  <span className="text-xs">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </p>
              )}
              <p className="text-sm font-semibold">${tutor.hourlyRate}/hr</p>
            </div>
          </div>

          {/* Bio */}
          <section className="space-y-2">
            <h2 className="font-semibold text-lg">About</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tutor.bio}
            </p>
          </section>

          {/* Subjects */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-semibold text-lg">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((s) => (
                  <span
                    key={s}
                    className="bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {r.student?.name ?? "Student"}
                      </p>
                      <span className="text-sm text-yellow-400">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {isStudent && <ReviewForm tutorId={id} />}
          </section>
        </div>

        {/* Right: booking */}
        <div className="space-y-4">
          <BookingPanel tutorId={id} slots={slots} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
