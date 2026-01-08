import type { NodeProps } from "reactflow";
import BaseNode from "@/features/workflow/nodes/BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useTranslation } from "react-i18next";

export default function NotificationNode({
  data,
  selected,
  id,
}: NodeProps<any>) {
  const { t } = useTranslation();
  const registry = WORKFLOW_NODE_REGISTRY.notification;

  const title = data?.config?.title;
  const body = data?.config?.body;

  const subtitle = title
    ? `Title: ${title}`
    : body
      ? "Body set"
      : "Notification not set";

  const hasError = useWorkflowStore((s) =>
    s.validationIssues.some((i) => i.target === "node" && i.id === id)
  );

  return (
    <BaseNode
      title={data?.label ?? t(registry.labelKey)}
      subtitle={subtitle}
      icon={registry.icon}
      selected={selected}
      hasTarget
      hasSource
      hasError={hasError}
      variant={registry.variant}
    />
  );
}
