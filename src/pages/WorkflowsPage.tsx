import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Copy,
  Trash2,
  ArrowRight,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Workflow,
  BookOpen,
  Star,
  Users,
  User,
  PanelRightOpen,
  PanelRightClose,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@layout";
import ToastRenderer from "@components/ui/toast/ToastRenderer";
import UserMenu from "@components/ui/UserMenu";

import {
  createWorkflowSeed,
  deleteWorkflow,
  duplicateWorkflow,
  listWorkflows,
  renameWorkflow,
  setWorkflowStatus,
  type WorkflowListItem,
} from "@/services/workflows.local";
import { useToastStore } from "@/components/ui/toast/toast.store";
import { useLanguage } from "@hooks";

type TabKey = "overview" | "settings" | "activity";

function loadWorkflowList(): WorkflowListItem[] {
  return listWorkflows();
}

type PageState = {
  items: WorkflowListItem[];
  selectedId: string | null;
};

type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
};

export default function WorkflowsPage() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const showToast = useToastStore((s) => s.success);

  useEffect(() => {
    document.title = t("workflows.title");
  }, [t]);

  // Left sidebar state
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  // Right sidebar state
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Initialize both items + selectedId ONCE
  const [{ items, selectedId }, setPageState] = useState<PageState>(() => {
    const initial = loadWorkflowList();
    return {
      items: initial,
      selectedId: initial[0]?.id ?? null,
    };
  });

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("overview");

  // refresh only when user does something (create/delete/duplicate/etc)
  const refresh = useCallback(() => {
    const next = listWorkflows();
    setPageState((prev) => ({
      items: next,
      selectedId:
        prev.selectedId && next.some((x) => x.id === prev.selectedId)
          ? prev.selectedId
          : (next[0]?.id ?? null),
    }));
  }, []);

  const setSelectedId = useCallback((id: string | null) => {
    setPageState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((w) => w.name.toLowerCase().includes(q));
  }, [items, query]);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId]
  );

  const onCreate = () => {
    const created = createWorkflowSeed({ name: "New workflow" });
    refresh();
    setSelectedId(created.id);
    nav(`/workflows/${created.id}`);
  };

  const onOpen = (id: string) => nav(`/workflows/${id}`);

  const badge =
    selected?.status === "published"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
      : "bg-zinc-500/15 text-zinc-200 border-zinc-500/30";

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
    <div className="h-screen w-screen bg-ui-canvas text-ui-text overflow-hidden">
      {/* Top bar */}
      <Header
        title={t("workflows.title")}
        subtitle={t("header.projects")}
        rightActions={
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t("workflows.createWorkflow")}
          </button>
        }
      />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left sidebar */}
        <aside
          className={[
            "relative border-r border-ui-border bg-ui-panel",
            leftCollapsed ? "w-16" : "w-64",
            "transition-[width] duration-200",
          ].join(" ")}
        >
          <div className="h-full flex flex-col">
            {/* Top workspace */}
            <div className="h-14 px-3 flex items-center justify-between border-b border-ui-border">
              <div className="flex items-center gap-2 min-w-0">
                {!leftCollapsed && (
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

              <button
                onClick={() => {
                  setLeftCollapsed((v) => !v);
                }}
                className="h-9 w-9 rounded-md border border-ui-border bg-ui-card hover:bg-ui-hover flex items-center justify-center cursor-pointer group"
                aria-label="Toggle sidebar"
              >
                {leftCollapsed ? (
                  isArabic ? (
                    <ChevronsLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
                  ) : (
                    <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
                  )
                ) : isArabic ? (
                  <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
                ) : (
                  <ChevronsLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
                )}
              </button>
            </div>

            {/* Nav */}
            <nav className="p-2 flex-1 overflow-auto">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className={[
                        "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm border cursor-pointer",
                        item.active
                          ? "border-white/15 bg-ui-card"
                          : "border-transparent hover:bg-ui-hover",
                      ].join(" ")}
                      title={leftCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ui-text" />
                      {!leftCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Bottom user section */}
            <div className="p-2 border-t border-ui-border shrink-0">
              <UserMenu
                position="sidebar"
                trigger={
                  <div
                    className={[
                      "w-full flex items-center gap-3 rounded-md border border-ui-border bg-ui-card hover:bg-ui-hover",
                      leftCollapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                    ].join(" ")}
                  >
                    <div className="h-8 w-8 rounded-full bg-white/10 border border-ui-border flex items-center justify-center shrink-0">
                      <User className="h-4 w-4" />
                    </div>

                    {!leftCollapsed && (
                      <div className="flex-1 min-w-0 overflow-hidden text-left">
                        <div className="text-sm font-medium truncate">
                          Ahmed
                        </div>
                        <div className="text-xs text-ui-muted truncate">
                          ahmed@example.com
                        </div>
                      </div>
                    )}

                    {!leftCollapsed && (
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
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Search row */}
          <div className="px-6 pt-6">
            <div className="mx-auto w-full max-w-300">
              <div className="flex items-center gap-3">
                <div className="relative w-full max-w-md">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ui-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("workflows.searchWorkflows")}
                    className="w-full rounded-md border border-ui-border bg-ui-card ps-9 pe-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="px-6 pb-10 pt-6">
            <div className="mx-auto w-full max-w-300">
              <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {/* Create card */}
                <button
                  onClick={onCreate}
                  className="group aspect-16/10 rounded-xl border border-dashed border-ui-border bg-ui-card/30 hover:bg-ui-card/50 transition overflow-hidden cursor-pointer"
                >
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-ui-muted group-hover:text-ui-text">
                      <div className="h-10 w-10 rounded-xl border border-ui-border bg-ui-card flex items-center justify-center">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">
                        {t("workflows.createNewWorkflow")}
                      </div>
                      <div className="text-xs text-ui-muted">
                        {t("workflows.draftInLocalStorage")}
                      </div>
                    </div>
                  </div>
                </button>

                {filtered.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedId(w.id)}
                    onDoubleClick={() => onOpen(w.id)}
                    className={[
                      "group relative aspect-16/10 rounded-xl border overflow-hidden text-left transition cursor-pointer",
                      w.id === selectedId
                        ? "border-white/25 bg-ui-card"
                        : "border-ui-border bg-ui-card/70 hover:bg-ui-card",
                    ].join(" ")}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-white/0" />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-md border px-2 py-1 text-[11px]",
                          w.status === "published"
                            ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                            : "bg-zinc-500/15 text-zinc-200 border-zinc-500/30",
                        ].join(" ")}
                      >
                        {w.status}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/55 to-transparent">
                      <div className="text-sm font-semibold line-clamp-1">
                        {w.name}
                      </div>
                      <div className="mt-1 text-xs text-ui-muted">
                        Updated {new Date(w.updatedAt).toLocaleString()}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[11px] text-ui-muted">
                          v{w.version}
                        </div>
                        <div className="text-[11px] text-ui-muted group-hover:text-ui-text flex items-center gap-1">
                          {t("common.open")}
                          {isArabic ? (
                            <ArrowLeft className="h-3 w-3" />
                          ) : (
                            <ArrowRight className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right details sidebar (collapsible) */}
        <aside
          className={[
            "border-l border-ui-border bg-ui-panel overflow-hidden",
            rightCollapsed ? "w-14" : "w-90",
            "transition-[width] duration-200",
          ].join(" ")}
        >
          {/* Header row */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-ui-border">
            {!rightCollapsed && (
              <div>
                <div className="text-sm font-semibold">
                  {t("workflows.details")}
                </div>
                <div className="text-xs text-ui-muted">
                  {t("workflows.selectFromGrid")}
                </div>
              </div>
            )}

            <button
              onClick={() => setRightCollapsed((v) => !v)}
              className="h-9 w-9 rounded-md border border-ui-border bg-ui-card hover:bg-ui-hover flex items-center justify-center cursor-pointer group"
              aria-label="Toggle details sidebar"
              title={rightCollapsed ? "Open details" : "Collapse details"}
            >
              {rightCollapsed ? (
                isArabic ? (
                  <PanelRightClose className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
                ) : (
                  <PanelRightOpen className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
                )
              ) : isArabic ? (
                <PanelRightOpen className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-px" />
              ) : (
                <PanelRightClose className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-px" />
              )}
            </button>
          </div>

          {/* Content */}
          {!rightCollapsed && (
            <div className="overflow-auto h-[calc(100vh-56px-56px)]">
              {!selected ? (
                <div className="p-4 text-sm text-ui-muted">
                  {t("workflows.noWorkflowSelected")}
                </div>
              ) : (
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-semibold line-clamp-2">
                        {selected.name}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-md border px-2 py-1 text-[11px]",
                            badge,
                          ].join(" ")}
                        >
                          {selected.status}
                        </span>
                        <span className="text-xs text-ui-muted">
                          Updated{" "}
                          {new Date(selected.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpen(selected.id)}
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

                  {/* Tabs */}
                  <div className="mt-4 flex gap-2 border-b border-ui-border pb-3">
                    {(
                      [
                        ["overview", t("workflows.overview")],
                        ["settings", t("common.settings")],
                        ["activity", t("workflows.activity")],
                      ] as [TabKey, string][]
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={[
                          "rounded-md px-3 py-1.5 text-sm border",
                          tab === k
                            ? "border-white/20 bg-ui-card"
                            : "border-ui-border bg-transparent hover:bg-ui-hover",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  {tab === "overview" && (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg border border-ui-border bg-ui-card p-3">
                        <div className="text-xs text-ui-muted">
                          {t("workflows.workflowId")}
                        </div>
                        <div className="mt-1 font-mono text-xs">
                          {selected.id}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            duplicateWorkflow(selected.id);
                            refresh();
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border cursor-pointer border-ui-border bg-ui-card px-3 py-2 text-sm hover:bg-ui-hover"
                        >
                          <Copy className="h-4 w-4" />
                          {t("common.duplicate")}
                        </button>
                        <button
                          onClick={() => {
                            deleteWorkflow(selected.id);
                            refresh();
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-md border cursor-pointer border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("common.delete")}
                        </button>
                      </div>
                    </div>
                  )}

                  {tab === "settings" && (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg border border-ui-border bg-ui-card p-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Settings className="h-4 w-4" />
                          {t("common.settings")}
                        </div>

                        <div className="mt-3 space-y-2">
                          <label className="text-xs text-ui-muted">
                            {t("common.name")}
                          </label>
                          <input
                            defaultValue={selected.name}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              if (!v) return;
                              renameWorkflow(selected.id, v);
                              refresh();
                            }}
                            className="w-full rounded-md border border-ui-border bg-ui-panel px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                          />

                          <label className="mt-2 block text-xs text-ui-muted">
                            {t("common.status")}
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setWorkflowStatus(selected.id, "draft");
                                refresh();
                              }}
                              className={[
                                "flex-1 rounded-md border px-3 py-2 text-sm",
                                selected.status === "draft"
                                  ? "border-white/20 bg-ui-panel"
                                  : "border-ui-border hover:bg-ui-hover",
                              ].join(" ")}
                            >
                              {t("common.draft")}
                            </button>
                            <button
                              onClick={() => {
                                setWorkflowStatus(selected.id, "published");
                                refresh();
                              }}
                              className={[
                                "flex-1 rounded-md border px-3 py-2 text-sm",
                                selected.status === "published"
                                  ? "border-white/20 bg-ui-panel"
                                  : "border-ui-border hover:bg-ui-hover",
                              ].join(" ")}
                            >
                              {t("common.published")}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-ui-muted">
                        {t("workflows.settingsNote")}
                      </div>
                    </div>
                  )}

                  {tab === "activity" && (
                    <div className="mt-4 rounded-lg border border-ui-border bg-ui-card p-3">
                      <div className="text-sm font-medium">
                        {t("workflows.activity")}
                      </div>
                      <div className="mt-1 text-sm text-ui-muted">
                        {t("workflows.noActivity")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      <ToastRenderer />
    </div>
  );
}
