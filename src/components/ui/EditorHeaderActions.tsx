import { User, Save, Play } from "lucide-react";

export default function EditorHeaderActions({
  onSave,
}: {
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-ui-border bg-ui-card px-3 py-1.5 text-sm hover:bg-ui-hover cursor-pointer"
        onClick={onSave}
      >
        <Save className="h-4 w-4" />
        Save
      </button>

      <button className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white cursor-pointer">
        <Play className="h-4 w-4" />
        Run test
      </button>

      <button className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui-border bg-ui-card hover:bg-ui-hover cursor-pointer">
        <User className="h-4 w-4" />
      </button>
    </div>
  );
}
