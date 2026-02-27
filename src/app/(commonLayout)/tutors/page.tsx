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
    tutorsResult.status === "fulfilled" ? tutorsResult.value.data : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];

  return (
    <div className="pt-20 space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Browse Tutors</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <FilterPanel
            categories={categories}
            current={{ search: params.search, category: params.category }}
          />
        </aside>

        {/* Results */}
        <div className="flex-1">
          {tutors.length === 0 ? (
            <div className="border rounded-xl py-16 text-center text-muted-foreground">
              No tutors found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tutors.map((t) => (
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
                      <p className="text-xs text-muted-foreground">{t.title}</p>
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
    <div className="border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-sm">Filters</h3>

      <form method="GET" className="space-y-3">
        {/* Text search */}
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

        {/* Category */}
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
            href="/tutors"
            className="block text-center text-xs text-muted-foreground hover:underline"
          >
            Clear filters
          </Link>
        )}
      </form>
    </div>
  );
}
