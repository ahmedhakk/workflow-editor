import { User, Save, Play } from "lucide-react";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useToastStore } from "@components/toast/toast.store";

export default function Header() {
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const showToast = useToastStore((s) => s.show);

  const onSave = async () => {
    const payload = exportWorkflow();

    // 1) log it
    console.log("WORKFLOW JSON", payload);

    // 2) copy to clipboard (super useful for testing backend)
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

    showToast("Saved! JSON copied to clipboard");
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-800" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Workflows</div>
            <div className="text-xs text-zinc-400">Draft • Not published</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-800 cursor-pointer"
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          <button className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white">
            <Play className="h-4 w-4" />
            Run test
          </button>

          <button className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
