import type { WorkflowEdge, WorkflowNode, WorkflowStatus } from "@types";
import {
  buildWorkflowExecution,
  type WorkflowExecution,
} from "@features/workflow/workflow.executor";

export type WorkflowPayload = {
  id: string;
  name: string;
  status: WorkflowStatus;
  version: number;
  updatedAt: string;
  execution?: WorkflowExecution;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export function serializeWorkflow(args: {
  id: string;
  name: string;
  status: WorkflowStatus;
  version?: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}): WorkflowPayload {
  const { id, name, status, version = 1, nodes, edges } = args;

  const execution = buildWorkflowExecution({ nodes, edges });

  return {
    id,
    name,
    status,
    version,
    updatedAt: new Date().toISOString(),
    execution,
    nodes,
    edges,
  };
}
