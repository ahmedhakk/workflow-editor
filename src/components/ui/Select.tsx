import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export default function Select({
  error,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={[
        "w-full rounded-md border bg-ui-card px-3 py-2 text-sm text-ui-text",
        "focus:outline-none focus:ring-2",
        "cursor-pointer",
        error
          ? "border-red-500/50 focus:ring-red-500/30"
          : "border-ui-border focus:ring-ui-border-soft",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
