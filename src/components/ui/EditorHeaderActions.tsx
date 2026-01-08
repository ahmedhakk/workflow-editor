import { useWorkflowStore } from "@/features/workflow";
import { Save, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToastStore } from "@/components/ui/toast/toast.store";
import { UserMenu, Button } from "@/components/ui";

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
      <Button
        variant="secondary"
        onClick={onSave}
        icon={<Save className="h-4 w-4" />}
      >
        {t("common.save")}
      </Button>

      <Button
        variant="primary"
        onClick={onRunTest}
        icon={<Play className="h-4 w-4" />}
      >
        {t("editor.runTest")}
      </Button>

      <UserMenu position="header" triggerClassName="ms-2" />
    </div>
  );
}
