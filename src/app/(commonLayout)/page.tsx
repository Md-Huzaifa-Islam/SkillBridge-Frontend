import { Navbar } from "@/components/navbar";
import { apiGetTutors, apiGetCategories } from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [tutorsResult, categoriesResult] = await Promise.allSettled([
    apiGetTutors("limit=6&page=1", 60),
    apiGetCategories(),
  ]);

  const featuredTutors =
    tutorsResult.status === "fulfilled" ? tutorsResult.value.data : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];

  return (
    <>
      {/* Navbar spacer */}
      <div className="h-16" />

      {/* Hero */}
      <section className="py-20 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Connect with Expert Tutors,
          <br />
          <span className="text-primary">Learn Anything</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          SkillBridge connects learners with expert tutors. Browse profiles,
          view availability, and book sessions instantly.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/tutors"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            Find a Tutor
          </Link>
          <Link
            href="/register"
            className="border px-6 py-2.5 rounded-lg font-medium hover:bg-muted transition"
          >
            Become a Tutor
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-10 space-y-4">
          <h2 className="text-2xl font-bold text-center">Browse by Category</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/tutors?category=${c.id}`}
                className="border px-4 py-1.5 rounded-full text-sm hover:bg-muted transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured tutors */}
      <section className="py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Tutors</h2>
          <Link href="/tutors" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTutors.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className="border rounded-xl p-5 hover:bg-muted/50 transition-colors space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold uppercase text-primary">
                  {t.user?.name?.[0] ?? "T"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.user?.name}</p>
                  {t.category && (
                    <p className="text-xs text-muted-foreground">
                      {t.category.name}
                    </p>
                  )}
                </div>
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {t.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-medium">${t.pricePerHour}/hr</span>
                {t.avgRating != null && (
                  <span className="text-muted-foreground">
                    ⭐ {t.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to start learning?</h2>
        <p className="text-muted-foreground text-sm">
          Join thousands of students already using SkillBridge.
        </p>
        <Link
          href="/register"
          className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          Get Started Free
        </Link>
      </section>
    </>
  );
}
