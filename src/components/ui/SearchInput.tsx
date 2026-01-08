import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  containerClassName?: string;
}

export default function SearchInput({
  containerClassName = "",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={["relative", containerClassName].join(" ")}>
      <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ui-muted pointer-events-none" />
      <input
        type="text"
        className={[
          "w-full rounded-md border border-ui-border bg-ui-card",
          "ps-9 pe-3 py-2 text-sm text-ui-text",
          "placeholder:text-ui-muted",
          "outline-none focus:ring-2 focus:ring-white/10",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
