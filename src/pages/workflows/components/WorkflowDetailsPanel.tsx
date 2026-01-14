import { useTranslation } from "react-i18next";
import {
  PanelRightOpen,
  PanelRightClose,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { IconButton } from "@components/ui";
import { useLanguage } from "@hooks";
import type { WorkflowListItem } from "@/services/workflows.local";
import type { TabKey } from "../types";
import OverviewTab from "./tabs/OverviewTab";
import SettingsTab from "./tabs/SettingsTab";
import ActivityTab from "./tabs/ActivityTab";

interface WorkflowDetailsPanelProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedWorkflow: WorkflowListItem | null;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenWorkflow: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onStatusChange: (id: string, status: "draft" | "published") => void;
}

export default function WorkflowDetailsPanel({
  collapsed,
  onToggleCollapse,
  selectedWorkflow,
  activeTab,
  onTabChange,
  onOpenWorkflow,
  onDuplicate,
  onDelete,
  onRename,
  onStatusChange,
}: WorkflowDetailsPanelProps) {
  const { isArabic } = useLanguage();

  return (
    <aside
      className={[
        "border-l border-ui-border bg-ui-panel overflow-hidden",
        collapsed ? "w-14" : "w-90",
        "transition-[width] duration-200",
      ].join(" ")}
    >
      {/* Header */}
      <DetailsPanelHeader
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        isArabic={isArabic}
      />

      {/* Content */}
      {!collapsed && (
        <div className="overflow-auto h-[calc(100vh-56px-56px)]">
          {!selectedWorkflow ? (
            <EmptySelection />
          ) : (
            <DetailsPanelContent
              workflow={selectedWorkflow}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onOpen={() => onOpenWorkflow(selectedWorkflow.id)}
              onDuplicate={() => onDuplicate(selectedWorkflow.id)}
              onDelete={() => onDelete(selectedWorkflow.id)}
              onRename={(name) => onRename(selectedWorkflow.id, name)}
              onStatusChange={(status) =>
                onStatusChange(selectedWorkflow.id, status)
              }
            />
          )}
        </div>
      )}
    </aside>
  );
}

// Sub-components

interface DetailsPanelHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isArabic: boolean;
}

function DetailsPanelHeader({
  collapsed,
  onToggleCollapse,
  isArabic,
}: DetailsPanelHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="h-14 px-3 flex items-center justify-between border-b border-ui-border">
      {!collapsed && (
        <div>
          <div className="text-sm font-semibold">{t("workflows.details")}</div>
          <div className="text-xs text-ui-muted">
            {t("workflows.selectFromGrid")}
          </div>
        </div>
      )}

      <IconButton
        onClick={onToggleCollapse}
        label={collapsed ? "Open details" : "Collapse details"}
        icon={
          collapsed ? (
            isArabic ? (
              <PanelRightClose className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
            ) : (
              <PanelRightOpen className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
            )
          ) : isArabic ? (
            <PanelRightOpen className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
          ) : (
            <PanelRightClose className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
          )
        }
        className="group"
      />
    </div>
  );
}

function EmptySelection() {
  const { t } = useTranslation();

  return (
    <div className="p-4 text-sm text-ui-muted">
      {t("workflows.noWorkflowSelected")}
    </div>
  );
}

interface DetailsPanelContentProps {
  workflow: WorkflowListItem;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  onStatusChange: (status: "draft" | "published") => void;
}

function DetailsPanelContent({
  workflow,
  activeTab,
  onTabChange,
  onOpen,
  onDuplicate,
  onDelete,
  onRename,
  onStatusChange,
}: DetailsPanelContentProps) {
  return (
    <div className="p-4">
      {/* Header with workflow info */}
      <WorkflowHeader workflow={workflow} onOpen={onOpen} />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab
          workflow={workflow}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}

      {activeTab === "settings" && (
        <SettingsTab
          workflow={workflow}
          onRename={onRename}
          onStatusChange={onStatusChange}
        />
      )}

      {activeTab === "activity" && <ActivityTab />}
    </div>
  );
}

interface WorkflowHeaderProps {
  workflow: WorkflowListItem;
  onOpen: () => void;
}

function WorkflowHeader({ workflow, onOpen }: WorkflowHeaderProps) {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  const badgeClass =
    workflow.status === "published"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
      : "bg-zinc-500/15 text-zinc-200 border-zinc-500/30";

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-base font-semibold line-clamp-2">
          {workflow.name}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={[
              "inline-flex items-center rounded-md border px-2 py-1 text-[11px]",
              badgeClass,
            ].join(" ")}
          >
            {workflow.status}
          </span>
          <span className="text-xs text-ui-muted">
            Updated {new Date(workflow.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="shrink-0 inline-flex items-center gap-2 rounded-md border border-ui-border cursor-pointer bg-ui-card px-3 py-1.5 text-sm hover:bg-ui-hover"
      >
        {t("common.open")}
        {isArabic ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: t("workflows.overview") },
    { key: "settings", label: t("common.settings") },
    { key: "activity", label: t("workflows.activity") },
  ];

  return (
    <div className="mt-4 flex gap-2 border-b border-ui-border pb-3">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={[
            "rounded-md px-3 py-1.5 text-sm border cursor-pointer",
            activeTab === key
              ? "border-white/20 bg-ui-card"
              : "border-ui-border bg-transparent hover:bg-ui-hover",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
