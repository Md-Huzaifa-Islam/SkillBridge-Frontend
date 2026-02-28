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
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-600",
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
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin-dashboard/users"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to Users
      </Link>

      {/* Header card */}
      <div className="border rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-xl font-bold">{u.name}</h1>
            <p className="text-sm text-muted-foreground">{u.email}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  u.role === "tutor"
                    ? "bg-purple-100 text-purple-700"
                    : u.role === "student"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {u.role}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  u.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {u.status}
              </span>
              {u.emailVerified ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Email verified
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                  Email unverified
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
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
              <h2 className="font-semibold text-lg">Booking Statistics</h2>
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
                    className="border rounded-lg px-3 py-2 text-center"
                  >
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutor profile info */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Tutor Profile</h2>
            <div className="border rounded-xl p-4 space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                <span className="font-medium">{u.tutorProfiles.title}</span>
                {u.tutorProfiles.category && (
                  <span className="text-muted-foreground">
                    · {u.tutorProfiles.category.name}
                  </span>
                )}
                <span className="text-muted-foreground">
                  · ${u.tutorProfiles.pricePerHour}/hr
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${u.tutorProfiles.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                >
                  {u.tutorProfiles.active ? "Active" : "Inactive"}
                </span>
              </div>
              {u.tutorProfiles.description && (
                <p className="text-muted-foreground text-xs">
                  {u.tutorProfiles.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Hours: {fmtTime(u.tutorProfiles.startTime)} –{" "}
                {fmtTime(u.tutorProfiles.endTime)}
              </p>
              {u.tutorProfiles.availabilities &&
                u.tutorProfiles.availabilities.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {u.tutorProfiles.availabilities.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize"
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
        <p className="text-sm text-muted-foreground border rounded-xl p-4">
          This tutor has not set up a profile yet.
        </p>
      )}

      {/* ── STUDENT: bookings ── */}
      {isStudent && (
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">
            Bookings{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({u.bookings?.length ?? 0})
            </span>
          </h2>

          {!u.bookings || u.bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground border rounded-xl p-4">
              No bookings yet.
            </p>
          ) : (
            <div className="border rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Tutor
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right whitespace-nowrap">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {u.bookings.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-2">
                        {b.tutor?.user?.name ?? b.tutor?.title ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {fmtDate(b.date)}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[b.status] ?? ""}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
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
