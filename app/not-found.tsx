import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="max-w-md">
        <CardContent className="p-12 text-center">
          <h1 className="text-6xl font-bold text-muted-foreground/50 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
