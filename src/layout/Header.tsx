import { User, Save, Play } from "lucide-react";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { useToastStore } from "@/components/ui/toast/toast.store";

export default function Header() {
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const showToast = useToastStore((s) => s.success);

  const onSave = async () => {
    const payload = exportWorkflow();

    // 1) log it
    console.log("WORKFLOW JSON", payload);

    // 2) copy to clipboard (super useful for testing backend)
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

    showToast("Saved! JSON copied to clipboard");
  };

  return (
    <header className="h-14 border-b border-ui-border bg-ui-panel">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* https://dreams.com.sa/site/images/logo-white.png */}
          <img
            src="/src/assets/logo-white.png"
            className="w-auto h-6"
            alt="Dreams Logo"
          />
          <div className="leading-tight border-l border-ui-text2 pl-3">
            <div className="text-sm font-semibold">Workflows</div>
            <div className="text-xs text-ui-muted">Draft • Not published</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-ui-border bg-ui-card px-3 py-1.5 text-sm hover:bg-ui-hover cursor-pointer"
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          <button className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white">
            <Play className="h-4 w-4" />
            Run test
          </button>

          <button className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui-border bg-ui-card hover:bg-ui-hover">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
