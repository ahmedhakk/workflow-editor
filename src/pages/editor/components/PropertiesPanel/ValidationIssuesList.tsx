import { useTranslation } from "react-i18next";
import type { ValidationIssue } from "@features/workflow/workflow.rules";
import { hintFor } from "./utils";

interface ValidationIssuesListProps {
  issues: ValidationIssue[];
  onIssueClick?: (issue: ValidationIssue) => void;
  maxVisible?: number;
}

export default function ValidationIssuesList({
  issues,
  onIssueClick,
  maxVisible = 8,
}: ValidationIssuesListProps) {
  const { t } = useTranslation();

  if (issues.length === 0) return null;

  const visibleIssues = issues.slice(0, maxVisible);
  const remainingCount = issues.length - maxVisible;

  return (
    <div className="space-y-2">
      {visibleIssues.map((issue, idx) => {
        const message = t(issue.messageKey, issue.messageParams);
        const hint = hintFor(issue.messageKey, t);

        return (
          <button
            key={`${issue.target}-${issue.id ?? "wf"}-${idx}`}
            onClick={() => onIssueClick?.(issue)}
            className="w-full rounded-md border border-red-500/25 bg-red-500/5 p-2 text-left hover:bg-red-500/10"
            title={hint ? `Tip: ${hint}` : ""}
          >
            <div className="text-xs text-red-200 text-left rtl:text-right">
              {message}
            </div>
            {hint && (
              <div className="mt-1 text-[11px] text-red-200/70 text-left rtl:text-right">
                {hint}
              </div>
            )}
          </button>
        );
      })}

      {remainingCount > 0 && (
        <div className="text-xs text-ui-muted">
          {t("canvas.moreIssues", { count: remainingCount })}
        </div>
      )}
    </div>
  );
}
