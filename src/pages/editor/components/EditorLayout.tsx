import { Header } from "@layout";
import { WorkflowCanvas } from "@pages/editor/components";
import { NodePalette } from "./NodePalette";
import { PropertiesPanel } from "./PropertiesPanel";

export default function EditorLayout() {
  return (
    <div className="h-screen w-screen bg-ui-canvas text-ui-text overflow-hidden">
      <Header />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left - Node Palette */}
        <NodePalette />

        <main className="flex-1 bg-ui-canvas relative">
          <WorkflowCanvas />
        </main>

        {/* Right - Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
