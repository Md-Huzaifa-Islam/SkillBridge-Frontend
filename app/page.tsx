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
  ArrowRight,
  Sparkles,
  GraduationCap,
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
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:via-blue-950 dark:to-purple-950 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Trusted by 5,000+ students worldwide</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect with Expert Tutors,{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Learn Anything
              </span>
            </h1>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Find qualified tutors for any subject. Book sessions instantly and
              start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg px-8 h-14 shadow-lg shadow-blue-900/20"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Tutors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/10 font-semibold text-lg px-8 h-14"
                >
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make learning accessible, flexible, and secure for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Tutors</h3>
                <p className="text-muted-foreground">
                  Learn from verified professionals with proven track records
                  and excellent reviews.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Flexible Scheduling
                </h3>
                <p className="text-muted-foreground">
                  Book sessions that fit your schedule. Learn at your own pace,
                  anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  Secure payments and verified tutors ensure a safe learning
                  experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Featured Tutors
              </h2>
              <p className="text-muted-foreground mt-2">
                Handpicked experts ready to help you learn
              </p>
            </div>
            <Link href="/tutors">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {featuredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.slice(0, 6).map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-16 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No featured tutors available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Browse tutors by subject area
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/tutors?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-5xl font-bold mb-2">1000+</h3>
              <p className="text-blue-100 text-lg">Expert Tutors</p>
            </div>
            <div>
              <Star className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-5xl font-bold mb-2">10,000+</h3>
              <p className="text-blue-100 text-lg">Sessions Completed</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-5xl font-bold mb-2">5,000+</h3>
              <p className="text-blue-100 text-lg">Happy Students</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-0 shadow-lg">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students already learning on SkillBridge. Your
                next breakthrough is just a session away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/tutors">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold px-8"
                  >
                    Browse Tutors
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
