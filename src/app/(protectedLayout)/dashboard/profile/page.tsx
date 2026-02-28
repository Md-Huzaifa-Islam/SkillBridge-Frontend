import { getSession } from "@/lib/auth";
import { apiMe } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import EditProfileForm from "@/components/dashboard/EditProfileForm";
import { PageHeader } from "@/components/dashboard/ui";

export default async function StudentProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== UserRoles.student) redirect("/login");

  const { user } = await apiMe(session.token).catch(() => ({
    user: {
      id: session.user.id,
      name: "",
      email: session.user.email,
      role: session.user.role,
    },
  }));

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings."
        icon="👤"
      />

      {/* Avatar card */}
      <div className="border rounded-2xl p-6 bg-card hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-18 w-18 rounded-2xl bg-linear-to-br from-primary/25 to-violet-500/25 flex items-center justify-center text-2xl font-extrabold text-primary ring-4 ring-primary/10 select-none">
              {initials}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold">{user.name || "—"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="inline-flex text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold capitalize border border-primary/10">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="border rounded-2xl p-6 bg-card space-y-4">
        <div className="space-y-0.5 mb-2">
          <h2 className="font-bold text-base">Edit Information</h2>
          <p className="text-xs text-muted-foreground">
            Update your display name below.
          </p>
        </div>
        <EditProfileForm initialName={user.name} />
      </div>
    </div>
  );
}
