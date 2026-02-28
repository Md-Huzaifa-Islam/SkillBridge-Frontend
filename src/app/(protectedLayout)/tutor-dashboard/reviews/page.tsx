import { getSession } from "@/lib/auth";
import { apiGetMyTutorProfile, apiGetTutorRatings } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";

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

  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Reviews</h1>
        {avg ? (
          <p className="text-muted-foreground text-sm mt-0.5">
            Average rating:{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ⭐ {avg}
            </span>{" "}
            from{" "}
            <span className="font-semibold text-foreground">
              {ratings.length}
            </span>{" "}
            review{ratings.length !== 1 ? "s" : ""}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm mt-0.5">
            No reviews yet.
          </p>
        )}
      </div>

      {/* Rating summary */}
      {avg && (
        <div className="border rounded-2xl p-5 bg-card flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-amber-500">{avg}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 5</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              {ratings.length} total review{ratings.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-lg ${parseFloat(avg) >= i ? "text-amber-400" : "text-muted"}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <div className="border rounded-2xl py-16 text-center space-y-3">
          <p className="text-4xl">💬</p>
          <p className="font-semibold">No reviews yet</p>
          <p className="text-sm text-muted-foreground">
            Students will leave reviews after completed sessions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ratings.map((r) => (
            <div
              key={r.id}
              className="border rounded-2xl p-5 space-y-2 bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {(r.booking?.student?.name ?? "S")[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm">
                    {r.booking?.student?.name ?? "Student"}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`text-base ${r.rating >= i ? "text-amber-400" : "text-muted-foreground/30"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {r.review && (
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                  {r.review}
                </p>
              )}
              <p className="text-xs text-muted-foreground pl-11">
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
    </div>
  );
}
