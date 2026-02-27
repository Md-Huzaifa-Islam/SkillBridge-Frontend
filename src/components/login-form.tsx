"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/action/authActions";
import { UserRoles } from "@/constants/roles";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const { role } = await loginAction(data);
      if (role === UserRoles.admin) router.push("/admin-dashboard");
      else if (role === UserRoles.tutor) router.push("/tutor-dashboard");
      else router.push("/dashboard");
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your SkillBridge account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
