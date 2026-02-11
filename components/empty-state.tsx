export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-2xl font-semibold text-muted-foreground mb-2">{title}</p>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action}
    </div>
  );
}
