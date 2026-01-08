import type { Connection, Edge, Node } from "reactflow";

const ALLOWED_NEXT: Record<string, string[]> = {
  trigger: [
    "audience",
    "condition",
    "delay",
    "sms",
    "whatsapp",
    "notification",
  ],
  audience: ["condition", "delay", "sms", "whatsapp", "notification"],
  condition: ["delay", "sms", "whatsapp", "notification", "condition"],
  delay: ["condition", "delay", "sms", "whatsapp", "notification"],
  sms: ["delay", "condition", "sms", "whatsapp", "notification"],
  whatsapp: ["delay", "condition", "sms", "whatsapp", "notification"],
  notification: ["delay", "condition", "sms", "whatsapp", "notification"], // or [] if terminal
};

export function countNodesOfType(nodes: Node[], type: string) {
  return nodes.filter((n) => n.type === type).length;
}

export function hasIncoming(edges: Edge[], nodeId: string) {
  return edges.some((e) => e.target === nodeId);
}

export function hasOutgoing(edges: Edge[], nodeId: string) {
  return edges.some((e) => e.source === nodeId);
}

// DAG-safe cycle detection for branching graphs.
// When adding newSource -> newTarget, a cycle exists if newSource is reachable from newTarget.
function createsCycle(edges: Edge[], newSource: string, newTarget: string) {
  const adjacency = new Map<string, string[]>();
  for (const e of edges) {
    const arr = adjacency.get(e.source) ?? [];
    arr.push(e.target);
    adjacency.set(e.source, arr);
  }

  const visited = new Set<string>();
  const stack = [newTarget];

  while (stack.length) {
    const cur = stack.pop()!;
    if (cur === newSource) return true;
    if (visited.has(cur)) continue;
    visited.add(cur);

    const next = adjacency.get(cur) ?? [];
    for (const n of next) stack.push(n);
  }

  return false;
}

function hasOutgoingFromHandle(
  edges: Edge[],
  nodeId: string,
  handleId: string
) {
  return edges.some(
    (e) => e.source === nodeId && (e.sourceHandle ?? "") === handleId
  );
}

function hasEdgeFromSourceToTarget(
  edges: Edge[],
  sourceId: string,
  targetId: string
) {
  return edges.some((e) => e.source === sourceId && e.target === targetId);
}

export function validateConnection(args: {
  connection: Connection;
  nodes: Node[];
  edges: Edge[];
}): {
  valid: boolean;
  reasonKey?: string;
  reasonParams?: Record<string, unknown>;
} {
  const { connection, nodes, edges } = args;

  const source = connection.source;
  const target = connection.target;

  if (!source || !target) return { valid: false };
  if (source === target)
    return { valid: false, reasonKey: "validation.cannotConnectToSelf" };

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return { valid: false };

  // ✅ Target must always be the input handle "in"
  if (connection.targetHandle && connection.targetHandle !== "in") {
    return { valid: false, reasonKey: "validation.connectToInputHandle" };
  }

  // ✅ Source handle rules depend on node type:
  // - normal nodes use "out"
  // - condition node uses "if" or "else"
  if (sourceNode.type === "condition") {
    if (
      connection.sourceHandle !== "if" &&
      connection.sourceHandle !== "else"
    ) {
      return {
        valid: false,
        reasonKey: "validation.useIfElseOutputs",
      };
    }
  } else {
    if (connection.sourceHandle && connection.sourceHandle !== "out") {
      return {
        valid: false,
        reasonKey: "validation.connectFromOutputHandle",
      };
    }
  }

  // Trigger cannot have incoming edges
  if (targetNode.type === "trigger") {
    return { valid: false, reasonKey: "validation.triggerMustBeFirst" };
  }

  // Allowed transitions by type
  const allowed = ALLOWED_NEXT[sourceNode.type ?? ""] ?? [];
  if (!allowed.includes(targetNode.type ?? "")) {
    return { valid: false, reasonKey: "validation.invalidStepConnection" };
  }

  // Prevent cycles in a branching graph
  if (createsCycle(edges, source, target)) {
    return {
      valid: false,
      reasonKey: "validation.connectionCreatesCycle",
    };
  }

  // Condition branches: only one connection per output handle (IF/ELSE)
  if (sourceNode.type === "condition") {
    const h = connection.sourceHandle!; // "if" | "else"

    if (hasOutgoingFromHandle(edges, source, h)) {
      return {
        valid: false,
        reasonKey: "validation.branchAlreadyConnected",
        reasonParams: { branch: h.toUpperCase() },
      };
    }

    if (hasEdgeFromSourceToTarget(edges, source, target)) {
      return {
        valid: false,
        reasonKey: "validation.ifElseSameTarget",
      };
    }
  }

  return { valid: true };
}

