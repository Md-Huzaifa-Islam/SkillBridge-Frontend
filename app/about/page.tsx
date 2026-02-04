import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, BookOpen, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | SkillBridge",
  description:
    "Learn more about SkillBridge and our mission to make quality education accessible to everyone.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About SkillBridge</h1>

        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              SkillBridge is a comprehensive tutoring platform that connects
              students with expert tutors from around the world. Whether you're
              looking to learn a new skill, improve in a subject, or advance
              your career, our platform makes it easy to find and book sessions
              with qualified professionals.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to make quality education accessible to everyone,
              anywhere, at any time. We carefully vet all our tutors to ensure
              you receive the best learning experience possible.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verified Tutors</h3>
                  <p className="text-gray-600 text-sm">
                    All our tutors are thoroughly vetted and verified to ensure
                    quality education.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600 text-sm">
                    Learn at your own pace with tutors available across
                    different time zones.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Wide Range of Subjects</h3>
                  <p className="text-gray-600 text-sm">
                    From mathematics to music, find tutors for any subject you
                    want to learn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Track Your Progress</h3>
                  <p className="text-gray-600 text-sm">
                    Monitor your learning journey with detailed session history
                    and reviews.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
