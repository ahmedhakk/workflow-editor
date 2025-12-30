import type { ReactNode } from "react";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useToastStore } from "@/components/ui/toast/toast.store";
import EditorHeaderActions from "@/components/ui/EditorHeaderActions";

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
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const showToast = useToastStore((s) => s.success);

  const hasCustomContent =
    title !== undefined || subtitle !== undefined || rightActions !== undefined;

  const isEditorHeader = !hasCustomContent;

  const onSave = async () => {
    // TODO: integrate with backend

    if (!isEditorHeader) return;

    const payload = exportWorkflow();
    console.log("WORKFLOW JSON", payload);

    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

    showToast("Saved! JSON copied to clipboard");
  };

  // Defaults (editor)
  const resolvedTitle = title ?? "Workflows";
  const resolvedSubtitle = subtitle ?? "Draft • Not published";
  const resolvedRightActions = rightActions ?? (
    <EditorHeaderActions onSave={onSave} />
  );

  return (
    <header
      className={["h-14 border-b border-ui-border bg-ui-panel", className].join(
        " "
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex h-full items-center gap-3">
          <img
            src="https://dreams.com.sa/site/images/logo-white.png"
            className="w-auto h-6"
            alt="Dreams Logo"
          />

          <div className="flex flex-col border-l border-ui-text2 pl-3 justify-center leading-tight">
            <div className="text-sm font-semibold">{resolvedTitle}</div>
            <div className="text-xs text-ui-muted">{resolvedSubtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">{resolvedRightActions}</div>
      </div>
    </header>
  );
}
