"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex gap-2 w-full sm:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 sm:w-56 h-9 rounded-lg border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
      />
      <button
        type="submit"
        className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
