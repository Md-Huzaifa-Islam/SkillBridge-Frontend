"use client";

import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleBanButton } from "@/components/admin/toggle-ban-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Filters {
  role?: string;
  status?: string;
}

export default function UsersClient({
  initialUsers,
  filters = {},
}: {
  initialUsers: User[];
  filters?: Filters;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">User Management</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form
            action="/admin/users"
            method="get"
            className="flex gap-4 flex-wrap"
          >
            <select
              name="role"
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2"
              defaultValue={filters.role || ""}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>

            <select
              name="status"
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2"
              defaultValue={filters.status || ""}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>

            <Button type="submit">Apply Filters</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/users">Clear</Link>
            </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({initialUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "destructive"
                            : user.role === "teacher"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      {user.is_banned && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ToggleBanButton
                    userId={user.id}
                    isBanned={user.is_banned}
                    disabled={user.role === "admin"}
                  />
                </div>
              ))}

              {initialUsers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No users found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
