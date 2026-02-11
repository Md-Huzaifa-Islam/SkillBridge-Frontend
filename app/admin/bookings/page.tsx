import { getAllBookings } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchParams {
  status?: string;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const response = await getAllBookings();
  let bookings = response.success ? response.data || [] : [];

  if (params.status) {
    bookings = bookings.filter((b) => b.status === params.status);
  }

  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">All Bookings</h1>

        <div className="bg-card rounded-lg shadow-md p-6 mb-8">
          <form
            action="/admin/bookings"
            method="get"
            className="flex gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                className="h-10 rounded-md border border-input bg-card px-3 py-2"
                defaultValue={params.status || ""}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirm">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <Button type="submit">Apply Filter</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/bookings">Clear</Link>
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">Total Bookings</p>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

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
                    <div className="text-sm text-muted-foreground mt-1">
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

              {bookings.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No bookings found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
