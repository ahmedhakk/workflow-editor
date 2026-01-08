import type { NodeProps } from "reactflow";
import BaseNode from "./BaseNode";
import { useWorkflowStore } from "@features/workflow/workflow.store";

import { WORKFLOW_NODE_REGISTRY } from "@features/workflow/workflow.registry";
import { useTranslation } from "react-i18next";

export default function AudienceNode({ data, selected, id }: NodeProps<any>) {
  const { t } = useTranslation();
  const registry = WORKFLOW_NODE_REGISTRY.audience;
  const audienceType = data?.config?.audienceType ?? "all";
  const listId = data?.config?.listId;
  const hasError = useWorkflowStore((s) =>
    s.validationIssues.some((i) => i.target === "node" && i.id === id)
  );

  const subtitle =
    audienceType === "list"
      ? listId
        ? `List: ${listId}`
        : "List: not set"
      : "All contacts";

  return (
    <BaseNode
      title={data?.label ?? t(registry.labelKey)}
      subtitle={subtitle}
      icon={registry.icon}
      hasError={hasError}
      selected={selected}
      variant={registry.variant}
    />
  );
}
