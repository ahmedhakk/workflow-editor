import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        "w-full rounded-md border bg-ui-card px-3 py-2 text-sm text-ui-text",
        "placeholder:text-ui-muted",
        "focus:outline-none focus:ring-2",
        error
          ? "border-red-500/50 focus:ring-red-500/30"
          : "border-ui-border focus:ring-ui-border-soft",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
