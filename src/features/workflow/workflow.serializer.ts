import type { Edge, Node } from "reactflow";

export type WorkflowStatus = "draft" | "published";

export type WorkflowPayload = {
  id: string;
  name: string;
  status: WorkflowStatus;
  version: number;
  updatedAt: string;

  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data?: any;
  }>;

  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }>;
};

export function serializeWorkflow(args: {
  id: string;
  name: string;
  status: WorkflowStatus;
  version?: number;
  nodes: Node[];
  edges: Edge[];
}): WorkflowPayload {
  const { id, name, status, version = 1, nodes, edges } = args;

  return {
    id,
    name,
    status,
    version,
    updatedAt: new Date().toISOString(),
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
    })),
  };
}
