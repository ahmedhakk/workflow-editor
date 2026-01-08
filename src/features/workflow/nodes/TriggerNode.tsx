import type { NodeProps } from "reactflow";
import BaseNode from "./BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useTranslation } from "react-i18next";

export default function TriggerNode({ data, selected, id }: NodeProps<any>) {
  const { t } = useTranslation();
  const registry = WORKFLOW_NODE_REGISTRY.trigger;

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

  const hasError = useWorkflowStore((s) =>
    s.validationIssues.some((i) => i.target === "node" && i.id === id)
  );
  return (
    <BaseNode
      title={data?.label ?? t(registry.labelKey)}
      subtitle={subtitle}
      icon={registry.icon}
      selected={selected}
      hasTarget={false}
      hasSource
      hasError={hasError}
      variant={registry.variant}
    />
  );
}
