import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Workflow,
  BookOpen,
  Star,
  Users,
  User,
} from "lucide-react";
import { UserMenu, IconButton } from "@components/ui";
import { useLanguage } from "@hooks";
import { useToastStore } from "@/components/ui/toast/toast.store";
import type { NavItem } from "../types";

interface WorkflowLeftSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function WorkflowLeftSidebar({
  collapsed,
  onToggleCollapse,
}: WorkflowLeftSidebarProps) {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const showToast = useToastStore((s) => s.success);

  const navItems: NavItem[] = [
    {
      key: "workflows",
      label: t("workflows.title"),
      icon: Workflow,
      active: true,
      onClick: () => nav("/workflows"),
    },
    {
      key: "projects",
      label: t("sidebar.allProjects"),
      icon: LayoutGrid,
      onClick: () => showToast(t("toasts.allProjectsLater")),
    },
    {
      key: "starred",
      label: t("sidebar.starred"),
      icon: Star,
      onClick: () => showToast(t("toasts.starredLater")),
    },
    {
      key: "shared",
      label: t("sidebar.sharedWithMe"),
      icon: Users,
      onClick: () => showToast(t("toasts.sharedLater")),
    },
    {
      key: "learn",
      label: t("sidebar.learn"),
      icon: BookOpen,
      onClick: () => showToast(t("toasts.learnLater")),
    },
  ];

  return (
    <aside
      className={[
        "relative border-r border-ui-border bg-ui-panel",
        collapsed ? "w-16" : "w-64",
        "transition-[width] duration-200",
      ].join(" ")}
    >
      <div className="h-full flex flex-col">
        {/* Workspace header */}
        <WorkspaceHeader
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          isArabic={isArabic}
        />

        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavButton key={item.key} item={item} collapsed={collapsed} />
            ))}
          </div>
        </nav>

        {/* User section */}
        <UserSection collapsed={collapsed} isArabic={isArabic} />
      </div>
    </aside>
  );
}

// Sub-components for better organization

interface WorkspaceHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isArabic: boolean;
}

function WorkspaceHeader({
  collapsed,
  onToggleCollapse,
  isArabic,
}: WorkspaceHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="h-14 px-3 flex items-center justify-between border-b border-ui-border">
      <div className="flex items-center gap-2 min-w-0">
        {!collapsed && (
          <>
            <div className="h-9 w-9 rounded-xl bg-ui-card border border-ui-border flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold">D</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {t("sidebar.dreamsWorkspace")}
              </div>
              <div className="text-xs text-ui-muted truncate">
                {t("sidebar.allProjects")}
              </div>
            </div>
          </>
        )}
      </div>

      <IconButton
        onClick={onToggleCollapse}
        label="Toggle sidebar"
        icon={
          collapsed ? (
            isArabic ? (
              <ChevronsLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
            ) : (
              <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
            )
          ) : isArabic ? (
            <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
          ) : (
            <ChevronsLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
          )
        }
        className="group"
      />
    </div>
  );
}

interface NavButtonProps {
  item: NavItem;
  collapsed: boolean;
}

function NavButton({ item, collapsed }: NavButtonProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={item.onClick}
      className={[
        "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm border cursor-pointer",
        item.active
          ? "border-white/15 bg-ui-card"
          : "border-transparent hover:bg-ui-hover",
      ].join(" ")}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0 text-ui-text" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}

interface UserSectionProps {
  collapsed: boolean;
  isArabic: boolean;
}

function UserSection({ collapsed, isArabic }: UserSectionProps) {
  return (
    <div className="p-2 border-t border-ui-border shrink-0">
      <UserMenu
        position="sidebar"
        trigger={
          <div
            className={[
              "w-full flex items-center gap-3 rounded-md border border-ui-border bg-ui-card hover:bg-ui-hover",
              collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
            ].join(" ")}
          >
            <div className="h-8 w-8 rounded-full bg-white/10 border border-ui-border flex items-center justify-center shrink-0">
              <User className="h-4 w-4" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0 overflow-hidden text-left">
                <div className="text-sm font-medium truncate">Ahmed</div>
                <div className="text-xs text-ui-muted truncate">
                  ahmed@example.com
                </div>
              </div>
            )}

            {!collapsed && (
              <div className="shrink-0 h-7 w-7 rounded-md hover:bg-ui-hover flex items-center justify-center">
                {isArabic ? (
                  <ChevronsLeft className="h-4 w-4" />
                ) : (
                  <ChevronsRight className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
