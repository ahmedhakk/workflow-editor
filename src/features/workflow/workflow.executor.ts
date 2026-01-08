import type { Edge, Node } from "reactflow";

export type ExecutorWarningCode =
  | "NO_ENTRY"
  | "MULTIPLE_TRIGGERS"
  | "UNREACHABLE_NODE"
  | "CYCLE_DETECTED"
  | "MISSING_CONDITION_BRANCH"
  | "MULTIPLE_CONDITION_BRANCH";

export type ExecutorWarning = {
  code: ExecutorWarningCode;
  message: string;
  nodeId?: string;
  edgeId?: string;
};

export type ConditionRule = {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "gt"
    | "gte"
    | "lt"
    | "lte";
  value: unknown;
};

export type ExecutionNodeKind =
  | "trigger"
  | "audience"
  | "branch"
  | "delay"
  | "action";

export type ExecutionNext =
  | { mode: "end" }
  | { mode: "single"; nodeId: string; edgeId?: string }
  | { mode: "sequential"; nodeIds: string[]; edgeIds?: string[] }
  | {
      mode: "branch";
      if?: { nodeId: string; edgeId?: string };
      else?: { nodeId: string; edgeId?: string };
    };

export type ExecutionNode = {
  id: string;
  /** original UI node.type (trigger/audience/condition/sms/whatsapp/notification/delay) */
  type?: string;
  kind: ExecutionNodeKind;
  label?: string;
  config?: Record<string, unknown>;
  /** normalized runtime fields */
  runtime?:
    | {
        triggerType?: string;
        eventName?: string;
        scheduleAt?: string;
      }
    | {
        audienceType?: string;
        listId?: string;
      }
    | {
        rule: ConditionRule;
      }
    | {
        delayMs: number;
      }
    | {
        channel?: "sms" | "whatsapp" | "notification";
        priority?: number;
      };
  next: ExecutionNext;
};

export type WorkflowExecution = {
  entry: string | null;
  /** Deterministic traversal order (reachable nodes only) */
  order: string[];
  nodes: Record<string, ExecutionNode>;
  warnings: ExecutorWarning[];
};

