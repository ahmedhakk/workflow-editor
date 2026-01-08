import React from "react";

interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export default function Pill({ children, className = "" }: PillProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border border-ui-border bg-ui-card px-2 py-0.5 text-xs text-ui-text2",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
