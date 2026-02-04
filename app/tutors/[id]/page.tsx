import { getTutorById } from "@/actions/tutors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TutorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getTutorById(params.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const tutor = response.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                    {tutor.userToTutor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">
                          {tutor.userToTutor.name}
                        </h1>
                        <Badge variant="secondary" className="mb-2">
                          {tutor.category.name}
                        </Badge>
                        {tutor.featured && (
                          <Badge
                            variant="default"
                            className="bg-yellow-500 ml-2"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">
                          {tutor.averageRating?.toFixed(1) || "New"}
                        </span>
                        {tutor._count && (
                          <span className="text-gray-500">
                            ({tutor._count.bookings} sessions)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {tutor.description || "No description provided yet."}
                </p>
              </CardContent>
            </Card>

            {tutor.availables && tutor.availables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tutor.availables.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <span className="font-medium capitalize">
                          {slot.day}
                        </span>
                        <span className="text-gray-600">
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  No reviews yet. Be the first to book and review!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600">Price per hour</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${tutor.price_per_hour}
                    </span>
                  </div>

                  <Link href={`/tutors/${tutor.id}/book`} className="block">
                    <Button className="w-full" size="lg">
                      <Clock className="mr-2 h-5 w-5" />
                      Book Session
                    </Button>
                  </Link>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Quick Facts</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Verified tutor</li>
                      <li>✓ Quick response time</li>
                      <li>✓ Professional experience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
