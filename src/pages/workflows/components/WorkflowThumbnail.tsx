import { useMemo } from "react";
import type { WorkflowPayload } from "@features/workflow/workflow.serializer";
import type { WorkflowNodeType } from "@features/workflow/workflow.registry";

type Props = {
  workflow: WorkflowPayload;
  className?: string;
};

const NODE_COLORS: Record<WorkflowNodeType, string> = {
  trigger: "#a855f7",
  audience: "#0ea5e9",
  whatsapp: "#22c55e",
  sms: "#f97316",
  delay: "#71717a",
  condition: "#ef4444",
  notification: "#eab308",
};

const NODE_BG_COLORS: Record<WorkflowNodeType, string> = {
  trigger: "rgba(168, 85, 247, 0.15)",
  audience: "rgba(14, 165, 233, 0.15)",
  whatsapp: "rgba(34, 197, 94, 0.15)",
  sms: "rgba(249, 115, 22, 0.15)",
  delay: "rgba(113, 113, 122, 0.15)",
  condition: "rgba(239, 68, 68, 0.15)",
  notification: "rgba(234, 179, 8, 0.15)",
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 44;
const PADDING = 30;
const ICON_SIZE = 16;
const FONT_SIZE = 10;

// Helper to truncate long labels
function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + "…";
}

