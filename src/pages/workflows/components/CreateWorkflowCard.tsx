import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateWorkflowCardProps {
  onCreate: () => void;
}

export default function CreateWorkflowCard({
  onCreate,
}: CreateWorkflowCardProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onCreate}
      className="group aspect-16/10 rounded-xl border border-dashed border-ui-border bg-ui-card/30 hover:bg-ui-card/50 transition overflow-hidden cursor-pointer"
    >
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-ui-muted group-hover:text-ui-text">
          <div className="h-10 w-10 rounded-xl border border-ui-border bg-ui-card flex items-center justify-center">
            <Plus className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium">
            {t("workflows.createNewWorkflow")}
          </div>
          <div className="text-xs text-ui-muted">
            {t("workflows.draftInLocalStorage")}
          </div>
        </div>
      </div>
    </button>
  );
}
