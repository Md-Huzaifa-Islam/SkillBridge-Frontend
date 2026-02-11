import { getBookings } from "@/actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";

export default async function StudentDashboard() {
  const bookingsResponse = await getBookings();
  const bookings = bookingsResponse.success ? bookingsResponse.data || [] : [];

  const upcomingBookings = bookings.filter((b) => b.status === "confirm");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold">{bookings.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Upcoming</p>
                  <p className="text-3xl font-bold">
                    {upcomingBookings.length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-3xl font-bold">
                    {completedBookings.length}
                  </p>
                </div>
                <User className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {booking.bookingTutor?.userToTutor.name || "Tutor"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} • {booking.start_time} -{" "}
                        {booking.end_time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          booking.status === "confirm"
                            ? "default"
                            : booking.status === "completed"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <span className="font-bold">${booking.total_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Link href="/tutors">
                  <Button>Find a Tutor</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
