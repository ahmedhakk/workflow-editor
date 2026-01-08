import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useToastStore } from "@/components/ui/toast/toast.store";
import EditorHeaderActions from "@/components/ui/EditorHeaderActions";
import { upsertWorkflow } from "@/services/workflows.local";
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks";

// Reusable header:
// - If you pass props (title/subtitle/rightActions) => renders those
// - If you pass nothing => behaves like the current editor header (Save / Run test / User)
type HeaderProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  rightActions?: ReactNode;
  className?: string;
};

export default function Header({
  title,
  subtitle,
  rightActions,
  className = "",
}: HeaderProps) {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const validateWorkflowNow = useWorkflowStore((s) => s.validateWorkflowNow);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);

  const showToast = useToastStore();

  const hasCustomContent =
    title !== undefined || subtitle !== undefined || rightActions !== undefined;

  const isEditorHeader = !hasCustomContent;

  const focusFirstIssue = (issues: any[]) => {
    const first = issues[0];
    if (!first) return;

    if (first.target === "node" && first.id) {
      selectEdge(null);
      selectNode(first.id);
    } else if (first.target === "edge" && first.id) {
      selectNode(null);
      selectEdge(first.id);
    }
  };

  const onSave = async () => {
    // TODO: integrate with backend
    if (!isEditorHeader) return;

    const { valid, issues } = validateWorkflowNow();

    if (!valid) {
      showToast.error(
        t("header.fixValidationErrors", { count: issues.length })
      );
      focusFirstIssue(issues);
      console.warn("WORKFLOW VALIDATION ISSUES", issues);
      return;
    }

    // 1️⃣ Export current editor state
    const payload = exportWorkflow();
    console.log("WORKFLOW JSON", payload);

    // 2️⃣ Save workflow immediately (FAST, SYNC)
    upsertWorkflow(payload);

    // 3️⃣ Add Copy to clipboard (JSON)
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

    showToast.success(t("header.savedToClipboard"));
  };

  // Defaults (editor)
  const resolvedTitle = title ?? t("header.workflows");
  const resolvedSubtitle = subtitle ?? t("header.draftNotPublished");
  const resolvedRightActions = rightActions ?? (
    <EditorHeaderActions onSave={onSave} focusFirstIssue={focusFirstIssue} />
  );

  return (
    <header
      className={["h-14 border-b border-ui-border bg-ui-panel", className].join(
        " "
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex h-full items-center gap-3">
          <Link to="/workflows">
            <img
              src="https://dreams.com.sa/site/images/logo-white.png"
              className="w-auto h-6 cursor-pointer"
              alt="Dreams Logo"
            />
          </Link>

          <div
            className={`flex flex-col border-ui-text2 justify-center leading-tight ${dir === "rtl" ? "border-r pr-3" : "border-l pl-3"}`}
          >
            <div className="text-sm font-semibold">{resolvedTitle}</div>
            <div className="text-xs text-ui-muted">{resolvedSubtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">{resolvedRightActions}</div>
      </div>
    </header>
  );
}
