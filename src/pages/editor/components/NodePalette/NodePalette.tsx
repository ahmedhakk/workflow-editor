import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  WORKFLOW_NODE_REGISTRY,
  type WorkflowNodeType,
} from "@features/workflow";
import { HoverTip } from "@components/ui";
import { Layers, Zap, Boxes, GitBranch } from "lucide-react";
import { VARIANT_TO_STYLE, type CategoryKey } from "./styles";
import SidebarToggle from "../shared/SidebarToggle";

export default function NodePalette() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  const CATEGORIES: Array<{
    key: CategoryKey;
    titleKey: string;
    icon?: React.ReactNode;
    titleClass: string;
    items: WorkflowNodeType[];
  }> = [
    {
      key: "triggers",
      titleKey: "canvas.categories.triggers",
      items: ["trigger"],
      icon: <Zap className="h-4 w-4" />,
      titleClass: "text-purple-400",
    },
    {
      key: "actions",
      titleKey: "canvas.categories.actions",
      icon: <Boxes className="h-4 w-4" />,
      titleClass: "text-sky-300",
      items: ["audience", "sms", "whatsapp", "notification", "delay"],
    },
    {
      key: "conditions",
      titleKey: "canvas.categories.conditions",
      icon: <GitBranch className="h-4 w-4" />,
      titleClass: "text-emerald-300",
      items: ["condition"],
    },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className={`relative h-full border-r border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
    >
      <SidebarToggle
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        position="left"
        expandLabel={t("canvas.expandNodes")}
        collapseLabel={t("canvas.collapseNodes")}
      />

      {/* Sidebar Content */}
      <div
        className={`h-full flex flex-col transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 p-3"}`}
      >
        <div className="mb-3 pb-3 px-1 border-b border-ui-muted">
          <div className="flex items-center gap-2 text-lg font-semibold text-ui-text">
            <Layers className="h-4 w-4 text-purple-400" />
            {t("canvas.nodes")}
          </div>
          <div className="mt-1 text-xs text-ui-muted">
            {t("canvas.dragNodesToCanvas")}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-visible pr-2 custom-scrollbar">
          <div className="space-y-5">
            {CATEGORIES.map((cat) => (
              <NodeCategory
                key={cat.key}
                category={cat}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// Sub-components

interface NodeCategoryProps {
  category: {
    key: CategoryKey;
    titleKey: string;
    icon?: React.ReactNode;
    titleClass: string;
    items: WorkflowNodeType[];
  };
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

function NodeCategory({ category, onDragStart }: NodeCategoryProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div
        className={[
          "mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider",
          category.titleClass,
        ].join(" ")}
      >
        {category.icon}
        {t(category.titleKey)}
      </div>

      <div className="space-y-2">
        {category.items.map((type) => (
          <DraggableNode key={type} type={type} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}

interface DraggableNodeProps {
  type: WorkflowNodeType;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

function DraggableNode({ type, onDragStart }: DraggableNodeProps) {
  const { t } = useTranslation();
  const registry = WORKFLOW_NODE_REGISTRY[type];
  const style = VARIANT_TO_STYLE[registry.variant];

  return (
    <HoverTip content={t(registry.tooltipKey)}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, type)}
        className={[
          "group relative cursor-grab rounded-xl border p-3 text-sm active:cursor-grabbing",
          "bg-ui-card/80 backdrop-blur",
          style.border,
          style.bg,
          style.hover,
        ].join(" ")}
      >
        <div className="flex items-center gap-3 h-full">
          <div
            className={[
              "h-9 w-9 shrink-0 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105",
              style.badge,
              style.badgeBorder,
              style.text,
            ].join(" ")}
          >
            {registry.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ui-text truncate">
              {t(registry.labelKey)}
            </div>
            <div className="mt-0.5 text-xs text-ui-muted truncate">
              {t(registry.tooltipKey)}
            </div>
          </div>
        </div>
      </div>
    </HoverTip>
  );
}
