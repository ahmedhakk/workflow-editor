import React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "red";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-ui-border bg-ui-card text-ui-text2",
  success: "border-green-500/30 bg-green-500/10 text-green-200",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-200",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  green: "border-green-500/30 bg-green-500/10 text-green-200",
  orange: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  red: "border-red-500/30 bg-red-500/10 text-red-200",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-[11px]",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
