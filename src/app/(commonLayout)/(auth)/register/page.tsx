import SignupForm from "@/components/signup-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      {/* Card wrapper */}
      <div className="w-full max-w-md">
        {/* Logo + branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <span className="text-primary-foreground font-bold text-base">
                S
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              SkillBridge
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your free account and start learning
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border bg-card shadow-xl shadow-black/5 p-8">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By registering, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> &amp;{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </main>
  );
}
