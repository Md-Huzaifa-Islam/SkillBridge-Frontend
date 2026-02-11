"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReview } from "@/actions/reviews";
import { toast } from "@/lib/toast";
import { Star } from "lucide-react";

export default function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast("Please select a rating", "error");
      return;
    }

    setLoading(true);
    const response = await createReview({
      booking_id: bookingId,
      rating,
      review: review || undefined,
    });

    if (response.success) {
      toast("Review submitted successfully!", "success");
      router.push("/dashboard/bookings");
    } else {
      toast(response.message || "Failed to submit review", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-10 w-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review">Review (Optional)</Label>
                <Textarea
                  id="review"
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this tutor..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
