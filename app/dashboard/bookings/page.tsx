import { getBookings } from "@/actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MyBookingsPage() {
  const bookingsResponse = await getBookings();
  const bookings = bookingsResponse.success ? bookingsResponse.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        Session with{" "}
                        {booking.bookingTutor?.userToTutor.name || "Tutor"}
                      </h3>
                      <div className="space-y-1 text-gray-600">
                        <p>Date: {booking.date}</p>
                        <p>
                          Time: {booking.start_time} - {booking.end_time}
                        </p>
                        <p>Category: {booking.bookingTutor?.category.name}</p>
                        <p className="font-semibold text-lg text-black mt-2">
                          Total: ${booking.total_price}
                        </p>
                      </div>
                    </div>
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
                  </div>
                  {booking.status === "completed" && !booking.ratings && (
                    <div className="mt-4">
                      <Link href={`/bookings/${booking.id}/review`}>
                        <Button variant="outline">Leave a Review</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <Link href="/tutors">
                <Button>Find a Tutor</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
