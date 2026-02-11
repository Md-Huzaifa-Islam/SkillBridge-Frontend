import { getAllUsers } from "@/actions/admin";
import UsersClient from "@/components/admin/users-client";

interface SearchParams {
  role?: string;
  status?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const usersResponse = await getAllUsers();
  let users = usersResponse.success ? usersResponse.data || [] : [];

  if (params.role) {
    users = users.filter((u) => u.role === params.role);
  }
  if (params.status === "banned") {
    users = users.filter((u) => u.is_banned);
  } else if (params.status === "active") {
    users = users.filter((u) => !u.is_banned);
  }

  return <UsersClient initialUsers={users} filters={params} />;
}
