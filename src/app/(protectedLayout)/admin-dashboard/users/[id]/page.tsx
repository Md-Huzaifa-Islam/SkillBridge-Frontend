import { getSession } from "@/lib/auth";
import { apiAdminGetUser } from "@/lib/api";
import { redirect, notFound } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import Link from "next/link";
import BanButton from "@/components/admin/BanButton";

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

const STATUS_COLOR: Record<string, string> = {
  confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.admin) redirect("/login");

  const { id } = await params;
  const result = await apiAdminGetUser(session.token, id).catch(() => null);
  if (!result) notFound();

  const u = result.data;
  const isTutor = u.role === "tutor";
  const isStudent = u.role === "student";

  return (
    <div className="space-y-6 max-w-4xl p-1">
      {/* Back */}
      <Link
        href="/admin-dashboard/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        ← Back to Users
      </Link>

      {/* Header card */}
      <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-xl font-bold text-primary shrink-0">
              {u.name[0]?.toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold tracking-tight">
                {u.name}
              </h1>
              <p className="text-sm text-muted-foreground">{u.email}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    u.role === "tutor"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                      : u.role === "student"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                  }`}
                >
                  {u.role}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    u.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  }`}
                >
                  {u.status}
                </span>
                {u.emailVerified ? (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium">
                    ✓ Email verified
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 font-medium">
                    Email unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <BanButton
              userId={u.id}
              currentStatus={u.status as "active" | "banned"}
            />
            <p className="text-xs text-muted-foreground">
              Joined {fmtDate(u.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ── TUTOR: profile + stats ── */}
      {isTutor && u.tutorProfiles && (
        <>
          {/* Booking stats */}
          {u.tutorStats && (
            <div className="space-y-3">
              <h2 className="font-bold text-base tracking-tight">
                Booking Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Total", value: u.tutorStats.total },
                  { label: "Confirmed", value: u.tutorStats.confirmed },
                  { label: "Completed", value: u.tutorStats.completed },
                  { label: "Cancelled", value: u.tutorStats.cancelled },
                  {
                    label: "Avg Rating",
                    value:
                      u.tutorStats.avgRating != null
                        ? `${u.tutorStats.avgRating.toFixed(1)} ⭐`
                        : "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="border rounded-2xl px-3 py-4 text-center bg-card hover:shadow-sm transition-shadow"
                  >
                    <p className="text-xs text-muted-foreground font-medium">
                      {label}
                    </p>
                    <p className="text-xl font-extrabold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutor profile info */}
          <div className="space-y-3">
            <h2 className="font-bold text-base tracking-tight">
              Tutor Profile
            </h2>
            <div className="border rounded-2xl p-5 space-y-3 text-sm bg-card">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="font-semibold text-base">
                  {u.tutorProfiles.title}
                </span>
                {u.tutorProfiles.category && (
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    {u.tutorProfiles.category.name}
                  </span>
                )}
                <span className="text-xs font-bold text-primary">
                  ${u.tutorProfiles.pricePerHour}/hr
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.tutorProfiles.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}
                >
                  {u.tutorProfiles.active ? "Active" : "Inactive"}
                </span>
              </div>
              {u.tutorProfiles.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {u.tutorProfiles.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Hours:{" "}
                <span className="font-medium text-foreground">
                  {fmtTime(u.tutorProfiles.startTime)} –{" "}
                  {fmtTime(u.tutorProfiles.endTime)}
                </span>
              </p>
              {u.tutorProfiles.availabilities &&
                u.tutorProfiles.availabilities.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {u.tutorProfiles.availabilities.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full capitalize font-medium border"
                      >
                        {a.day}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </>
      )}

      {isTutor && !u.tutorProfiles && (
        <div className="border rounded-2xl p-5 bg-muted/20 text-sm text-muted-foreground">
          This tutor has not set up a profile yet.
        </div>
      )}

      {/* ── STUDENT: bookings ── */}
      {isStudent && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base tracking-tight">Bookings</h2>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
              {u.bookings?.length ?? 0}
            </span>
          </div>

          {!u.bookings || u.bookings.length === 0 ? (
            <div className="border rounded-2xl py-10 text-center space-y-2 bg-muted/20">
              <p className="text-2xl">📋</p>
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            </div>
          ) : (
            <div className="border rounded-2xl overflow-x-auto bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      Tutor
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {u.bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {b.tutor?.user?.name ?? b.tutor?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {fmtDate(b.date)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLOR[b.status] ?? ""}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${b.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
