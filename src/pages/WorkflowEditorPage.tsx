// src/pages/WorkflowEditorPage.tsx
import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { MainLayout } from "@layout";
import { getWorkflow, createWorkflowSeed } from "@/services/workflows.local";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import ToastRenderer from "@/components/ui/toast/ToastRenderer";

export default function WorkflowEditorPage() {
  const { id } = useParams();
  const load = useWorkflowStore((s) => s.load);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);

  useEffect(() => {
    if (!id) return;

    const doc = getWorkflow(id) ?? createWorkflowSeed({ name: "New workflow" });

    // store has load() which expects nodes/edges in reactflow shape
    // our payload already matches serializer output
    setNodes(doc.nodes as any);
    setEdges(doc.edges as any);
    load({ nodes: doc.nodes as any, edges: doc.edges as any });
  }, [id, load, setNodes, setEdges]);

  if (!id) return <Navigate to="/workflows" replace />;

  return (
    <ReactFlowProvider>
      <MainLayout />
      <ToastRenderer />
    </ReactFlowProvider>
  );
}
