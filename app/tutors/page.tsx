import { getTutors } from "@/actions/tutors";
import { getCategories } from "@/actions/categories";
import { TutorCard } from "@/components/tutor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "1");
  const filters = {
    search: searchParams.search,
    category: searchParams.category,
    minPrice: searchParams.minPrice
      ? parseFloat(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseFloat(searchParams.maxPrice)
      : undefined,
    page,
    limit: 12,
  };

  const [tutorsResponse, categoriesResponse] = await Promise.all([
    getTutors(filters),
    getCategories(),
  ]);

  const tutorsData =
    tutorsResponse.success && tutorsResponse.data
      ? tutorsResponse.data
      : {
          data: [],
          pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
        };

  const categories = categoriesResponse.success
    ? categoriesResponse.data || []
    : [];

  const buildUrl = (params: Record<string, string | undefined>) => {
    const url = new URLSearchParams();
    Object.entries({ ...searchParams, ...params }).forEach(([key, value]) => {
      if (value) url.set(key, value);
    });
    return `/tutors?${url.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Tutor</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form action="/tutors" method="get" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="search"
                    placeholder="Search tutors..."
                    className="pl-10"
                    defaultValue={searchParams.search}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  defaultValue={searchParams.category || ""}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Price
                </label>
                <Input
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  defaultValue={searchParams.minPrice}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Price
                </label>
                <Input
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  defaultValue={searchParams.maxPrice}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/tutors">Clear Filters</Link>
              </Button>
            </div>
          </form>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Found {tutorsData.pagination.total} tutor
            {tutorsData.pagination.total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tutorsData.data.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>

        {tutorsData.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tutors found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {tutorsData.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={buildUrl({ page: (page - 1).toString() })}>
                  Previous
                </Link>
              </Button>
            )}

            {Array.from(
              { length: tutorsData.pagination.totalPages },
              (_, i) => i + 1,
            ).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                asChild
              >
                <Link href={buildUrl({ page: p.toString() })}>{p}</Link>
              </Button>
            ))}

            {page < tutorsData.pagination.totalPages && (
              <Button variant="outline" asChild>
                <Link href={buildUrl({ page: (page + 1).toString() })}>
                  Next
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
