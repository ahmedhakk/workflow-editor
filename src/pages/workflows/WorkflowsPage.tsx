import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Header } from "@layout";
import { Button } from "@components/ui";
import { useWorkflows, useWorkflowSearch } from "@pages/workflows/hooks";
import {
  WorkflowLeftSidebar,
  WorkflowDetailsPanel,
  WorkflowGrid,
} from "@pages/workflows/components";
import type { TabKey } from "@pages/workflows/types";

export default function WorkflowsPage() {
  const nav = useNavigate();
  const { t } = useTranslation();

  // Set page title
  useEffect(() => {
    document.title = t("workflows.title");
  }, [t]);

  // Sidebar collapse states
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Tab state for details panel
  const [tab, setTab] = useState<TabKey>("overview");

  // Workflows data and actions
  const {
    items,
    selectedId,
    selected,
    workflowDocs,
    setSelectedId,
    createWorkflow,
    duplicateWorkflow,
    deleteWorkflow,
    renameWorkflow,
    setWorkflowStatus,
  } = useWorkflows();

  // Search functionality
  const { query, setQuery, filtered } = useWorkflowSearch(items);

  // Handlers
  const handleCreate = () => {
    const created = createWorkflow("New workflow");
    nav(`/workflows/${created.id}`);
  };

  const handleOpen = (id: string) => {
    nav(`/workflows/${id}`);
  };

  return (
    <div className="h-screen w-screen bg-ui-canvas text-ui-text overflow-hidden">
      {/* Top bar */}
      <Header
        title={t("workflows.title")}
        subtitle={t("header.projects")}
        rightActions={
          <Button
            variant="primary"
            onClick={handleCreate}
            icon={<Plus className="h-4 w-4" />}
          >
            {t("workflows.createWorkflow")}
          </Button>
        }
      />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left sidebar */}
        <WorkflowLeftSidebar
          collapsed={leftCollapsed}
          onToggleCollapse={() => setLeftCollapsed((v) => !v)}
        />

        {/* Main content - Workflow grid */}
        <WorkflowGrid
          workflows={filtered}
          workflowDocs={workflowDocs}
          selectedId={selectedId}
          searchQuery={query}
          onSearchChange={setQuery}
          onSelectWorkflow={setSelectedId}
          onOpenWorkflow={handleOpen}
          onCreateWorkflow={handleCreate}
        />

        {/* Right sidebar - Details panel */}
        <WorkflowDetailsPanel
          collapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed((v) => !v)}
          selectedWorkflow={selected}
          activeTab={tab}
          onTabChange={setTab}
          onOpenWorkflow={handleOpen}
          onDuplicate={duplicateWorkflow}
          onDelete={deleteWorkflow}
          onRename={renameWorkflow}
          onStatusChange={setWorkflowStatus}
        />
      </div>
    </div>
  );
}
