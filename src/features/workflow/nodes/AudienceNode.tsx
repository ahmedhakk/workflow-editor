import type { NodeProps } from "reactflow";
import { Users } from "lucide-react";
import BaseNode from "./BaseNode";

export default function AudienceNode({ data, selected }: NodeProps<any>) {
  const audienceType = data?.config?.audienceType ?? "all";
  const listId = data?.config?.listId;

  const subtitle =
    audienceType === "list"
      ? listId
        ? `List: ${listId}`
        : "List: not set"
      : "All contacts";

  return (
    <BaseNode
      title={data?.label ?? "Audience"}
      subtitle={subtitle}
      icon={<Users className="h-4 w-4" />}
      selected={selected}
      variant="blue"
    />
  );
}