/** ---------------------------
 *  Workflow Validation (Save/Run)
 *  --------------------------- */

export type ValidationSeverity = "error" | "warning";
export type ValidationTarget = "workflow" | "node" | "edge";

export type ValidationIssue = {
  severity: ValidationSeverity;
  target: ValidationTarget;
  id?: string; // nodeId or edgeId (if applicable)
  messageKey: string; // i18n translation key
  messageParams?: Record<string, unknown>; // parameters for interpolation
};

function push(
  issues: ValidationIssue[],
  issue: Omit<ValidationIssue, "severity"> & { severity?: ValidationSeverity }
) {
  issues.push({ severity: "error", ...issue });
}

function buildAdjacency(edges: Edge[]) {
  const out = new Map<string, string[]>();
  for (const e of edges) {
    const arr = out.get(e.source) ?? [];
    arr.push(e.target);
    out.set(e.source, arr);
  }
  return out;
}

function detectAnyCycle(nodes: Node[], edges: Edge[]) {
  // Standard DFS cycle detection across directed graph
  const adjacency = buildAdjacency(edges);
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;

    visiting.add(id);
    for (const nxt of adjacency.get(id) ?? []) {
      if (dfs(nxt)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  for (const n of nodes) {
    if (dfs(n.id)) return true;
  }
  return false;
}

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export function validateWorkflow(args: { nodes: Node[]; edges: Edge[] }): {
  valid: boolean;
  issues: ValidationIssue[];
} {
  const { nodes, edges } = args;
  const issues: ValidationIssue[] = [];

  const nodesById = new Map(nodes.map((n) => [n.id, n]));
  const triggers = nodes.filter((n) => n.type === "trigger");

  // 1) Exactly one trigger
  if (triggers.length === 0) {
    push(issues, {
      target: "workflow",
      messageKey: "validation.workflowMustHaveTrigger",
    });
  } else if (triggers.length > 1) {
    for (const t of triggers) {
      push(issues, {
        target: "node",
        id: t.id,
        messageKey: "validation.onlyOneTrigger",
      });
    }
  }

  // 2) Edge integrity + handle rules (for imported/edited data)
  for (const e of edges) {
    const sourceNode = nodesById.get(e.source);
    const targetNode = nodesById.get(e.target);

    if (!sourceNode) {
      push(issues, {
        target: "edge",
        id: e.id,
        messageKey: "validation.edgeSourceNotFound",
        messageParams: { source: e.source },
      });
      continue;
    }
    if (!targetNode) {
      push(issues, {
        target: "edge",
        id: e.id,
        messageKey: "validation.edgeTargetNotFound",
        messageParams: { target: e.target },
      });
      continue;
    }

    // target handle must be "in" (or empty/null)
    if (e.targetHandle && e.targetHandle !== "in") {
      push(issues, {
        target: "edge",
        id: e.id,
        messageKey: "validation.edgeMustConnectToIn",
      });
    }

    // source handle rules
    if (sourceNode.type === "condition") {
      if (e.sourceHandle !== "if" && e.sourceHandle !== "else") {
        push(issues, {
          target: "edge",
          id: e.id,
          messageKey: "validation.conditionMustUseIfElse",
        });
      }
    } else {
      if (e.sourceHandle && e.sourceHandle !== "out") {
        push(issues, {
          target: "edge",
          id: e.id,
          messageKey: "validation.edgeMustConnectFromOut",
        });
      }
    }

    // trigger cannot be a target
    if (targetNode.type === "trigger") {
      push(issues, {
        target: "edge",
        id: e.id,
        messageKey: "validation.triggerNoIncoming",
      });
    }

    // allowed transitions
    const allowed = ALLOWED_NEXT[sourceNode.type ?? ""] ?? [];
    if (!allowed.includes(targetNode.type ?? "")) {
      push(issues, {
        target: "edge",
        id: e.id,
        messageKey: "validation.invalidConnectionType",
        messageParams: {
          sourceType: sourceNode.type,
          targetType: targetNode.type,
        },
      });
    }
  }

  // 3) Trigger cannot have incoming edges
  for (const t of triggers) {
    if (hasIncoming(edges, t.id)) {
      push(issues, {
        target: "node",
        id: t.id,
        messageKey: "validation.triggerNoIncomingEdges",
      });
    }
  }

  // 4) Condition must have both IF and ELSE connected
  for (const n of nodes) {
    if (n.type !== "condition") continue;

    const ifConnected = edges.some(
      (e) => e.source === n.id && (e.sourceHandle ?? "") === "if"
    );
    const elseConnected = edges.some(
      (e) => e.source === n.id && (e.sourceHandle ?? "") === "else"
    );

    if (!ifConnected) {
      push(issues, {
        target: "node",
        id: n.id,
        messageKey: "validation.conditionIfNotConnected",
      });
    }
    if (!elseConnected) {
      push(issues, {
        target: "node",
        id: n.id,
        messageKey: "validation.conditionElseNotConnected",
      });
    }
  }

  // 5) No cycles (safety net)
  if (detectAnyCycle(nodes, edges)) {
    push(issues, {
      target: "workflow",
      messageKey: "validation.workflowContainsCycle",
    });
  }

  // 6) Reachability: everything should be reachable from Trigger
  if (triggers.length === 1) {
    const start = triggers[0].id;
    const adjacency = buildAdjacency(edges);
    const reachable = new Set<string>();
    const stack = [start];

    while (stack.length) {
      const cur = stack.pop()!;
      if (reachable.has(cur)) continue;
      reachable.add(cur);
      for (const nxt of adjacency.get(cur) ?? []) stack.push(nxt);
    }

    for (const n of nodes) {
      if (!reachable.has(n.id)) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.nodeNotReachable",
        });
      }
    }
  }

  // 7) Config validation (minimum required fields)
  for (const n of nodes) {
    const cfg = (n.data as any)?.config ?? {};

    if (n.type === "audience") {
      const audienceType = cfg.audienceType ?? "all";
      if (audienceType === "list" && !isNonEmptyString(cfg.listId)) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.audienceListIdRequired",
        });
      }
    }

    if (n.type === "sms") {
      if (!isNonEmptyString(cfg.text)) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.smsMessageRequired",
        });
      }
    }

    if (n.type === "whatsapp") {
      if (!isNonEmptyString(cfg.templateId)) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.whatsappTemplateRequired",
        });
      }
    }

    if (n.type === "delay") {
      const minutes = cfg.minutes;
      if (typeof minutes !== "number" || Number.isNaN(minutes) || minutes < 0) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.delayMinutesInvalid",
        });
      }
    }

    if (n.type === "notification") {
      // keep it simple: require either title or body (you can tighten later)
      const title = cfg.title;
      const body = cfg.body;
      if (!isNonEmptyString(title) && !isNonEmptyString(body)) {
        push(issues, {
          target: "node",
          id: n.id,
          messageKey: "validation.notificationContentRequired",
        });
      }
    }
  }

  const valid = issues.every((i) => i.severity !== "error");
  return { valid, issues };
}
