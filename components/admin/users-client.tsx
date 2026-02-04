"use client";

import { useState } from "react";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/actions/admin";
import { toast } from "@/lib/toast";

export default function UsersClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    const response = await updateUserStatus(userId, !currentStatus);

    if (response.success) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_banned: !currentStatus } : u,
        ),
      );
      toast(
        currentStatus
          ? "User unbanned successfully"
          : "User banned successfully",
        "success",
      );
    } else {
      toast(response.message || "Failed to update user status", "error");
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">User Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant="secondary">{user.role}</Badge>
                      {user.is_banned && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={user.is_banned ? "default" : "destructive"}
                    size="sm"
                    onClick={() => handleToggleBan(user.id, user.is_banned)}
                    disabled={loading === user.id}
                  >
                    {loading === user.id
                      ? "Loading..."
                      : user.is_banned
                        ? "Unban"
                        : "Ban User"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
