import type React from "react";
import { useState } from "react";
import {
  WORKFLOW_NODE_REGISTRY,
  type WorkflowNodeType,
} from "@features/workflow";
import HoverTip from "@components/ui/HoverTip";

type CategoryKey = "triggers" | "actions" | "conditions";

const CATEGORIES: Array<{
  key: CategoryKey;
  title: string;
  icon?: React.ReactNode;
  items: WorkflowNodeType[];
}> = [
  {
    key: "triggers",
    title: "TRIGGERS",
    items: ["trigger"], // later: add "scheduleTrigger", "manualTrigger" if you split them
    // For now, trigger is one node. If later you want “Webhook / Schedule / Manual Trigger” as separate nodes, we’ll add 3 trigger node types.
  },
  {
    key: "actions",
    title: "ACTIONS",
    items: ["audience", "sms", "whatsapp", "notification", "delay"],
  },
  {
    key: "conditions",
    title: "CONDITIONS",
    items: ["condition"],
  },
];

const VARIANT_TO_STYLE = {
  purple: {
    border: "border-purple-500/40",
    bg: "bg-purple-950/20",
    hover: "hover:bg-purple-950/30",
    badge: "bg-purple-500/15",
    badgeBorder: "border-purple-500/30",
    text: "text-purple-200",
  },
  blue: {
    border: "border-sky-500/40",
    bg: "bg-sky-950/20",
    hover: "hover:bg-sky-950/30",
    badge: "bg-sky-500/15",
    badgeBorder: "border-sky-500/30",
    text: "text-sky-200",
  },
  green: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-950/20",
    hover: "hover:bg-emerald-950/30",
    badge: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    text: "text-emerald-200",
  },
  orange: {
    border: "border-orange-500/40",
    bg: "bg-orange-950/20",
    hover: "hover:bg-orange-950/30",
    badge: "bg-orange-500/15",
    badgeBorder: "border-orange-500/30",
    text: "text-orange-200",
  },
  gray: {
    border: "border-zinc-600/50",
    bg: "bg-zinc-900/40",
    hover: "hover:bg-zinc-800/50",
    badge: "bg-zinc-500/15",
    badgeBorder: "border-zinc-500/30",
    text: "text-zinc-200",
  },
  yellow: {
    border: "border-yellow-500/40",
    bg: "bg-yellow-950/20",
    hover: "hover:bg-yellow-950/30",
    badge: "bg-yellow-500/15",
    badgeBorder: "border-yellow-500/30",
    text: "text-yellow-200",
  },
  red: {
    border: "border-red-500/40",
    bg: "bg-red-950/20",
    hover: "hover:bg-red-950/30",
    badge: "bg-red-500/15",
    badgeBorder: "border-red-500/30",
    text: "text-red-200",
  },
} as const;

export default function SidebarLeft() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className={`relative h-full border-r border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg hover:bg-ui-hover hover:text-ui-text"
        title={isCollapsed ? "Expand Nodes" : "Collapse Nodes"}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCollapsed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          )}
        </svg>
      </button>

      {/* Sidebar Content */}
      <div
        className={`h-full flex flex-col transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 p-3"}`}
      >
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-ui-muted">
          Steps
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-visible pr-2 custom-scrollbar">
          <div className="space-y-5">
            {CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-ui-muted">
                  {/* optional left icon bullet */}
                  <span className="inline-block h-2 w-2 rounded-full bg-ui-borderSoft" />
                  {cat.title}
                </div>

                <div className="space-y-2">
                  {cat.items.map((type) => {
                    const r = WORKFLOW_NODE_REGISTRY[type];
                    const s = VARIANT_TO_STYLE[r.variant];

                    return (
                      <HoverTip content={r.tooltip}>
                        <div
                          key={type}
                          draggable
                          onDragStart={(e) => onDragStart(e, type)}
                          className={[
                            "group relative cursor-grab rounded-xl border p-3 text-sm active:cursor-grabbing",
                            "bg-ui-card/80 backdrop-blur",
                            s.border,
                            s.bg,
                            s.hover,
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3 h-full">
                            <div
                              className={[
                                "h-9 w-9 shrink-0 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105",
                                s.badge,
                                s.badgeBorder,
                                s.text,
                              ].join(" ")}
                            >
                              {r.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-ui-text truncate">
                                {r.label}
                              </div>

                              <div className="mt-0.5 text-xs text-ui-muted truncate">
                                {r.tooltip}
                              </div>
                            </div>
                          </div>
                        </div>
                      </HoverTip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
