import { Routes, Route, Navigate } from "react-router-dom";
import { WorkflowsPage, WorkflowEditorPage, PageNotFound } from "@pages";
import ToastRenderer from "@components/ui/toast/ToastRenderer";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/workflows" replace />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/workflows/:id" element={<WorkflowEditorPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <ToastRenderer />
    </>
  );
}
