import { useWorkflowStore } from "@/features/workflow";
import { Save, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToastStore } from "@/components/ui/toast/toast.store";
import UserMenu from "@/components/ui/UserMenu";

export default function EditorHeaderActions({
  onSave,
  focusFirstIssue,
}: {
  onSave: () => void;
  focusFirstIssue: (issues: any[]) => void;
}) {
  const { t } = useTranslation();
  const validateWorkflowNow = useWorkflowStore((s) => s.validateWorkflowNow);
  const showToast = useToastStore();

  const onRunTest = () => {
    const { valid, issues } = validateWorkflowNow();

    if (!valid) {
      showToast.error(
        t("header.fixValidationErrors", { count: issues.length })
      );
      focusFirstIssue(issues);
      console.warn("WORKFLOW VALIDATION ISSUES", issues);
      return;
    }

    showToast.success("Run test (coming soon) — workflow is valid ✅");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-ui-border bg-ui-card px-3 py-1.5 text-sm hover:bg-ui-hover cursor-pointer"
        onClick={onSave}
      >
        <Save className="h-4 w-4" />
        {t("common.save")}
      </button>

      <button
        className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white cursor-pointer"
        onClick={onRunTest}
      >
        <Play className="h-4 w-4" />
        {t("editor.runTest")}
      </button>

      <UserMenu position="header" triggerClassName="ms-2" />
    </div>
  );
}
