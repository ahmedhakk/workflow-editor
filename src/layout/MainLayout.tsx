import { Header, SidebarLeft, SidebarRight } from "@layout";
import { WorkflowCanvas } from "@features/workflow";

export default function MainLayout() {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100">
      <Header />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left */}
        <aside className="w-72 border-r border-zinc-800 bg-zinc-950">
          <SidebarLeft />
        </aside>

        {/* Center */}
        <main className="flex-1 bg-zinc-950 relative">
          <WorkflowCanvas />
        </main>

        {/* Right */}
        <aside className="w-80 border-l border-zinc-800 bg-zinc-950">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}
