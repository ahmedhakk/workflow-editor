import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  MarkerType,
  type Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { nodeTypes } from "@features/workflow/nodes";
import { validateConnection } from "@features/workflow/workflow.rules";

const EDGE_COLOR_BY_TYPE: Record<string, string> = {
  trigger: "rgb(168, 85, 247)", // purple-500
  audience: "rgb(14, 165, 233)", // sky-500
  whatsapp: "rgb(16, 185, 129)", // emerald-500
  sms: "rgb(249, 115, 22)", // orange-500
  notification: "rgb(202, 138, 4)", // yellow-600
  delay: "rgb(113, 113, 122)", // zinc-500
};

const CONDITION_EDGE_COLORS = {
  if: "rgb(16, 185, 129)", // emerald-500 (green)
  else: "rgb(239, 68, 68)", // red-500
};

// const EDGE_TYPES = ["smoothstep", "bezier", "step", "straight"] as const;

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);

  const addNodeAtPosition = useWorkflowStore((s) => s.addNodeAtPosition);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);
  const deleteSelected = useWorkflowStore((s) => s.deleteSelected);

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNodeAtPosition(type, position);
    },
    [addNodeAtPosition, screenToFlowPosition]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // don’t delete while typing in inputs/textareas
      const target = e.target as HTMLElement;
      const tag = target.tagName?.toLowerCase();
      const isTyping =
        tag === "input" || tag === "textarea" || target.isContentEditable;

      if (isTyping) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
    },
    [deleteSelected]
  );

  const isValidConnection = useCallback(
    (connection: Connection) =>
      validateConnection({ connection, nodes, edges }).valid,
    [nodes, edges]
  );

  const nodesById = useMemo(() => {
    const m = new Map<string, any>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  const decoratedEdges = useMemo(() => {
    return edges.map((e) => {
      let stroke = "rgb(113, 113, 122)"; // default gray

      const sourceNode = nodesById.get(e.source);

      // ✅ Special case: condition node
      if (sourceNode?.type === "condition") {
        if (e.sourceHandle === "if") {
          stroke = CONDITION_EDGE_COLORS.if;
        } else if (e.sourceHandle === "else") {
          stroke = CONDITION_EDGE_COLORS.else;
        }
      }
      // ✅ Normal nodes: color by source node type
      else if (sourceNode?.type) {
        stroke = EDGE_COLOR_BY_TYPE[sourceNode.type] ?? "rgb(113, 113, 122)";
      }

      return {
        ...e,
        style: {
          ...(e.style ?? {}),
          stroke,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: stroke,
        },
      };
    });
  }, [edges, nodesById]);

  return (
    <div
      className="relative h-full w-full outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={decoratedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={(_, node) => selectNode(node.id)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
        }}
        fitView
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 },
          // type: EDGE_TYPES[0],
        }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
