import type { NodeProps } from "reactflow";
import BaseNode from "./BaseNode";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useTranslation } from "react-i18next";

export default function SmsNode({ data, selected, id }: NodeProps<any>) {
  const { t } = useTranslation();
  const senderId = data?.config?.senderId;
  const text = data?.config?.text;
  const registry = WORKFLOW_NODE_REGISTRY.sms;

  const subtitle = text
    ? `${senderId ? senderId + " • " : ""}${text.slice(0, 40)}${text.length > 40 ? "…" : ""}`
    : senderId
      ? `Sender: ${senderId}`
      : "SMS content not set";

  const hasError = useWorkflowStore((s) =>
    s.validationIssues.some((i) => i.target === "node" && i.id === id)
  );

  return (
    <BaseNode
      title={data?.label ?? t(registry.labelKey)}
      subtitle={subtitle}
      icon={registry.icon}
      selected={selected}
      hasError={hasError}
      variant={registry.variant}
    />
  );
}
