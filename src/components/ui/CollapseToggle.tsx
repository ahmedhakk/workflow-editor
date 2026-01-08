import { useLanguage } from "@hooks";

interface CollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  position?: "left" | "right";
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
}

export default function CollapseToggle({
  isCollapsed,
  onToggle,
  position = "left",
  expandLabel = "Expand",
  collapseLabel = "Collapse",
  className = "",
}: CollapseToggleProps) {
  const { isArabic, dir } = useLanguage();

  // Determine position classes based on sidebar position
  const positionClasses =
    position === "left"
      ? dir === "rtl"
        ? "-left-3"
        : "-right-3"
      : dir === "rtl"
        ? "-right-3"
        : "-left-3";

  // Determine chevron direction based on collapse state, position, and RTL
  const getChevronPath = () => {
    if (position === "left") {
      // Left sidebar: collapsed = arrow right (expand), expanded = arrow left (collapse)
      if (isCollapsed) {
        return isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
      }
      return isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";
    } else {
      // Right sidebar: collapsed = arrow left (expand), expanded = arrow right (collapse)
      if (isCollapsed) {
        return isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";
      }
      return isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
    }
  };

  return (
    <button
      onClick={onToggle}
      className={[
        "absolute top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center",
        "rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg",
        "hover:bg-ui-hover hover:text-ui-text transition-colors",
        positionClasses,
        className,
      ].join(" ")}
      title={isCollapsed ? expandLabel : collapseLabel}
      aria-label={isCollapsed ? expandLabel : collapseLabel}
      aria-expanded={!isCollapsed}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={getChevronPath()}
        />
      </svg>
    </button>
  );
}
