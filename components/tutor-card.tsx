import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorProfile } from "@/types";
import Link from "next/link";
import { Star } from "lucide-react";

interface TutorCardProps {
  tutor: TutorProfile;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Link href={`/tutors/${tutor.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {tutor.userToTutor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {tutor.userToTutor.name}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {tutor.category.name}
                  </Badge>
                </div>
                {tutor.featured && (
                  <Badge variant="default" className="bg-yellow-500">
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 mt-2 line-clamp-2">
                {tutor.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {tutor.averageRating?.toFixed(1) || "New"}
                  </span>
                  {tutor._count && (
                    <span className="text-sm text-gray-500">
                      ({tutor._count.bookings})
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ${tutor.price_per_hour}
                  <span className="text-sm font-normal text-gray-500">/hr</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
