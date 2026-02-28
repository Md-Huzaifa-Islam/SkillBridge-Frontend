"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/action/authActions";
import { UserRoles } from "@/constants/roles";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
    role: z.enum([UserRoles.student, UserRoles.tutor]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: UserRoles.student },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    try {
      const { name, email, password, role } = data;
      await registerAction({ name, email, password, role });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Registration failed");
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-4 text-center py-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          ✉️
        </div>
        <h2 className="text-xl font-bold tracking-tight">Check your email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We&apos;ve sent a verification link to your email. Please verify to
          activate your account.
        </p>
        <p className="text-xs text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground text-sm">Join SkillBridge today — it&apos;s free</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selection */}
        <div className="space-y-1.5">
          <p className="text-sm font-semibold">I want to</p>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            {([UserRoles.student, UserRoles.tutor] as const).map((r) => (
              <label
                key={r}
                className="flex items-center justify-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={r}
                  {...register("role")}
                  className="sr-only peer"
                />
                <span className="w-full text-center text-sm font-semibold py-2 rounded-lg peer-checked:bg-background peer-checked:shadow-sm peer-checked:text-primary transition-all">
                  {r === UserRoles.student ? "🎓 Learn" : "📚 Teach"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </label>
          <Input id="name" type="text" placeholder="Jane Smith" className="h-11" {...register("name")} />
          {errors.name && (
            <p className="text-destructive text-xs flex items-center gap-1"><span>⚠</span> {errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold">
            Email address
          </label>
          <Input id="email" type="email" placeholder="you@example.com" className="h-11" {...register("email")} />
          {errors.email && (
            <p className="text-destructive text-xs flex items-center gap-1"><span>⚠</span> {errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <Input id="password" type="password" placeholder="Min. 8 characters" className="h-11" {...register("password")} />
          {errors.password && (
            <p className="text-destructive text-xs flex items-center gap-1"><span>⚠</span> {errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-semibold">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-11"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span>⚠</span> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-destructive text-sm text-center">{serverError}</p>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold shadow-sm shadow-primary/20">
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      <p className="text-center text-sm">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in instead →
        </Link>
      </p>
    </div>
  );
}
