"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTutorProfile } from "@/actions/tutor";
import { toast } from "@/lib/toast";
import { TutorProfile, Category } from "@/types";

export default function TutorProfileForm({
  profile,
  categories,
}: {
  profile: TutorProfile | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_id: profile?.category_id || "",
    description: profile?.description || "",
    price_per_hour: profile?.price_per_hour || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await updateTutorProfile(formData);

    if (response.success) {
      toast("Profile updated successfully!", "success");
      router.push("/tutor/dashboard");
      router.refresh();
    } else {
      toast(response.message || "Failed to update profile", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Tutor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell students about yourself and your teaching experience..."
                />
              </div>

              <div>
                <Label htmlFor="price">Price per Hour ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  required
                  value={formData.price_per_hour}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_hour: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
