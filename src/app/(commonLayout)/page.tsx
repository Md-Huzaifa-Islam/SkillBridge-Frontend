import { apiGetTutors, apiGetCategories } from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [tutorsResult, categoriesResult] = await Promise.allSettled([
    apiGetTutors("limit=6&page=1", 60),
    apiGetCategories(),
  ]);

  const featuredTutors =
    tutorsResult.status === "fulfilled"
      ? (tutorsResult.value.data?.data ?? [])
      : [];
  const categories =
    categoriesResult.status === "fulfilled" &&
    Array.isArray(categoriesResult.value.data)
      ? categoriesResult.value.data
      : [];

  return (
    <>
      {/* Navbar spacer */}
      <div className="h-16" />

      {/* Hero */}
      <section className="relative py-24 sm:py-32 text-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>

        <div className="space-y-7 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by thousands of learners
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Connect with Expert Tutors,
            <br />
            <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Learn Anything
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            SkillBridge connects learners with expert tutors. Browse profiles,
            view availability, and book sessions instantly.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link
              href="/tutors"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Find a Tutor
            </Link>
            <Link
              href="/register"
              className="border-2 border-primary/30 text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/60 transition-all duration-200"
            >
              Become a Tutor
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center">
          {[
            { value: "500+", label: "Expert Tutors" },
            { value: "1,200+", label: "Sessions Booked" },
            { value: "50+", label: "Subjects" },
            { value: "4.8★", label: "Avg. Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground text-sm">
              Find tutors in your area of interest
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {categories.map((c, i) => {
              const colorSets = [
                "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
                "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
                "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
                "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
                "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
                "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
              ];
              return (
                <Link
                  key={c.id}
                  href={`/tutors?category=${c.id}`}
                  className={`border px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${colorSets[i % colorSets.length]}`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured tutors */}
      <section className="py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Tutors</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Hand-picked top educators
            </p>
          </div>
          <Link
            href="/tutors"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTutors.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className="group border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/8 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-lg font-bold uppercase text-primary ring-2 ring-primary/10 shrink-0">
                  {t.user?.name?.[0] ?? "T"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {t.user?.name}
                  </p>
                  {t.title && (
                    <p className="text-xs text-muted-foreground truncate">
                      {t.title}
                    </p>
                  )}
                  {t.category && (
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-0.5">
                      {t.category.name}
                    </span>
                  )}
                </div>
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-sm font-bold text-primary">
                  ${t.pricePerHour}
                  <span className="text-xs font-normal text-muted-foreground">
                    /hr
                  </span>
                </span>
                {t.avgRating != null && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full">
                    ⭐ {t.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-sm">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Browse Tutors",
              desc: "Search and filter expert tutors by subject, price, and availability.",
            },
            {
              step: "02",
              title: "Book a Session",
              desc: "Select a time slot that works for you and confirm your booking instantly.",
            },
            {
              step: "03",
              title: "Start Learning",
              desc: "Connect with your tutor and begin your personalised learning journey.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow space-y-3"
            >
              <span className="text-4xl font-extrabold text-primary/15 leading-none select-none">
                {item.step}
              </span>
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 my-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-violet-600 text-primary-foreground p-10 sm:p-14 text-center space-y-5">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold relative z-10">
            Ready to start learning?
          </h2>
          <p className="text-primary-foreground/75 text-sm relative z-10 max-w-md mx-auto">
            Join thousands of students already accelerating their skills with
            SkillBridge.
          </p>
          <Link
            href="/register"
            className="relative z-10 inline-block bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-95 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
