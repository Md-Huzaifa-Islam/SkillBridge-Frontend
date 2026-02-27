import { getSession } from "@/lib/auth";
import { apiMe } from "@/lib/api";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/roles";
import EditProfileForm from "@/components/dashboard/EditProfileForm";

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

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold uppercase">
            {user.name?.[0] ?? "S"}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>
      </div>
      <EditProfileForm initialName={user.name} />
    </div>
  );
}
