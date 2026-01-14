import { Copy, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@components/ui";
import type { WorkflowListItem } from "@/services/workflows.local";

interface OverviewTabProps {
  workflow: WorkflowListItem;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function OverviewTab({
  workflow,
  onDuplicate,
  onDelete,
}: OverviewTabProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-3">
      {/* Workflow ID */}
      <Card>
        <div className="text-xs text-ui-muted">{t("workflows.workflowId")}</div>
        <div className="mt-1 font-mono text-xs">{workflow.id}</div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onDuplicate}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border cursor-pointer border-ui-border bg-ui-card px-3 py-2 text-sm hover:bg-ui-hover"
        >
          <Copy className="h-4 w-4" />
          {t("common.duplicate")}
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-md border cursor-pointer border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15"
        >
          <Trash2 className="h-4 w-4" />
          {t("common.delete")}
        </button>
      </div>
    </div>
  );
}
