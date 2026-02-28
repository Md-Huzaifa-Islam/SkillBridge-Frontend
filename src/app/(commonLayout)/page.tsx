import { apiGetTutors, apiGetCategories } from "@/lib/api";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const revalidate = 60;

// ─── Static data ───────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: "🎯",
    title: "Verified Experts",
    desc: "Every tutor on SkillBridge goes through a thorough verification process so you learn from real professionals.",
  },
  {
    icon: "📅",
    title: "Flexible Scheduling",
    desc: "Book sessions at any time that fits your calendar — mornings, evenings, or weekends.",
  },
  {
    icon: "💬",
    title: "Personalised Learning",
    desc: "Tutors tailor every lesson to your pace, goals, and learning style for maximum impact.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "All transactions are encrypted and protected. Pay with confidence, refund if unsatisfied.",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse & Filter",
    desc: "Search tutors by subject, price range, rating, and availability. Read profiles, credentials & reviews.",
  },
  {
    step: "02",
    icon: "📆",
    title: "Book a Session",
    desc: "Pick a convenient time slot, confirm your booking instantly, and receive a confirmation email.",
  },
  {
    step: "03",
    icon: "🚀",
    title: "Learn & Grow",
    desc: "Join your tutor online, learn at your own pace, and track your progress session after session.",
  },
];

const CATEGORY_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
  "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
];

// ─── Page ──────────────────────────────────────────────────────────────────────

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
      {/* ─── SECTION 1 · HERO ──────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative py-24 sm:py-32 text-center overflow-hidden"
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-150 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>

        <div className="space-y-7 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by thousands of learners worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Connect with Expert Tutors,
            <br />
            <span className="bg-linear-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Learn Anything
            </span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            SkillBridge connects ambitious learners with verified expert tutors.
            Browse real profiles, check live availability, and book sessions
            instantly.
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

        {/* Stats strip */}
        <div className="mt-16 flex flex-wrap gap-10 justify-center">
          {[
            { value: "500+", label: "Expert Tutors" },
            { value: "1,200+", label: "Sessions Booked" },
            { value: "50+", label: "Subjects Covered" },
            { value: "4.8 ★", label: "Average Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center space-y-0.5">
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 2 · BROWSE CATEGORIES ────────────────────────────────────── */}
      <section id="categories" className="py-16">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            What do you want to learn?
          </p>
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            From maths and sciences to arts and languages — find expert tutors
            in any subject.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/tutors?category=${c.id}`}
                className={`border px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        ) : (
          /* Static fallback when API is unavailable */
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "English",
              "History",
              "Computer Science",
              "Economics",
              "French",
              "Spanish",
              "Music",
              "Art & Design",
            ].map((subject, i) => (
              <Link
                key={subject}
                href={`/tutors?search=${encodeURIComponent(subject)}`}
                className={`border px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
              >
                {subject}
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/tutors"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all tutors →
          </Link>
        </div>
      </section>

      {/* ─── SECTION 3 · FEATURED TUTORS ───────────────────────────────────────── */}
      <section id="featured-tutors" className="py-16">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Top rated
            </p>
            <h2 className="text-3xl font-bold">Featured Tutors</h2>
            <p className="text-muted-foreground text-sm">
              Hand-picked educators with outstanding student reviews.
            </p>
          </div>
          <Link
            href="/tutors"
            className="text-sm font-medium text-primary hover:underline hidden sm:flex items-center gap-1 shrink-0"
          >
            View all tutors →
          </Link>
        </div>

        {featuredTutors.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTutors.map((t) => (
              <Link
                key={t.id}
                href={`/tutors/${t.id}`}
                className="group border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/8 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-lg font-bold uppercase text-primary ring-2 ring-primary/10 shrink-0">
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
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
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
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">👩‍🏫</p>
            <p className="font-medium">Tutors loading…</p>
            <p className="text-sm mt-1">
              <Link href="/tutors" className="text-primary hover:underline">
                Browse all tutors
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        )}
      </section>

      {/* ─── SECTION 4 · HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-16 rounded-3xl bg-muted/30 border border-border/40 px-6 sm:px-10 my-4"
      >
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Simple process
          </p>
          <h2 className="text-3xl font-bold">How SkillBridge Works</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Get started in three easy steps and be learning within minutes.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {HOW_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center text-center border rounded-2xl p-7 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 space-y-3"
            >
              {/* Connector line (desktop) */}
              {idx < HOW_STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-10 -right-3 w-6 h-px bg-border z-10" />
              )}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/40">
                Step {item.step}
              </span>
              <h3 className="font-bold text-base">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Why choose us — 4 feature cards inside this section */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((w) => (
            <div
              key={w.title}
              className="flex flex-col gap-2 border rounded-xl p-5 bg-background hover:shadow-sm hover:border-primary/20 transition-all duration-200"
            >
              <span className="text-2xl">{w.icon}</span>
              <p className="font-semibold text-sm">{w.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-6 my-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary/90 to-violet-600 text-primary-foreground p-10 sm:p-14 text-center space-y-5">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          </div>
          <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/60">
            Join SkillBridge today
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold relative z-10">
            Ready to start learning?
          </h2>
          <p className="text-primary-foreground/75 text-sm relative z-10 max-w-md mx-auto">
            Join thousands of students already accelerating their skills. Sign
            up free — no credit card required.
          </p>
          <div className="relative z-10 flex gap-3 justify-center flex-wrap">
            <Link
              href="/register"
              className="inline-block bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-95 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              href="/tutors"
              className="inline-block border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-200"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
