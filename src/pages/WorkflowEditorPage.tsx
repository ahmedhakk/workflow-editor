// src/pages/WorkflowEditorPage.tsx
import { useEffect, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { MainLayout } from "@layout";
import { getWorkflow } from "@/services/workflows.local";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import ToastRenderer from "@/components/ui/toast/ToastRenderer";
import { useTranslation } from "react-i18next";

export default function WorkflowEditorPage() {
  const { id } = useParams();
  const load = useWorkflowStore((s) => s.load);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = id
      ? t("editor.metadata.editingTitle", { id })
      : t("editor.metadata.mainTitle");
  }, [id, t]);

  // Check if workflow exists synchronously before rendering
  const doc = useMemo(() => (id ? getWorkflow(id) : null), [id]);

  useEffect(() => {
    if (!id || !doc) return;

    // store has load() which expects nodes/edges in reactflow shape
    // our payload already matches serializer output
    setNodes(doc.nodes as any);
    setEdges(doc.edges as any);
    load({ nodes: doc.nodes as any, edges: doc.edges as any });
  }, [id, doc, load, setNodes, setEdges]);

  // Redirect if no id or workflow not found
  if (!id || !doc) return <Navigate to="/workflows" replace />;

  return (
    <ReactFlowProvider>
      <MainLayout />
      <ToastRenderer />
    </ReactFlowProvider>
  );
}
