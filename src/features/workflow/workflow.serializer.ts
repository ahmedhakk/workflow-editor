import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
  WorkflowStatus,
} from "@types";
// import {
//   buildWorkflowExecution,
//   type WorkflowExecution,
// } from "@features/workflow/workflow.executor";

type SerializedNode = {
  id: string;
  type: WorkflowNodeType;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    config: Record<string, unknown>;
  };
};

type SerializedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

export type WorkflowPayload = {
  id: string;
  name: string;
  status: WorkflowStatus;
  version: number;
  updatedAt: string;
  // execution?: WorkflowExecution;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
};

function sanitizeNode(node: WorkflowNode): SerializedNode {
  return {
    id: node.id,
    type: node.type as WorkflowNodeType,
    position: {
      x: node.position.x,
      y: node.position.y,
    },
    data: {
      label: node.data.label,
      config: node.data.config ?? {},
    },
  };
}

function sanitizeEdge(edge: WorkflowEdge): SerializedEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
  };
}

export function serializeWorkflow(args: {
  id: string;
  name: string;
  status: WorkflowStatus;
  version?: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}): WorkflowPayload {
  const { id, name, status, version = 1, nodes, edges } = args;

  // const execution = buildWorkflowExecution({ nodes, edges });

  return {
    id,
    name,
    status,
    version,
    updatedAt: new Date().toISOString(),
    // execution,
    nodes: nodes.map(sanitizeNode),
    edges: edges.map(sanitizeEdge),
  };
}
