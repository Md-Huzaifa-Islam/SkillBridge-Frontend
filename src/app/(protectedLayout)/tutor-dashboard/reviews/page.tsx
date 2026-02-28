import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetTutorRatings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export default async function TutorReviewsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.tutor) redirect("/login");

  const token = session.token;
  const profileResult = await apiGetMyTutorProfile(token).catch(() => null);
  const tutorId = profileResult?.data?.id;

  const ratings = tutorId
    ? await apiGetTutorRatings(tutorId, token)
        .then((r) => r.data)
        .catch(() => [])
    : [];

  const avg =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description={
          avg
            ? `${ratings.length} review${ratings.length !== 1 ? "s" : ""} from your students.`
            : "No reviews yet."
        }
        icon="⭐"
        badge={avg ? `${avg} avg` : undefined}
      />

      {avg && (
        <div className="border rounded-2xl p-6 bg-card grid sm:grid-cols-2 gap-6 items-center">
          {/* Big score */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-6xl font-extrabold text-amber-500 leading-none">
                {avg}
              </p>
              <div className="flex justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`text-xl ${parseFloat(avg) >= i ? "text-amber-400" : "text-muted-foreground/20"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                out of 5 · {ratings.length} review
                {ratings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {/* Bar breakdown */}
          <div className="space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-muted-foreground font-medium text-right">
                  {star}
                </span>
                <span className="text-amber-400">★</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{
                      width:
                        ratings.length > 0
                          ? `${(count / ratings.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="w-4 text-muted-foreground text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No reviews yet"
          description="Students will leave reviews after completing sessions with you."
        />
      ) : (
        <div className="space-y-3">
          {ratings.map((r) => (
            <div
              key={r.id}
              className="border rounded-2xl p-5 space-y-3 bg-card hover:shadow-sm hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {(r.booking?.student?.name ?? "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {r.booking?.student?.name ?? "Student"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`text-base ${r.rating >= i ? "text-amber-400" : "text-muted-foreground/20"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {r.review && (
                <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3 ml-1">
                  {r.review}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
