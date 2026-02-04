import { getTutorProfile, getTutorSessions } from "@/actions/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, DollarSign, Star, Users } from "lucide-react";

export default async function TutorDashboard() {
  const [profileResponse, sessionsResponse] = await Promise.all([
    getTutorProfile(),
    getTutorSessions(),
  ]);

  const profile = profileResponse.success ? profileResponse.data : null;
  const sessions = sessionsResponse.success ? sessionsResponse.data || [] : [];

  const upcomingSessions = sessions.filter((s) => s.status === "confirm");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalEarnings = completedSessions.reduce(
    (sum, s) => sum + s.total_price,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Tutor Dashboard</h1>
          <Link href="/tutor/profile">
            <Button>Edit Profile</Button>
          </Link>
        </div>

        {profile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Sessions</p>
                      <p className="text-3xl font-bold">{sessions.length}</p>
                    </div>
                    <Calendar className="h-12 w-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Upcoming</p>
                      <p className="text-3xl font-bold">
                        {upcomingSessions.length}
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Earnings</p>
                      <p className="text-3xl font-bold">${totalEarnings}</p>
                    </div>
                    <DollarSign className="h-12 w-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Rating</p>
                      <p className="text-3xl font-bold">
                        {profile.averageRating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                    <Star className="h-12 w-12 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.slice(0, 10).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {session.bookingStudent?.name || "Student"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {session.date} • {session.start_time} -{" "}
                            {session.end_time}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              session.status === "confirm"
                                ? "default"
                                : session.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {session.status}
                          </Badge>
                          <span className="font-bold">
                            ${session.total_price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No sessions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">
                Please complete your tutor profile
              </p>
              <Link href="/tutor/profile">
                <Button>Create Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
