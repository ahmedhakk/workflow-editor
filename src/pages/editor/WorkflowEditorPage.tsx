import { useEffect, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTranslation } from "react-i18next";
import { getWorkflow } from "@/services/workflows.local";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { EditorLayout } from "./components";

export default function WorkflowEditorPage() {
  const { id } = useParams();
  const load = useWorkflowStore((s) => s.load);
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

    // store has load() which expects workflow metadata + nodes/edges
    load({
      id: doc.id,
      name: doc.name,
      status: doc.status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: doc.nodes as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      edges: doc.edges as any,
    });
  }, [id, doc, load]);

  // Redirect if no id or workflow not found
  if (!id || !doc) return <Navigate to="/workflows" replace />;

  return (
    <ReactFlowProvider>
      <EditorLayout />
    </ReactFlowProvider>
  );
}
