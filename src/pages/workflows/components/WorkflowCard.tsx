import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@components/ui";
import { WorkflowThumbnail } from "@pages/workflows/components";
import { useLanguage } from "@hooks";
import { useTranslation } from "react-i18next";
import type { WorkflowListItem } from "@/services/workflows.local";
import type { WorkflowPayload } from "@features/workflow/workflow.serializer";

interface WorkflowCardProps {
  workflow: WorkflowListItem;
  workflowDoc?: WorkflowPayload;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export default function WorkflowCard({
  workflow,
  workflowDoc,
  isSelected,
  onSelect,
  onOpen,
}: WorkflowCardProps) {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  return (
    <button
      onClick={onSelect}
      onDoubleClick={onOpen}
      className={[
        "group relative aspect-16/10 rounded-xl border overflow-hidden text-left transition cursor-pointer",
        isSelected
          ? "border-white/25 bg-ui-card"
          : "border-ui-border bg-ui-card/70 hover:bg-ui-card",
      ].join(" ")}
    >
      {/* Workflow Thumbnail */}
      <div className="absolute inset-0">
        {workflowDoc && (
          <WorkflowThumbnail
            workflow={workflowDoc}
            className="opacity-60 group-hover:opacity-80 transition-opacity"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-white/0" />

      {/* Status badge */}
      <div className="absolute top-3 left-3">
        <Badge
          variant={workflow.status === "published" ? "success" : "default"}
        >
          {workflow.status}
        </Badge>
      </div>

      {/* Meta info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/55 to-transparent">
        <div className="text-sm font-semibold line-clamp-1">
          {workflow.name}
        </div>
        <div className="mt-1 text-xs text-ui-muted">
          Updated {new Date(workflow.updatedAt).toLocaleString()}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[11px] text-ui-muted">v{workflow.version}</div>
          <div className="text-[11px] text-ui-muted group-hover:text-ui-text flex items-center gap-1">
            {t("common.open")}
            {isArabic ? (
              <ArrowLeft className="h-3 w-3" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
