"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginUser } from "@/actions/auth";
import { toast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "teacher") {
        router.push("/tutor/dashboard");
      } else {
        router.push(redirectUrl);
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        toast(result.message || "Login failed", "error");
        setLoading(false);
        return;
      }

      toast("Login successful!", "success");

      await refreshUser();

      localStorage.setItem("auth-sync", Date.now().toString());

      setTimeout(() => {
        if (result.data?.user?.role === "admin") {
          router.push("/admin");
        } else if (result.data?.user?.role === "teacher") {
          router.push("/tutor/dashboard");
        } else {
          router.push(redirectUrl);
        }
        router.refresh();
      }, 100);
    } catch (error) {
      toast("An error occurred during login", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Login to your SkillBridge account to continue learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
            >
              Create one for free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
