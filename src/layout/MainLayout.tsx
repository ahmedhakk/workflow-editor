import { Header, SidebarLeft, SidebarRight } from "@layout";
import { WorkflowCanvas } from "@features/workflow";

export default function MainLayout() {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Header />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left */}
        <SidebarLeft />

        {/* Center */}
        <main className="flex-1 bg-zinc-950 relative">
          <WorkflowCanvas />
        </main>

        {/* Right */}
        <SidebarRight />
      </div>
    </div>
  );
}
