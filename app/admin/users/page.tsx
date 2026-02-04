import { getAllUsers } from "@/actions/admin";
import UsersClient from "@/components/admin/users-client";

export default async function AdminUsersPage() {
  const response = await getAllUsers();
  const users = response.success ? response.data || [] : [];

  return <UsersClient initialUsers={users} />;
}
