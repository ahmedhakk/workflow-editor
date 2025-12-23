const NODE_TYPES = [
  { type: "trigger", label: "Trigger" },
  { type: "audience", label: "Audience" },
  { type: "sms", label: "Send SMS" },
  { type: "whatsapp", label: "Send WhatsApp" },
  { type: "delay", label: "Delay" },
];

export default function SidebarLeft() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-3">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Steps
      </div>

      <div className="space-y-2">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="cursor-grab rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm hover:bg-zinc-800 active:cursor-grabbing"
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
}
