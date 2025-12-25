import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import BaseNode from "./BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";

export default function ConditionNode({ data, selected }: NodeProps<any>) {
  const r = WORKFLOW_NODE_REGISTRY.condition;

  const field = data?.config?.field ?? "field";
  const operator = data?.config?.operator ?? "equals";
  const value = data?.config?.value ?? "";

  const subtitle = `${field} ${operator} ${value || "…"}`;

  return (
    <div className="relative">
      {/* Input */}
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="h-3! w-3! border-2! bg-zinc-950! border-emerald-300/80!"
      />

      <BaseNode
        title={data?.label ?? r.label}
        subtitle={subtitle}
        icon={r.icon}
        selected={selected}
        hasTarget={false} // we render our own input handle
        hasSource={false} // we render custom outputs
        variant={r.variant}
      />

      {/* IF output */}
      <Handle
        id="if"
        type="source"
        position={Position.Right}
        style={{ top: "35%" }}
        className="h-3! w-3! border-2! bg-zinc-950! border-emerald-300/80!"
      />
      <div className="pointer-events-none absolute right-4 top-[28%] text-[10px] text-emerald-200">
        IF
      </div>

      {/* ELSE output */}
      <Handle
        id="else"
        type="source"
        position={Position.Right}
        style={{ top: "70%" }}
        className="h-3! w-3! border-2! bg-zinc-950! border-emerald-300/80!"
      />
      <div className="pointer-events-none absolute right-4 top-[63%] text-[10px] text-emerald-200">
        ELSE
      </div>
    </div>
  );
}
