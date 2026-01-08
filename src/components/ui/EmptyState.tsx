import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center p-8",
        className,
      ].join(" ")}
    >
      {icon && (
        <div className="h-12 w-12 rounded-xl border border-ui-border bg-ui-card flex items-center justify-center text-ui-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-ui-text">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-ui-muted max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