const DEFAULT_ACTION_PRIORITY: Record<string, number> = {
  // lower number = higher priority
  whatsapp: 10,
  sms: 20,
  notification: 30,
  delay: 40,
  condition: 0,
  audience: 0,
  trigger: 0,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function pickRule(config: Record<string, unknown> | undefined): ConditionRule {
  const field = safeString(config?.field) ?? "field";
  const operatorRaw = safeString(config?.operator) ?? "equals";
  const value = (config?.value ?? "") as unknown;
  const allowed: ConditionRule["operator"][] = [
    "equals",
    "not_equals",
    "contains",
    "not_contains",
    "gt",
    "gte",
    "lt",
    "lte",
  ];
  const operator = (
    allowed.includes(operatorRaw as any) ? operatorRaw : "equals"
  ) as ConditionRule["operator"];

  return { field, operator, value };
}

function outgoingBySource(edges: Edge[]): Map<string, Edge[]> {
  const m = new Map<string, Edge[]>();
  for (const e of edges) {
    const arr = m.get(e.source) ?? [];
    arr.push(e);
    m.set(e.source, arr);
  }
  return m;
}

function incomingCount(edges: Edge[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of edges) m.set(e.target, (m.get(e.target) ?? 0) + 1);
  return m;
}

function edgePriority(edge: Edge, targetType?: string): number {
  // 1) explicit edge.data.priority
  const p = isObject(edge.data) ? num(edge.data.priority) : undefined;
  if (typeof p === "number") return p;

  // 2) fallback by target node type
  return DEFAULT_ACTION_PRIORITY[targetType ?? ""] ?? 999;
}

function sortEdgesDeterministically(
  edges: Edge[],
  nodesById: Map<string, Node>
): Edge[] {
  return [...edges].sort((a, b) => {
    const at = nodesById.get(a.target)?.type;
    const bt = nodesById.get(b.target)?.type;
    const pa = edgePriority(a, at);
    const pb = edgePriority(b, bt);
    if (pa !== pb) return pa - pb;
    // stable-ish tie-breakers
    return a.id.localeCompare(b.id);
  });
}

function detectCycles(order: string[], edges: Edge[]): Set<string> {
  const out = outgoingBySource(edges);
  const visited = new Set<string>();
  const stack = new Set<string>();
  const inCycle = new Set<string>();

  const dfs = (id: string) => {
    if (stack.has(id)) {
      inCycle.add(id);
      return;
    }
    if (visited.has(id)) return;
    visited.add(id);
    stack.add(id);

    for (const e of out.get(id) ?? []) dfs(e.target);
    stack.delete(id);
  };

  for (const id of order) dfs(id);
  return inCycle;
}

function resolveEntry(
  nodes: Node[],
  edges: Edge[]
): {
  entry: string | null;
  warnings: ExecutorWarning[];
} {
  const warnings: ExecutorWarning[] = [];
  const triggers = nodes.filter((n) => n.type === "trigger");
  if (triggers.length > 1) {
    warnings.push({
      code: "MULTIPLE_TRIGGERS",
      message: `Multiple triggers found (${triggers.length}). Using the first one.`,
    });
  }
  if (triggers[0]?.id) return { entry: triggers[0].id, warnings };

  // fallback: node with no incoming edges
  const inc = incomingCount(edges);
  const root = nodes.find((n) => (inc.get(n.id) ?? 0) === 0);
  if (root?.id) return { entry: root.id, warnings };

  warnings.push({
    code: "NO_ENTRY",
    message: "Could not determine an entry node (no trigger and no root).",
  });
  return { entry: null, warnings };
}

function traverseReachable(entry: string, edges: Edge[]): string[] {
  const out = outgoingBySource(edges);
  const visited = new Set<string>();
  const result: string[] = [];
  const stack: string[] = [entry];

  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    result.push(id);

    const next = out.get(id) ?? [];
    // push in reverse so iteration is stable
    for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]!.target);
  }

  return result;
}