// SVG icons for each node type (simplified versions)
function NodeIcon({
  type,
  size,
  color,
}: {
  type: WorkflowNodeType;
  size: number;
  color: string;
}) {
  const iconProps = {
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "trigger":
      // Zap/Lightning icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "audience":
      // Users icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "whatsapp":
      // Message circle icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "sms":
      // Message square text icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="12" y2="13" />
        </svg>
      );
    case "delay":
      // Clock icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "condition":
      // Git branch icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      );
    case "notification":
      // Bell icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WorkflowThumbnail({ workflow, className = "" }: Props) {
  const { viewBox, nodes, edges } = useMemo(() => {
    if (!workflow.nodes?.length) {
      return { viewBox: "0 0 100 100", nodes: [], edges: [] };
    }

    // Calculate bounds
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const node of workflow.nodes) {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
      maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
    }

    // Add padding
    minX -= PADDING;
    minY -= PADDING;
    maxX += PADDING;
    maxY += PADDING;

    const width = maxX - minX;
    const height = maxY - minY;

    // Transform nodes to normalized coordinates
    const normalizedNodes = workflow.nodes.map((node) => ({
      id: node.id,
      x: node.position.x - minX,
      y: node.position.y - minY,
      type: node.type,
      label: node.data?.label || node.type,
      color: NODE_COLORS[node.type] || "#71717a",
      bgColor: NODE_BG_COLORS[node.type] || "rgba(113, 113, 122, 0.15)",
    }));

    // Create node position map for edges (connect from right to left, like the canvas)
    const nodeMap = new Map(
      normalizedNodes.map((n) => [
        n.id,
        {
          x: n.x + NODE_WIDTH / 2,
          y: n.y + NODE_HEIGHT / 2,
          right: n.x + NODE_WIDTH, // source handle position
          left: n.x, // target handle position
        },
      ])
    );

    // Transform edges
    const normalizedEdges = workflow.edges
      .map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        // Get source node for color and type
        const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
        const isConditionSource = sourceNode?.type === "condition";

        // Determine edge color based on condition branch or source node
        let edgeColor =
          NODE_COLORS[sourceNode?.type as WorkflowNodeType] || "#71717a";

        // Override color for condition branches
        if (isConditionSource && edge.sourceHandle) {
          if (edge.sourceHandle === "yes" || edge.sourceHandle === "if") {
            edgeColor = "#22c55e"; // green for yes/if
          } else if (
            edge.sourceHandle === "no" ||
            edge.sourceHandle === "else"
          ) {
            edgeColor = "#ef4444"; // red for no/else
          }
        }

        let startY = source.y;
        const startX = source.right; // Connect from right side

        // Adjust for condition node handles (yes/no branches)
        if (isConditionSource && edge.sourceHandle) {
          if (edge.sourceHandle === "yes" || edge.sourceHandle === "if") {
            startY = source.y - NODE_HEIGHT / 4;
          } else if (
            edge.sourceHandle === "no" ||
            edge.sourceHandle === "else"
          ) {
            startY = source.y + NODE_HEIGHT / 4;
          }
        }

        return {
          id: edge.id,
          x1: startX,
          y1: startY,
          x2: target.left, // Connect to left side
          y2: target.y,
          color: edgeColor,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    }>;

    return {
      viewBox: `0 0 ${width} ${height}`,
      nodes: normalizedNodes,
      edges: normalizedEdges,
    };
  }, [workflow]);

  if (!workflow.nodes?.length) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center text-ui-muted ${className}`}
      >
        <span className="text-xs opacity-50">Empty workflow</span>
      </div>
    );
  }

  return (
    <svg
      viewBox={viewBox}
      className={`w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Definitions for gradients, patterns, filters */}
      <defs>
        {/* Grid pattern */}
        <pattern
          id="thumbnail-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.04)" />
        </pattern>

        {/* Drop shadow filter */}
        <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>

        {/* Arrow markers for each color */}
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <marker
            key={`arrow-${type}`}
            id={`arrow-${color.replace("#", "")}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} fillOpacity="0.8" />
          </marker>
        ))}

        {/* Additional arrow markers for condition branches */}
        <marker
          key="arrow-green-if"
          id="arrow-22c55e"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" fillOpacity="0.8" />
        </marker>
        <marker
          key="arrow-red-else"
          id="arrow-ef4444"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" fillOpacity="0.8" />
        </marker>

        {/* Glow effect for nodes */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="100%" height="100%" fill="url(#thumbnail-grid)" />

      {/* Edges with dashed arrows - horizontal connections */}
      {edges.map((edge) => {
        // Horizontal bezier curve (like the canvas)
        const midX = (edge.x1 + edge.x2) / 2;
        const path = `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`;
        const markerId = `arrow-${edge.color.replace("#", "")}`;

        return (
          <g key={edge.id}>
            {/* Edge glow */}
            <path
              d={path}
              stroke={edge.color}
              strokeWidth="5"
              strokeOpacity="0.1"
              fill="none"
              strokeLinecap="round"
            />
            {/* Main edge - dashed */}
            <path
              d={path}
              stroke={edge.color}
              strokeWidth="2"
              strokeOpacity="0.7"
              strokeDasharray="6 4"
              fill="none"
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
            />
          </g>
        );
      })}

      {/* Nodes - styled like canvas nodes */}
      {nodes.map((node) => (
        <g key={node.id} filter="url(#node-shadow)">
          {/* Node outer glow ring */}
          <rect
            x={node.x - 2}
            y={node.y - 2}
            width={NODE_WIDTH + 4}
            height={NODE_HEIGHT + 4}
            rx="14"
            fill="none"
            stroke={node.color}
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Node main background - dark like canvas */}
          <rect
            x={node.x}
            y={node.y}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx="12"
            fill="#09090b"
            stroke={node.color}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* Inner subtle gradient overlay */}
          <rect
            x={node.x}
            y={node.y}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx="12"
            fill={node.bgColor}
            opacity="0.5"
          />

          {/* Icon container box */}
          <rect
            x={node.x + 8}
            y={node.y + (NODE_HEIGHT - 26) / 2}
            width="26"
            height="26"
            rx="8"
            fill={node.bgColor}
            stroke={node.color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />

          {/* Node icon */}
          <g
            transform={`translate(${node.x + 8 + (26 - ICON_SIZE) / 2}, ${node.y + (NODE_HEIGHT - ICON_SIZE) / 2})`}
          >
            <NodeIcon type={node.type} size={ICON_SIZE} color={node.color} />
          </g>

          {/* Node label */}
          <text
            x={node.x + 40}
            y={node.y + NODE_HEIGHT / 2 - 2}
            fill="rgba(255,255,255,0.95)"
            fontSize={FONT_SIZE}
            fontWeight="600"
            fontFamily="system-ui, -apple-system, sans-serif"
            dominantBaseline="central"
          >
            {truncateLabel(node.label, 9)}
          </text>

          {/* Subtitle hint */}
          <text
            x={node.x + 40}
            y={node.y + NODE_HEIGHT / 2 + 10}
            fill="rgba(255,255,255,0.4)"
            fontSize={FONT_SIZE - 2}
            fontFamily="system-ui, -apple-system, sans-serif"
            dominantBaseline="central"
          >
            {node.type}
          </text>

          {/* Left handle (target) */}
          <circle
            cx={node.x}
            cy={node.y + NODE_HEIGHT / 2}
            r="4"
            fill="#09090b"
            stroke={node.color}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Right handle (source) */}
          <circle
            cx={node.x + NODE_WIDTH}
            cy={node.y + NODE_HEIGHT / 2}
            r="4"
            fill="#09090b"
            stroke={node.color}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </g>
      ))}
    </svg>
  );
}
