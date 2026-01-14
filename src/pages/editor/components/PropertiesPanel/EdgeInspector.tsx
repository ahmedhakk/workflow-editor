import { useTranslation } from "react-i18next";
import type { Edge, Node } from "reactflow";
import { FieldLabel, Pill } from "@components/ui";
import { useToastStore } from "@components/ui/toast/toast.store";
import type { ValidationIssue } from "@features/workflow/workflow.rules";
import ValidationBadge from "./ValidationBadge";
import { hintFor } from "./utils";

interface EdgeInspectorProps {
  edge: Edge;
  sourceNode: Node | null;
  targetNode: Node | null;
  issues: ValidationIssue[];
  issueCount: number;
  onDelete: () => void;
}

export default function EdgeInspector({
  edge,
  sourceNode,
  targetNode,
  issues,
  issueCount,
  onDelete,
}: EdgeInspectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="p-3">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">{t("canvas.inspector")}</div>
            <ValidationBadge count={issueCount} />
          </div>
          <div className="text-xs text-ui-muted">
            {t("canvas.edge")} • {edge.id}
          </div>
        </div>

        {/* Validation Issues */}
        {issues.length > 0 && (
          <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
            <div className="text-sm font-medium">{t("canvas.validation")}</div>
            <div className="mt-2 space-y-2">
              {issues.map((issue, idx) => {
                const message = t(issue.messageKey, issue.messageParams);
                const hint = hintFor(issue.messageKey, t);
                return (
                  <div
                    key={`${issue.id}-${idx}`}
                    className="rounded-md border border-red-500/20 bg-red-500/5 p-2"
                  >
                    <div className="text-xs text-red-200">{message}</div>
                    {hint && (
                      <div className="mt-1 text-[11px] text-red-200/70">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Edge Info */}
        <div className="space-y-4">
          <div>
            <FieldLabel>{t("canvas.source")}</FieldLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{edge.source}</Pill>
              {sourceNode?.type && <Pill>{sourceNode.type}</Pill>}
            </div>
          </div>

          <div>
            <FieldLabel>{t("canvas.target")}</FieldLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{edge.target}</Pill>
              {targetNode?.type && <Pill>{targetNode.type}</Pill>}
            </div>
          </div>

          <div>
            <FieldLabel>{t("canvas.handles")}</FieldLabel>
            <div className="flex flex-wrap gap-2 text-xs text-ui-text2">
              <Pill>sourceHandle: {edge.sourceHandle ?? "—"}</Pill>
              <Pill>targetHandle: {edge.targetHandle ?? "—"}</Pill>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="my-3 mx-2">
        <button
          onClick={() => {
            onDelete();
            useToastStore.getState().success(t("toasts.deletedEdge"));
          }}
          className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          {t("canvas.deleteEdge")}
        </button>
      </div>
    </div>
  );
}
