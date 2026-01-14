import { useLanguage } from "@hooks";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  position: "left" | "right";
  expandLabel?: string;
  collapseLabel?: string;
}

export default function SidebarToggle({
  isCollapsed,
  onToggle,
  position,
  expandLabel = "Expand",
  collapseLabel = "Collapse",
}: SidebarToggleProps) {
  const { isArabic, dir } = useLanguage();

  // Position class based on sidebar position
  const positionClass =
    position === "left"
      ? dir === "rtl"
        ? "-left-3.5"
        : "-right-3"
      : dir === "rtl"
        ? "-right-3"
        : "-left-3";

  // Get chevron path based on collapse state, position, and RTL
  const getChevronPath = () => {
    if (position === "left") {
      if (isCollapsed) {
        return isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
      }
      return isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";
    } else {
      if (isCollapsed) {
        return isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";
      }
      return isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
    }
  };

  return (
    <button
      onClick={onToggle}
      className={`absolute ${positionClass} top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg hover:bg-ui-hover hover:text-ui-text`}
      title={isCollapsed ? expandLabel : collapseLabel}
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
