import type { NodeProps } from "reactflow";
import { MessageCircle } from "lucide-react";
import BaseNode from "./BaseNode";

export default function WhatsAppNode({ data, selected }: NodeProps<any>) {
  const templateId = data?.config?.templateId;
  const subtitle = templateId ? `Template: ${templateId}` : "Template not set";

  return (
    <BaseNode
      title={data?.label ?? "Send WhatsApp"}
      subtitle={subtitle}
      icon={<MessageCircle className="h-4 w-4" />}
      selected={selected}
      variant="green"
    />
  );
}
