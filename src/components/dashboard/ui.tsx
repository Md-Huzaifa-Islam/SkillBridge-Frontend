import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
  badge?: string;
}

export function PageHeader({
  title,
  description,
  action,
  icon,
  badge,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-violet-500/5 px-6 py-6 mb-6">
      {/* Ambient blobs */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 left-10 w-32 h-32 rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0 border border-primary/10">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {title}
              </h1>
              {badge && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export type StatColor =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "amber";

const COLOR_MAP: Record<StatColor, string> = {
  blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  green:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  purple:
    "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900",
  red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  orange:
    "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  amber:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
};

const VALUE_COLOR: Record<StatColor, string> = {
  blue: "text-blue-700 dark:text-blue-300",
  green: "text-emerald-700 dark:text-emerald-300",
  purple: "text-violet-700 dark:text-violet-300",
  red: "text-red-700 dark:text-red-300",
  orange: "text-orange-700 dark:text-orange-300",
  amber: "text-amber-700 dark:text-amber-300",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: StatColor;
  href?: string;
  sub?: string;
}

export function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div className="relative overflow-hidden border rounded-2xl p-5 bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-30 blur-2xl pointer-events-none bg-primary/10" />
      <div className="flex items-start justify-between gap-3">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl border ${COLOR_MAP[color]}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p
          className={`text-3xl font-extrabold tracking-tight ${VALUE_COLOR[color]}`}
        >
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
          {label}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed rounded-2xl py-14 text-center space-y-3 bg-muted/10">
      <p className="text-4xl">{icon}</p>
      <p className="font-semibold text-base">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {description}
        </p>
      )}
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

export function SectionTitle({
  children,
  badge,
  action,
}: {
  children: React.ReactNode;
  badge?: number | string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-base tracking-tight">{children}</h2>
        {badge !== undefined && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    completed:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    banned: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    student: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    tutor:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    admin:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  };
  return (
    <span
      className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
