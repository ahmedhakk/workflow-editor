import React from "react";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export default function FieldLabel({
  children,
  htmlFor,
  required,
  className = "",
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        "mb-1 block text-xs font-medium text-ui-text2",
        className,
      ].join(" ")}
    >
      {children}
      {required && <span className="text-red-400 ms-0.5">*</span>}
    </label>
  );
}
