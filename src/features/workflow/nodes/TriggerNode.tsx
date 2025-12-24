import type { NodeProps } from "reactflow";
import BaseNode from "./BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";

export default function TriggerNode({ data, selected }: NodeProps<any>) {
  const r = WORKFLOW_NODE_REGISTRY.trigger;

  const triggerType = data?.config?.triggerType ?? "event";
  const eventName = data?.config?.eventName;
  const at = data?.config?.schedule?.at;

  const subtitle =
    triggerType === "schedule"
      ? at
        ? `Schedule: ${at}`
        : "Schedule: not set"
      : triggerType === "manual"
        ? "Manual trigger"
        : eventName
          ? `Event: ${eventName}`
          : "Event: not set";

  return (
    <BaseNode
      title={data?.label ?? r.label}
      subtitle={subtitle}
      icon={r.icon}
      selected={selected}
      hasTarget={false}
      hasSource
      variant={r.variant}
    />
  );
}
