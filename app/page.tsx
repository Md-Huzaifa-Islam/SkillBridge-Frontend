import { getFeaturedTutors } from "@/actions/tutors";
import { getCategories } from "@/actions/categories";
import { TutorCard } from "@/components/tutor-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Shield,
  Star,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";

export default async function Home() {
  const [featuredResponse, categoriesResponse] = await Promise.all([
    getFeaturedTutors(),
    getCategories(),
  ]);

  const featuredTutors = featuredResponse.success
    ? featuredResponse.data || []
    : [];
  const categories = categoriesResponse.success
    ? categoriesResponse.data || []
    : [];

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect with Expert Tutors, Learn Anything
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Find qualified tutors for any subject. Book sessions instantly and
              start learning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Tutors
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SkillBridge?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
                <p className="text-gray-600">
                  Learn from verified professionals with proven track records
                  and excellent reviews.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-600">
                  Book sessions that fit your schedule. Learn at your own pace,
                  anytime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-gray-600">
                  Secure payments and verified tutors ensure a safe learning
                  experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Tutors</h2>
            <Link href="/tutors">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {featuredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.slice(0, 6).map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">
                  No featured tutors available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/tutors?category=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-blue-100">Expert Tutors</p>
            </div>
            <div>
              <Star className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-blue-100">Sessions Completed</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">5,000+</h3>
              <p className="text-blue-100">Happy Students</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
