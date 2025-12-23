import type { NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import BaseNode from "./BaseNode";

export default function TriggerNode({ data, selected }: NodeProps<any>) {
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
      title={data?.label ?? "Trigger"}
      subtitle={subtitle}
      icon={<Zap className="h-4 w-4" />}
      selected={selected}
      hasTarget={false}
      hasSource
    />
  );
}
