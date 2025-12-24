import { ReactFlowProvider } from "reactflow";
import { MainLayout } from "@layout";
import ToastRenderer from "@/components/ui/toast/ToastRenderer";

export default function App() {
  return (
    <ReactFlowProvider>
      <MainLayout />
      <ToastRenderer />
    </ReactFlowProvider>
  );
}