function buildExecutionNode(args: {
  node: Node;
  nodesById: Map<string, Node>;
  outgoing: Edge[];
  warnings: ExecutorWarning[];
}): ExecutionNode {
  const { node, nodesById, outgoing, warnings } = args;
  const type = node.type;
  const data = isObject(node.data) ? node.data : undefined;
  const label = safeString(data?.label);
  const config = (isObject(data?.config) ? data?.config : undefined) as
    | Record<string, unknown>
    | undefined;

  // condition special handling
  if (type === "condition") {
    const ifEdges = outgoing.filter((e) => e.sourceHandle === "if");
    const elseEdges = outgoing.filter((e) => e.sourceHandle === "else");

    if (ifEdges.length === 0 || elseEdges.length === 0) {
      warnings.push({
        code: "MISSING_CONDITION_BRANCH",
        nodeId: node.id,
        message: "Condition node should have both IF and ELSE branches.",
      });
    }
    if (ifEdges.length > 1 || elseEdges.length > 1) {
      warnings.push({
        code: "MULTIPLE_CONDITION_BRANCH",
        nodeId: node.id,
        message:
          "Condition node has multiple edges for IF/ELSE; using the first of each.",
      });
    }

    const ifEdge = ifEdges[0];
    const elseEdge = elseEdges[0];
    const next: ExecutionNext = {
      mode: "branch",
      if: ifEdge ? { nodeId: ifEdge.target, edgeId: ifEdge.id } : undefined,
      else: elseEdge
        ? { nodeId: elseEdge.target, edgeId: elseEdge.id }
        : undefined,
    };

    return {
      id: node.id,
      type,
      kind: "branch",
      label,
      config,
      runtime: { rule: pickRule(config) },
      next,
    };
  }

  // delay node
  if (type === "delay") {
    const minutes = num(config?.minutes) ?? 0;
    const delayMs = Math.max(0, Math.round(minutes * 60 * 1000));

    const sorted = sortEdgesDeterministically(outgoing, nodesById);
    const first = sorted[0];
    const next: ExecutionNext = first
      ? { mode: "single", nodeId: first.target, edgeId: first.id }
      : { mode: "end" };

    return {
      id: node.id,
      type,
      kind: "delay",
      label,
      config,
      runtime: { delayMs },
      next,
    };
  }

  // trigger node
  if (type === "trigger") {
    const triggerType = safeString(config?.triggerType) ?? "event";
    const eventName = safeString(config?.eventName);
    const scheduleAt = isObject(config?.schedule)
      ? safeString((config?.schedule as any).at)
      : undefined;

    const sorted = sortEdgesDeterministically(outgoing, nodesById);
    const first = sorted[0];

    return {
      id: node.id,
      type,
      kind: "trigger",
      label,
      config,
      runtime: { triggerType, eventName, scheduleAt },
      next: first
        ? { mode: "single", nodeId: first.target, edgeId: first.id }
        : { mode: "end" },
    };
  }

  // audience node
  if (type === "audience") {
    const audienceType = safeString(config?.audienceType) ?? "all";
    const listId = safeString(config?.listId);
    const sorted = sortEdgesDeterministically(outgoing, nodesById);
    const first = sorted[0];

    return {
      id: node.id,
      type,
      kind: "audience",
      label,
      config,
      runtime: { audienceType, listId },
      next: first
        ? { mode: "single", nodeId: first.target, edgeId: first.id }
        : { mode: "end" },
    };
  }

  // action nodes (sms/whatsapp/notification/unknown)
  const sorted = sortEdgesDeterministically(outgoing, nodesById);
  const nodeIds = sorted.map((e) => e.target);
  const edgeIds = sorted.map((e) => e.id);
  const channel =
    type === "sms"
      ? "sms"
      : type === "whatsapp"
        ? "whatsapp"
        : type === "notification"
          ? "notification"
          : undefined;

  const next: ExecutionNext =
    nodeIds.length === 0
      ? { mode: "end" }
      : nodeIds.length === 1
        ? { mode: "single", nodeId: nodeIds[0]!, edgeId: edgeIds[0] }
        : { mode: "sequential", nodeIds, edgeIds };

  return {
    id: node.id,
    type,
    kind: "action",
    label,
    config,
    runtime: {
      channel,
      // expose default priority so backend can reproduce ordering
      priority: DEFAULT_ACTION_PRIORITY[type ?? ""] ?? 999,
    },
    next,
  };
}

export function buildWorkflowExecution(args: {
  nodes: Node[];
  edges: Edge[];
}): WorkflowExecution {
  const { nodes, edges } = args;
  const nodesById = new Map<string, Node>(nodes.map((n) => [n.id, n]));
  const out = outgoingBySource(edges);

  const entryResult = resolveEntry(nodes, edges);
  const warnings: ExecutorWarning[] = [...entryResult.warnings];
  const entry = entryResult.entry;

  const order = entry ? traverseReachable(entry, edges) : [];

  // unreachable nodes
  const reachable = new Set(order);
  for (const n of nodes) {
    if (!reachable.has(n.id)) {
      warnings.push({
        code: "UNREACHABLE_NODE",
        nodeId: n.id,
        message: `Node '${n.id}' is not reachable from the entry node.`,
      });
    }
  }

  // cycles
  const cycleNodes = entry ? detectCycles(order, edges) : new Set<string>();
  for (const nodeId of cycleNodes) {
    warnings.push({
      code: "CYCLE_DETECTED",
      nodeId,
      message: `Cycle detected involving node '${nodeId}'. Backend execution should guard against infinite loops.`,
    });
  }

  // build execution nodes (reachable only)
  const execNodes: Record<string, ExecutionNode> = {};
  for (const id of order) {
    const node = nodesById.get(id);
    if (!node) continue;
    execNodes[id] = buildExecutionNode({
      node,
      nodesById,
      outgoing: out.get(id) ?? [],
      warnings,
    });
  }

  return { entry, order, nodes: execNodes, warnings };
}
