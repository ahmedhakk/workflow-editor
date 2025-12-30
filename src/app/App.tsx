import { Routes, Route, Navigate } from "react-router-dom";
import WorkflowsPage from "@/pages/WorkflowsPage";
import WorkflowEditorPage from "@/pages/WorkflowEditorPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workflows" replace />} />
      <Route path="/workflows" element={<WorkflowsPage />} />
      <Route path="/workflows/:id" element={<WorkflowEditorPage />} />
    </Routes>
  );
}
