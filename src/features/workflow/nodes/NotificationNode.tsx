import type { NodeProps } from "reactflow";
import BaseNode from "@/features/workflow/nodes/BaseNode";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";

export default function NotificationNode({ data, selected }: NodeProps<any>) {
  const r = WORKFLOW_NODE_REGISTRY.notification;

  const title = data?.config?.title;
  const body = data?.config?.body;

  const subtitle = title
    ? `Title: ${title}`
    : body
      ? "Body set"
      : "Notification not set";

  return (
    <BaseNode
      title={data?.label ?? r.label}
      subtitle={subtitle}
      icon={r.icon}
      selected={selected}
      hasTarget
      hasSource
      variant={r.variant}
    />
  );
}
