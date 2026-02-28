import { apiGetTutors, apiGetCategories } from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{
    /** Text search — matches tutor title / description */
    search?: string;
    /** Category ID filter */
    category?: string;
  }>;
};

export default async function TutorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);

  const [tutorsResult, categoriesResult] = await Promise.allSettled([
    apiGetTutors(query.toString(), 60),
    apiGetCategories(),
  ]);

  const tutors =
    tutorsResult.status === "fulfilled"
      ? (tutorsResult.value.data?.data ?? [])
      : [];
  const categories =
    categoriesResult.status === "fulfilled" &&
    Array.isArray(categoriesResult.value.data)
      ? categoriesResult.value.data
      : [];

  return (
    <div className="pt-20 space-y-6 pb-12">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Browse Tutors
        </h1>
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">{tutors.length}</span>{" "}
          tutor{tutors.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row items-start">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-60 shrink-0">
          <FilterPanel
            categories={categories}
            current={{ search: params.search, category: params.category }}
          />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {tutors.length === 0 ? (
            <div className="border rounded-2xl py-20 text-center space-y-3">
              <p className="text-4xl">🔍</p>
              <p className="font-semibold">No tutors found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tutors.map((t) => {
                const initial = t.user?.name?.[0]?.toUpperCase() ?? "T";
                return (
                  <Link
                    key={t.id}
                    href={`/tutors/${t.id}`}
                    className="group border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/8 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center font-bold uppercase text-primary ring-2 ring-primary/10 shrink-0 text-base">
                        {initial}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  categories,
  current,
}: {
  categories: { id: string; name: string }[];
  current: { search?: string; category?: string };
}) {
  return (
    <div className="border rounded-2xl p-5 space-y-5 bg-card shadow-sm">
      <h3 className="font-bold text-sm tracking-wide uppercase text-muted-foreground">
        Filters
      </h3>

      <form method="GET" className="space-y-4">
        {/* Text search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Search
          </label>
          <input
            name="search"
            defaultValue={current.search ?? ""}
            placeholder="e.g. Math, Physics…"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Category
          </label>
          <select
            name="category"
            defaultValue={current.category ?? ""}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition shadow-sm shadow-primary/20"
        >
          Apply Filters
        </button>

        {(current.search || current.category) && (
          <Link
            href="/tutors"
            className="block text-center text-xs text-muted-foreground hover:text-foreground hover:underline transition"
          >
            ✕ Clear all filters
          </Link>
        )}
      </form>
    </div>
  );
}
