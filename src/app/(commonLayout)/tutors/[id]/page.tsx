import { apiGetTutor, apiGetTutorRatings } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { UserRoles } from "@/constants/roles";
import { notFound } from "next/navigation";
import BookingPanel from "@/components/tutors/BookingPanel";

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
    <div className="pt-20 pb-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: tutor info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-5 p-6 rounded-2xl border bg-card shadow-sm">
            <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-3xl font-bold uppercase text-primary ring-4 ring-primary/10 shrink-0">
              {tutor.user?.name?.[0] ?? "T"}
            </div>
            <div className="space-y-2 min-w-0">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {tutor.user?.name}
                </h1>
                {tutor.title && (
                  <p className="text-muted-foreground text-sm font-medium mt-0.5">
                    {tutor.title}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tutor.category && (
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {tutor.category.name}
                  </span>
                )}
                {avgRating && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-3 py-1 rounded-full">
                    ⭐ {avgRating}{" "}
                    <span className="opacity-70">
                      ({ratings.length} review{ratings.length !== 1 ? "s" : ""})
                    </span>
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-primary">
                ${tutor.pricePerHour}
                <span className="text-sm font-normal text-muted-foreground">
                  /hr
                </span>
              </p>
            </div>
          </div>

          {/* Description */}
          {tutor.description && (
            <section className="space-y-3">
              <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary inline-block" />
                About
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tutor.description}
              </p>
            </section>
          )}

          {/* Available days */}
          {tutor.availabilities && tutor.availabilities.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary inline-block" />
                Available Days
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.availabilities.map((a) => (
                  <span
                    key={a.id}
                    className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm capitalize font-medium border"
                  >
                    {a.day}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="space-y-4">
            <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-primary inline-block" />
              Reviews
              {ratings.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({ratings.length})
                </span>
              )}
            </h2>
            {ratings.length === 0 ? (
              <div className="border rounded-2xl py-10 text-center space-y-2">
                <p className="text-2xl">💬</p>
                <p className="text-muted-foreground text-sm">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-2xl p-4 space-y-2 bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {(r.booking?.student?.name ?? "S")[0].toUpperCase()}
                        </div>
                        <p className="font-semibold text-sm">
                          {r.booking?.student?.name ?? "Student"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">
                          {"★".repeat(r.rating)}
                        </span>
                        <span className="text-muted-foreground/40 text-sm">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </div>
                    </div>
                    {r.review && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                        {r.review}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground pl-10">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {isStudent && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 border">
                💡 Leave a review from your{" "}
                <a
                  href="/dashboard/bookings"
                  className="underline font-medium text-primary"
                >
                  bookings page
                </a>{" "}
                after completing a session.
              </p>
            )}
          </section>
        </div>

        {/* Right: booking panel */}
        <div className="space-y-4 lg:sticky lg:top-24">
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
