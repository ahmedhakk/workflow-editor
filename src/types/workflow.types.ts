import type { Edge, Node } from "reactflow";

export type WorkflowNodeType =
  | "trigger"
  | "audience"
  | "sms"
  | "whatsapp"
  | "delay";

export type WorkflowNodeData = {
  label: string;
  // put config here later (event name, list id, template id, etc.)
  config?: Record<string, unknown>;
};

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export type WorkflowStatus = "draft" | "published";

export type WorkflowDocument = {
  id: string;
  name: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};
