import type { NodeProps } from "reactflow";
import { Clock } from "lucide-react";
import BaseNode from "./BaseNode";

export default function DelayNode({ data, selected }: NodeProps<any>) {
  const minutes = data?.config?.minutes;
  const subtitle =
    typeof minutes === "number"
      ? `Wait: ${minutes} minute(s)`
      : "Delay not set";

  return (
    <BaseNode
      title={data?.label ?? "Delay"}
      subtitle={subtitle}
      icon={<Clock className="h-4 w-4" />}
      selected={selected}
      variant="gray"
    />
  );
}
