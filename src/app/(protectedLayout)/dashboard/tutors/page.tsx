import { apiGetTutors, apiGetCategories } from "@/lib/api";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

export default async function BrowseTutorsPage({ searchParams }: PageProps) {
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
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Browse Tutors"
        description={`${tutors.length} tutor${tutors.length !== 1 ? "s" : ""} available to book.`}
        icon="🔍"
      />

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <FilterPanel
            categories={categories}
            current={{ search: params.search, category: params.category }}
          />
        </aside>

        {/* Results */}
        <div className="flex-1">
          {tutors.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No tutors found"
              description="Try adjusting your search filters."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tutors.map((t) => (
                <Link
                  key={t.id}
                  href={`/dashboard/tutors/${t.id}`}
                  className="group border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 bg-card space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center font-bold uppercase text-primary text-base shrink-0">
                      {t.user?.name?.[0] ?? "T"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {t.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {t.title}
                      </p>
                    </div>
                  </div>
                  {t.category && (
                    <span className="inline-flex text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">
                      {t.category.name}
                    </span>
                  )}
                  {t.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                    <span className="font-bold text-primary">
                      ${t.pricePerHour}/hr
                    </span>
                    {t.avgRating != null && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-amber-400">★</span>
                        {t.avgRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
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
    <div className="border rounded-2xl p-4 space-y-4 bg-card">
      <h3 className="font-semibold text-sm">Filters</h3>

      <form method="GET" className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Search
          </label>
          <input
            name="search"
            defaultValue={current.search ?? ""}
            placeholder="e.g. Math, Physics…"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </label>
          <select
            name="category"
            defaultValue={current.category ?? ""}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none"
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
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm hover:opacity-90 transition"
        >
          Apply
        </button>

        {(current.search || current.category) && (
          <Link
            href="/dashboard/tutors"
            className="block text-center text-xs text-muted-foreground hover:underline"
          >
            Clear filters
          </Link>
        )}
      </form>
    </div>
  );
}
