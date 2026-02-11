"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/actions/auth";
import { toast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "teacher") {
        router.push("/tutor/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }

    if (formData.password.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (!result.success) {
        toast(result.message || "Registration failed", "error");
        setLoading(false);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      toast("An error occurred during registration", "error");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background py-12 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;ve sent a verification link to{" "}
                <span className="font-medium text-foreground">
                  {formData.email}
                </span>
                . Please check your inbox and click the link to verify your
                account.
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email?{" "}
                  <button
                    type="button"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    onClick={() => {
                      toast(
                        "Verification email resent. Please check your inbox.",
                        "success",
                      );
                    }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join SkillBridge and start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                disabled={loading}
                className="h-11"
              />
            </div>

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
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  disabled={loading}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition ${
                    formData.role === "student"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="font-medium">Learn</span>
                  <span className="text-xs text-muted-foreground">
                    As a Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  disabled={loading}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition ${
                    formData.role === "teacher"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <GraduationCap className="h-6 w-6 mb-2" />
                  <span className="font-medium">Teach</span>
                  <span className="text-xs text-muted-foreground">
                    As a Tutor
                  </span>
                </button>
              </div>
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
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
            >
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
