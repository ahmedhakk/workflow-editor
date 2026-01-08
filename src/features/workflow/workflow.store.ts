import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import type { WorkflowEdge, WorkflowNode, WorkflowNodeType } from "@types";
import {
  validateConnection,
  validateWorkflow,
  type ValidationIssue,
} from "@features/workflow/workflow.rules";
import { serializeWorkflow } from "@features/workflow/workflow.serializer";
import { useToastStore } from "@/components/ui/toast/toast.store";
import i18n from "@/i18n";

type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];

  selectedNodeId: string | null;

  // React Flow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Selection
  selectNode: (id: string | null) => void;
  selectedEdgeId: string | null;
  selectEdge: (id: string | null) => void;

  // Helpers
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;

  addNode: (
    type: WorkflowNodeType,
    position?: { x: number; y: number }
  ) => void;
  updateNodeData: (id: string, partial: Partial<WorkflowNode["data"]>) => void;

  addNodeAtPosition: (type: string, position: { x: number; y: number }) => void;

  // Deletion
  deleteSelected: () => void;
  deleteNodeById: (id: string) => void;
  deleteEdgeById: (id: string) => void;

  // Workflow export/import
  workflowId: string;
  workflowName: string;
  workflowStatus: "draft" | "published";

  setWorkflowName: (name: string) => void;

  exportWorkflow: () => import("./workflow.serializer").WorkflowPayload;

  // ✅ Validation
  validationIssues: ValidationIssue[];
  clearValidation: () => void;
  revalidateSoon: () => void;
  validateWorkflowNow: () => { valid: boolean; issues: ValidationIssue[] };

  // Reset/load
  load: (payload: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }) => void;
};

const initialNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 120, y: 80 },
    data: { label: "Trigger" },
  },
  {
    id: "audience-1",
    type: "audience",
    position: { x: 120, y: 220 },
    data: { label: "Audience" },
  },
  {
    id: "sms-1",
    type: "sms",
    position: { x: 120, y: 360 },
    data: { label: "Send SMS" },
  },
];

const initialEdges: WorkflowEdge[] = [
  { id: "e1-2", source: "trigger-1", target: "audience-1" },
  { id: "e2-3", source: "audience-1", target: "sms-1" },
];

function makeId(type: WorkflowNodeType) {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`;
}

let revalidateTimer: number | null = null;
function scheduleRevalidate(fn: () => void, delay = 250) {
  if (revalidateTimer) window.clearTimeout(revalidateTimer);
  revalidateTimer = window.setTimeout(() => {
    revalidateTimer = null;
    fn();
  }, delay);
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,

  workflowId: "wf-local-1",
  workflowName: "My Workflow",
  workflowStatus: "draft",

  // ✅ validation state
  validationIssues: [],
  clearValidation: () => set({ validationIssues: [] }),
  revalidateSoon: () => {
    scheduleRevalidate(() => {
      const { nodes, edges } = get();
      const res = validateWorkflow({ nodes, edges });
      set({ validationIssues: res.issues });
    }, 250);
  },
  validateWorkflowNow: () => {
    const { nodes, edges } = get();
    const res = validateWorkflow({ nodes, edges });
    set({ validationIssues: res.issues });
    return res;
  },

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => {
      const result = validateConnection({
        connection,
        nodes: state.nodes,
        edges: state.edges,
      });

      if (!result.valid) {
        if (result.reasonKey) {
          const message = i18n.t(result.reasonKey, result.reasonParams);
          useToastStore.getState().error(message);
        }
        return state;
      }

      const nextEdges = addEdge(
        {
          ...connection,
          id: `e-${crypto.randomUUID().slice(0, 8)}`,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 },
        },
        state.edges
      );

      // ✅ trigger revalidation after state updates
      queueMicrotask(() => get().revalidateSoon());

      return { edges: nextEdges };
    }),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (type, position) => {
    if (type === "trigger") {
      const triggerCount = get().nodes.filter(
        (n) => n.type === "trigger"
      ).length;
      if (triggerCount >= 1) {
        useToastStore.getState().error("Only one Trigger is allowed");
        return;
      }
    }

    const id = makeId(type);
    const pos = position ?? { x: 300, y: 200 };

    const labelMap: Record<WorkflowNodeType, string> = {
      trigger: "Trigger",
      audience: "Audience",
      condition: "IF / ELSE",
      sms: "Send SMS",
      whatsapp: "Send WhatsApp",
      delay: "Delay",
      notification: "Send Notification",
    };

    const newNode: WorkflowNode = {
      id,
      type,
      position: pos,
      data: { label: labelMap[type], config: {} },
    };

    set((state) => ({ nodes: [...state.nodes, newNode] }));

    // re-validate on edits
    get().revalidateSoon();
  },

  updateNodeData: (id, partial) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...partial } } : n
      ),
    }));

    // re-validate on edits
    get().revalidateSoon();
  },

  addNodeAtPosition: (type, position) => {
    if (type === "trigger") {
      const triggerCount = get().nodes.filter(
        (n) => n.type === "trigger"
      ).length;
      if (triggerCount >= 1) {
        useToastStore.getState().error("Only one Trigger is allowed");
        return;
      }
    }

    // re-validate on edits
    get().revalidateSoon();

    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`;

    const labelMap: Record<string, string> = {
      trigger: "Trigger",
      audience: "Audience",
      condition: "IF / ELSE",
      sms: "Send SMS",
      whatsapp: "Send WhatsApp",
      notification: "Send Notification",
      delay: "Delay",
    };

    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id,
          type,
          position,
          data: {
            label: labelMap[type] ?? type,
            config: {},
          },
        },
      ],
    }));

    // re-validate on edits
    get().revalidateSoon();
  },

  deleteEdgeById: (id) => {
    get().revalidateSoon();

    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
    }));
  },

  deleteNodeById: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));

    get().revalidateSoon();
  },

  deleteSelected: () => {
    const { selectedNodeId, selectedEdgeId } = get();
    if (selectedNodeId) get().deleteNodeById(selectedNodeId);
    else if (selectedEdgeId) get().deleteEdgeById(selectedEdgeId);

    get().revalidateSoon();
  },

  setWorkflowName: (name) => set({ workflowName: name }),

  exportWorkflow: () => {
    const { workflowId, workflowName, workflowStatus, nodes, edges } = get();
    return serializeWorkflow({
      id: workflowId,
      name: workflowName,
      status: workflowStatus,
      version: 1,
      nodes,
      edges,
    });
  },

  load: ({ nodes, edges }) =>
    set({
      nodes,
      edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      validationIssues: [],
    }),
}));
