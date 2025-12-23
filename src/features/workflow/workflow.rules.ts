import type { Connection, Edge, Node } from "reactflow";

const ALLOWED_NEXT: Record<string, string[]> = {
  trigger: ["audience"],
  audience: ["delay", "sms", "whatsapp"],
  delay: ["delay", "sms", "whatsapp"], // allow multiple delays
  sms: ["delay"], // if you want only delay after message
  whatsapp: ["delay"],
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

function createsCycle(edges: Edge[], source: string, target: string) {
  const visited = new Set<string>();
  let current = source;

  while (true) {
    if (visited.has(current)) return true; // already visited => cycle exists
    visited.add(current);

    const next = edges.find((e) => e.source === current);
    if (!next) return false;

    if (next.target === target) return true;
    current = next.target;
  }
}

export function validateLinearConnection(args: {
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

  const allowed = ALLOWED_NEXT[sourceNode.type ?? ""] ?? [];
  if (!allowed.includes(targetNode.type ?? "")) {
    return { valid: false, reason: "This step cannot connect to that step" };
  }

  if (targetNode.type === "trigger")
    return { valid: false, reason: "Trigger must be the first step" };

  if (hasOutgoing(edges, source))
    return { valid: false, reason: "This step already has a next step" };

  if (hasIncoming(edges, target))
    return { valid: false, reason: "This step already has a previous step" };

  if (sourceNode.type === "trigger" && targetNode.type !== "audience")
    return { valid: false, reason: "Trigger must connect to Audience first" };

  if (createsCycle(edges, target, source))
    return { valid: false, reason: "This connection creates a cycle" };

  return { valid: true };
}
