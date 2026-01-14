import { SearchInput } from "@components/ui";
import { useTranslation } from "react-i18next";
import type { WorkflowListItem } from "@/services/workflows.local";
import type { WorkflowDocsMap } from "../types";
import WorkflowCard from "./WorkflowCard";
import CreateWorkflowCard from "./CreateWorkflowCard";

interface WorkflowGridProps {
  workflows: WorkflowListItem[];
  workflowDocs: WorkflowDocsMap;
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectWorkflow: (id: string) => void;
  onOpenWorkflow: (id: string) => void;
  onCreateWorkflow: () => void;
}

export default function WorkflowGrid({
  workflows,
  workflowDocs,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectWorkflow,
  onOpenWorkflow,
  onCreateWorkflow,
}: WorkflowGridProps) {
  const { t } = useTranslation();

  return (
    <main className="flex-1 overflow-auto">
      {/* Search row */}
      <div className="px-6 pt-6">
        <div className="mx-auto w-full max-w-300">
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("workflows.searchWorkflows")}
              containerClassName="w-full max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 pb-10 pt-6">
        <div className="mx-auto w-full max-w-300">
          <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {/* Create card */}
            <CreateWorkflowCard onCreate={onCreateWorkflow} />

            {/* Workflow cards */}
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                workflowDoc={workflowDocs[workflow.id]}
                isSelected={workflow.id === selectedId}
                onSelect={() => onSelectWorkflow(workflow.id)}
                onOpen={() => onOpenWorkflow(workflow.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
