import type { NodeProps } from "reactflow";
import { MessageSquareText } from "lucide-react";
import BaseNode from "./BaseNode";

export default function SmsNode({ data, selected }: NodeProps<any>) {
  const senderId = data?.config?.senderId;
  const text = data?.config?.text;

  const subtitle = text
    ? `${senderId ? senderId + " • " : ""}${text.slice(0, 40)}${text.length > 40 ? "…" : ""}`
    : senderId
      ? `Sender: ${senderId}`
      : "SMS content not set";

  return (
    <BaseNode
      title={data?.label ?? "Send SMS"}
      subtitle={subtitle}
      icon={<MessageSquareText className="h-4 w-4" />}
      selected={selected}
    />
  );
}
