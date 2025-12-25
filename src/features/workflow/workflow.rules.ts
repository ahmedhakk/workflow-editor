import type { Connection, Edge, Node } from "reactflow";

const ALLOWED_NEXT: Record<string, string[]> = {
  trigger: ["audience", "condition", "delay", "sms", "whatsapp"],
  audience: ["condition", "delay", "sms", "whatsapp"],
  condition: ["delay", "sms", "whatsapp", "condition"],
  delay: ["condition", "delay", "sms", "whatsapp"],
  sms: ["delay", "condition", "sms", "whatsapp"],
  whatsapp: ["delay", "condition", "sms", "whatsapp"],
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
}): { valid: boolean; reason?: string } {
  const { connection, nodes, edges } = args;

  const source = connection.source;
  const target = connection.target;

  if (!source || !target) return { valid: false };
  if (source === target)
    return { valid: false, reason: "Cannot connect a step to itself" };

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return { valid: false };

  // ✅ Target must always be the input handle "in"
  if (connection.targetHandle && connection.targetHandle !== "in") {
    return { valid: false, reason: "Connect to the input handle (in)" };
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
        reason: "Use IF/ELSE outputs on the condition node",
      };
    }
  } else {
    if (connection.sourceHandle && connection.sourceHandle !== "out") {
      return { valid: false, reason: "Connect from the output handle (out)" };
    }
  }

  // Trigger cannot have incoming edges
  if (targetNode.type === "trigger") {
    return { valid: false, reason: "Trigger must be the first step" };
  }

  // Allowed transitions by type
  const allowed = ALLOWED_NEXT[sourceNode.type ?? ""] ?? [];
  if (!allowed.includes(targetNode.type ?? "")) {
    return { valid: false, reason: "This step cannot connect to that step" };
  }

  /* OPTIONAL: keep “no merging” rule (target can only have one parent)
    Example merge:
      SMS → Delay
      WhatsApp → Delay
  */
  // if (hasIncoming(edges, target)) {
  //   return { valid: false, reason: "This step already has a previous step" };
  // }

  // Prevent cycles in a branching graph
  if (createsCycle(edges, source, target)) {
    return { valid: false, reason: "This connection creates a cycle" };
  }

  /* 
    Condition branches: only one connection per output handle (IF/ELSE)
    Allows:
      Condition (IF)   → SMS
      Condition (ELSE) → WhatsApp
    Blocks:
      Condition (IF)   → two different nodes
  */
  if (sourceNode.type === "condition") {
    const h = connection.sourceHandle!; // "if" | "else"

    // 1) one connection per branch handle
    if (hasOutgoingFromHandle(edges, source, h)) {
      return {
        valid: false,
        reason: `The ${h.toUpperCase()} branch is already connected`,
      };
    }

    // 2) IF and ELSE can't connect to the same target
    if (hasEdgeFromSourceToTarget(edges, source, target)) {
      return {
        valid: false,
        reason: "IF and ELSE cannot connect to the same step",
      };
    }
  }

  return { valid: true };
}
