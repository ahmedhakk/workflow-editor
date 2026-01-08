import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import BaseNode from "./BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useTranslation } from "react-i18next";

export default function ConditionNode({ data, selected, id }: NodeProps<any>) {
  const { t } = useTranslation();
  const r = WORKFLOW_NODE_REGISTRY.condition;

  const field = data?.config?.field ?? "field";
  const operator = data?.config?.operator ?? "equals";
  const value = data?.config?.value ?? "";

  const subtitle = `${field} ${operator} ${value || "…"}`;

  const hasError = useWorkflowStore((s) =>
    s.validationIssues.some((i) => i.target === "node" && i.id === id)
  );

  return (
    <div className="relative">
      {/* Input */}
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="h-3! w-3! border-2! bg-zinc-950! border-red-300/80!"
      />

      <BaseNode
        title={data?.label ?? t(r.labelKey)}
        subtitle={subtitle}
        icon={r.icon}
        selected={selected}
        hasTarget={false} // we render our own input handle
        hasSource={false} // we render custom outputs
        hasError={hasError}
        variant={r.variant}
      />

      {/* IF output */}
      <Handle
        id="if"
        type="source"
        position={Position.Right}
        style={{ top: "35%" }}
        className="h-3! w-3! border-2! bg-zinc-950! border-red-300/80!"
      />
      <div className="pointer-events-none absolute right-4 top-[28%] text-[10px] text-red-200">
        IF
      </div>

      {/* ELSE output */}
      <Handle
        id="else"
        type="source"
        position={Position.Right}
        style={{ top: "70%" }}
        className="h-3! w-3! border-2! bg-zinc-950! border-red-300/80!"
      />
      <div className="pointer-events-none absolute right-4 top-[63%] text-[10px] text-red-200">
        ELSE
      </div>
    </div>
  );
}
