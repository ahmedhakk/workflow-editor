import type { NodeProps } from "reactflow";
import BaseNode from "./BaseNode";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useTranslation } from "react-i18next";

export default function WhatsAppNode({ data, selected, id }: NodeProps<any>) {
  const { t } = useTranslation();
  const templateId = data?.config?.templateId;
  const subtitle = templateId ? `Template: ${templateId}` : "Template not set";
  const registry = WORKFLOW_NODE_REGISTRY.whatsapp;

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
