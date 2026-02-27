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
      <div className="w-full max-w-sm space-y-3 text-center">
        <div className="text-4xl">✉️</div>
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ve sent a verification link to your email. Please verify to
          activate your account.
        </p>
        <p className="text-xs text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Join SkillBridge today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
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
              <span className="w-full text-center text-sm font-medium py-1.5 rounded-md peer-checked:bg-background peer-checked:shadow transition">
                {r === UserRoles.student ? "Student" : "Tutor"}
              </span>
            </label>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>
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
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
