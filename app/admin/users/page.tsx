import { getAllUsers } from "@/actions/admin";
import UsersClient from "@/components/admin/users-client";

interface SearchParams {
  role?: string;
  status?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const usersResponse = await getAllUsers();
  let users = usersResponse.success ? usersResponse.data || [] : [];

  if (searchParams.role) {
    users = users.filter((u) => u.role === searchParams.role);
  }
  if (searchParams.status === "banned") {
    users = users.filter((u) => u.is_banned);
  } else if (searchParams.status === "active") {
    users = users.filter((u) => !u.is_banned);
  }

  return <UsersClient initialUsers={users} filters={searchParams} />;
}
