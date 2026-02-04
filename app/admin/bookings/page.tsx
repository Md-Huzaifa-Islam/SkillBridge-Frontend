import { getAllBookings } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminBookingsPage() {
  const response = await getAllBookings();
  const bookings = response.success ? response.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">All Bookings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold">
                      {booking.bookingStudent?.name} →{" "}
                      {booking.bookingTutor?.userToTutor.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Category: {booking.bookingTutor?.category.name}</p>
                      <p>
                        {booking.date} • {booking.start_time} -{" "}
                        {booking.end_time}
                      </p>
                      <p className="font-semibold mt-1">
                        Price: ${booking.total_price}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
