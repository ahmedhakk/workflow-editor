import { useTranslation } from "react-i18next";
import { useToastStore } from "@components/ui/toast/toast.store";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import type { ValidationIssue } from "@features/workflow/workflow.rules";
import ValidationBadge from "./ValidationBadge";
import ValidationIssuesList from "./ValidationIssuesList";

interface EmptyInspectorProps {
  issues: ValidationIssue[];
  issueCount: number;
  onIssueClick: (issue: ValidationIssue) => void;
}

export default function EmptyInspector({
  issues,
  issueCount,
  onIssueClick,
}: EmptyInspectorProps) {
  const { t } = useTranslation();
  const validateWorkflowNow = useWorkflowStore((s) => s.validateWorkflowNow);
  const clearValidation = useWorkflowStore((s) => s.clearValidation);

  const handleValidate = () => {
    const result = validateWorkflowNow();
    if (result.valid) {
      useToastStore.getState().success(t("toasts.noValidationIssues"));
    } else {
      useToastStore
        .getState()
        .error(t("toasts.foundIssues", { count: result.issues.length }));
    }
  };

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{t("canvas.inspector")}</div>
        <ValidationBadge count={issueCount} />
      </div>

      {/* Validation Panel */}
      <div className="mb-3 rounded-lg border border-ui-border bg-ui-card p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">{t("canvas.validation")}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleValidate}
              className="rounded-md border border-ui-border bg-ui-panel px-2 py-1 text-xs hover:bg-ui-hover"
            >
              {t("canvas.run")}
            </button>

            {issueCount > 0 && (
              <button
                onClick={() => clearValidation()}
                className="rounded-md border border-ui-border bg-ui-panel px-2 py-1 text-xs hover:bg-ui-hover"
              >
                {t("canvas.clear")}
              </button>
            )}
          </div>
        </div>

        {issueCount === 0 ? (
          <div className="mt-2 text-sm text-ui-muted">
            {t("canvas.noIssues")}
          </div>
        ) : (
          <div className="mt-2">
            <ValidationIssuesList
              issues={issues}
              onIssueClick={onIssueClick}
              maxVisible={8}
            />
          </div>
        )}
      </div>

      <div className="text-sm text-ui-muted">
        {t("canvas.selectNodeOrConnection")}
      </div>

      <div className="mt-4 rounded-lg border border-ui-border bg-ui-card p-3 text-sm text-ui-text2">
        {t("canvas.tipClickNode")}
      </div>
    </div>
  );
}
