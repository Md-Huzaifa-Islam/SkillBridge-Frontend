import { getCategories } from "@/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCategoryForm } from "@/components/admin/create-category-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const response = await getCategories();
  const categories = response.success ? response.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Category Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CreateCategoryForm />

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No categories yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
