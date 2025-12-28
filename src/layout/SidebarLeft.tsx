import type React from "react";
import { useState } from "react";
import {
  WORKFLOW_NODE_REGISTRY,
  type WorkflowNodeType,
} from "@features/workflow";
import HoverTip from "@components/ui/HoverTip";

const NODE_TYPES: WorkflowNodeType[] = [
  "trigger",
  "audience",
  "condition",
  "sms",
  "whatsapp",
  "notification",
  "delay",
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
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ui-muted">
          Steps
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {NODE_TYPES.map((type) => {
            const r = WORKFLOW_NODE_REGISTRY[type];
            const s = VARIANT_TO_STYLE[r.variant];

            return (
              <div
                key={type}
                draggable
                title={r.tooltip} // ✅ tooltip
                onDragStart={(e) => onDragStart(e, type)}
                className={[
                  "group cursor-grab rounded-xl border p-3 text-sm active:cursor-grabbing",
                  "bg-ui-card/80 backdrop-blur",
                  s.border,
                  s.bg,
                  s.hover,
                ].join(" ")}
              >
                <HoverTip content={r.tooltip} />

                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "h-9 w-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105",
                      s.badge,
                      s.badgeBorder,
                      s.text,
                    ].join(" ")}
                  >
                    {r.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ui-text">
                        {r.label}
                      </span>
                      <span className={["text-xs", s.text].join(" ")}>
                        {type}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-ui-muted">
                      Drag to canvas
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
