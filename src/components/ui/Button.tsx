import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-zinc-100 text-zinc-900 hover:bg-white font-medium",
  secondary:
    "border border-ui-border bg-ui-card hover:bg-ui-hover text-ui-text",
  ghost: "hover:bg-ui-hover text-ui-text",
  danger:
    "border border-red-900/40 bg-red-950/40 text-red-200 hover:bg-red-950/60 focus:ring-2 focus:ring-red-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-xs gap-1.5",
  md: "px-3 py-1.5 text-sm gap-2",
  lg: "px-4 py-2 text-sm gap-2",
};

export default function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconPosition = "start",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-md cursor-pointer transition-colors",
        "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "start" && icon}
      {children}
      {icon && iconPosition === "end" && icon}
    </button>
  );
}
