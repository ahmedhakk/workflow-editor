import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
  label: string; // Required for accessibility
}

const sizeStyles = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

const variantStyles = {
  default: "border border-ui-border bg-ui-card hover:bg-ui-hover",
  ghost: "hover:bg-ui-hover",
};

export default function IconButton({
  icon,
  size = "md",
  variant = "default",
  label,
  className = "",
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={[
        "flex items-center justify-center rounded-md cursor-pointer transition-colors",
        "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        sizeStyles[size],
        variantStyles[variant],
        className,
      ].join(" ")}
      aria-label={label}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}
