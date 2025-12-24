import type { Connection, Edge, Node } from "reactflow";

const ALLOWED_NEXT: Record<string, string[]> = {
  trigger: ["audience", "delay", "sms", "whatsapp"],
  audience: ["delay", "sms", "whatsapp"],
  delay: ["delay", "sms", "whatsapp"],
  sms: ["delay", "sms", "whatsapp"],
  whatsapp: ["delay", "sms", "whatsapp"],
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

function createsCycle(edges: Edge[], newSource: string, newTarget: string) {
  // When adding newSource -> newTarget,
  // cycle exists if newSource is reachable from newTarget.
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

export function validateConnection(args: {
  // ✅ This allows multiple children from any node (Trigger/Audience included)
  // ✅ Still prevents cycles
  // ✅ Still prevents merging (optional rule)

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

  // only allow out -> in connections
  if (connection.sourceHandle && connection.sourceHandle !== "out") {
    return { valid: false, reason: "Connect from the bottom handle (output)" };
  }
  if (connection.targetHandle && connection.targetHandle !== "in") {
    return { valid: false, reason: "Connect to the top handle (input)" };
  }

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return { valid: false };

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
    SMS → Delay
    WhatsApp → Delay
    (two parents into one Delay)
  */
  // if (hasIncoming(edges, target)) {
  //   return { valid: false, reason: "This step already has a previous step" };
  // }

  // Prevent cycles in a branching graph
  if (createsCycle(edges, source, target)) {
    return { valid: false, reason: "This connection creates a cycle" };
  }

  return { valid: true };
}
