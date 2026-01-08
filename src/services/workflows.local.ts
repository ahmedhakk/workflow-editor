import type { WorkflowPayload } from "@features/workflow/workflow.serializer";
import { buildWorkflowExecution } from "@features/workflow/workflow.executor";

export type WorkflowListItem = {
  id: string;
  name: string;
  status: "draft" | "published";
  updatedAt: string; // ISO
  version: number;
};

const LS_INDEX_KEY = "wf:index";
const LS_DOC_KEY = (id: string) => `wf:doc:${id}`;

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function listWorkflows(): WorkflowListItem[] {
  const index = safeJsonParse<WorkflowListItem[]>(
    localStorage.getItem(LS_INDEX_KEY),
    []
  );

  // newest first
  return [...index].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getWorkflow(id: string): WorkflowPayload | null {
  return safeJsonParse<WorkflowPayload | null>(
    localStorage.getItem(LS_DOC_KEY(id)),
    null
  );
}

export function upsertWorkflow(payload: WorkflowPayload) {
  localStorage.setItem(LS_DOC_KEY(payload.id), JSON.stringify(payload));

  const index = safeJsonParse<WorkflowListItem[]>(
    localStorage.getItem(LS_INDEX_KEY),
    []
  );

  const item: WorkflowListItem = {
    id: payload.id,
    name: payload.name,
    status: payload.status,
    updatedAt: payload.updatedAt ?? nowIso(),
    version: payload.version ?? 1,
  };

  const next = [item, ...index.filter((x) => x.id !== payload.id)];
  localStorage.setItem(LS_INDEX_KEY, JSON.stringify(next));
}

export function deleteWorkflow(id: string) {
  localStorage.removeItem(LS_DOC_KEY(id));

  const index = safeJsonParse<WorkflowListItem[]>(
    localStorage.getItem(LS_INDEX_KEY),
    []
  );
  localStorage.setItem(
    LS_INDEX_KEY,
    JSON.stringify(index.filter((x) => x.id !== id))
  );
}

export function createWorkflowSeed(args?: { name?: string }) {
  const id = `wf-${crypto.randomUUID().slice(0, 8)}`;

  const nodes: WorkflowPayload["nodes"] = [
    {
      id: "trigger-1",
      type: "trigger",
      position: { x: 120, y: 80 },
      data: { label: "Trigger", config: {} },
    },
    {
      id: "audience-1",
      type: "audience",
      position: { x: 120, y: 220 },
      data: { label: "Audience", config: {} },
    },
  ];

  const edges: WorkflowPayload["edges"] = [
    { id: "e1-2", source: "trigger-1", target: "audience-1" },
  ];

  const execution = buildWorkflowExecution({
    nodes: nodes as any,
    edges: edges as any,
  });

  const payload: WorkflowPayload = {
    id,
    name: args?.name ?? "Untitled workflow",
    status: "draft",
    version: 1,
    updatedAt: nowIso(),
    execution,
    nodes,
    edges,
  };

  upsertWorkflow(payload);
  return payload;
}

export function duplicateWorkflow(id: string) {
  const existing = getWorkflow(id);
  if (!existing) return null;

  const copy = createWorkflowSeed({ name: `${existing.name} (copy)` });

  const nodes = existing.nodes.map((n) => ({ ...n, id: `${n.id}-${copy.id}` }));
  const edges = existing.edges.map((e) => ({
    ...e,
    id: `${e.id}-${copy.id}`,
    source: `${e.source}-${copy.id}`,
    target: `${e.target}-${copy.id}`,
  }));

  upsertWorkflow({
    ...copy,
    execution: buildWorkflowExecution({
      nodes: nodes as any,
      edges: edges as any,
    }),
    nodes,
    edges,
  });

  return getWorkflow(copy.id);
}

export function renameWorkflow(id: string, name: string) {
  const doc = getWorkflow(id);
  if (!doc) return;
  upsertWorkflow({ ...doc, name, updatedAt: nowIso() });
}

export function setWorkflowStatus(id: string, status: "draft" | "published") {
  const doc = getWorkflow(id);
  if (!doc) return;
  upsertWorkflow({ ...doc, status, updatedAt: nowIso() });
}
