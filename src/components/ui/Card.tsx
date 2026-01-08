import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-ui-border bg-ui-card",
        paddingStyles[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
