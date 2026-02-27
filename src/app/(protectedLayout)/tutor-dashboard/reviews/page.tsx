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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        {avg && (
          <p className="text-muted-foreground text-sm">
            Average rating:{" "}
            <span className="font-semibold text-foreground">⭐ {avg}</span> from{" "}
            {ratings.length} review{ratings.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

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
                <span className="text-sm">{"⭐".repeat(r.rating)}</span>
              </div>
              {r.review && (
                <p className="text-sm text-muted-foreground">{r.review}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
