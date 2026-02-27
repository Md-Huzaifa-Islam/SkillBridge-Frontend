import { apiGetTutor, apiGetTutorRatings } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { UserRoles } from "@/constants/roles";
import { notFound } from "next/navigation";
import BookingPanel from "@/components/tutors/BookingPanel";
import Link from "next/link";

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

  const ratings = await apiGetTutorRatings(id)
    .then((r) => r.data)
    .catch(() => []);

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : null;

  return (
    <div className="pb-10">
      <div className="mb-4">
        <Link
          href="/dashboard/tutors"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to tutors
        </Link>
      </div>

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
              <p className="text-muted-foreground text-sm font-medium">
                {tutor.title}
              </p>
              {tutor.category && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {tutor.category.name}
                </span>
              )}
              {avgRating && (
                <p className="text-sm text-muted-foreground">
                  ⭐ {avgRating}{" "}
                  <span className="text-xs">
                    ({ratings.length} review{ratings.length !== 1 ? "s" : ""})
                  </span>
                </p>
              )}
              <p className="text-sm font-semibold">${tutor.pricePerHour}/hr</p>
            </div>
          </div>

          {/* Description */}
          {tutor.description && (
            <section className="space-y-2">
              <h2 className="font-semibold text-lg">About</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tutor.description}
              </p>
            </section>
          )}

          {/* Available days */}
          {tutor.availabilities && tutor.availabilities.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-semibold text-lg">Available Days</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.availabilities.map((a) => (
                  <span
                    key={a.id}
                    className="bg-muted px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {a.day}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Reviews</h2>
            {ratings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {r.booking?.student?.name ?? "Student"}
                      </p>
                      <span className="text-sm text-yellow-400">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    {r.review && (
                      <p className="text-sm text-muted-foreground">
                        {r.review}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {isStudent && (
              <p className="text-xs text-muted-foreground">
                Leave a review from your{" "}
                <Link href="/dashboard/bookings" className="underline">
                  bookings page
                </Link>{" "}
                after completing a session.
              </p>
            )}
          </section>
        </div>

        {/* Right: booking panel */}
        <div className="space-y-4">
          <BookingPanel
            tutorId={tutor.id}
            availabilities={tutor.availabilities ?? []}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </div>
  );
}
