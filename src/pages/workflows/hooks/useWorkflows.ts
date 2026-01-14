import { useCallback, useMemo, useState } from "react";
import {
  createWorkflowSeed,
  deleteWorkflow,
  duplicateWorkflow,
  getWorkflow,
  listWorkflows,
  renameWorkflow,
  setWorkflowStatus,
  type WorkflowListItem,
} from "@/services/workflows.local";
import type { PageState, WorkflowDocsMap } from "../types";

function loadWorkflowList(): WorkflowListItem[] {
  return listWorkflows();
}

function loadWorkflowDocs(items: WorkflowListItem[]): WorkflowDocsMap {
  const docs: WorkflowDocsMap = {};
  for (const item of items) {
    const doc = getWorkflow(item.id);
    if (doc) docs[item.id] = doc;
  }
  return docs;
}

export function useWorkflows() {
  // Initialize items + selectedId
  const [{ items, selectedId }, setPageState] = useState<PageState>(() => {
    const initial = loadWorkflowList();
    return {
      items: initial,
      selectedId: initial[0]?.id ?? null,
    };
  });

  // Cache full workflow documents for thumbnails
  const [workflowDocs, setWorkflowDocs] = useState<WorkflowDocsMap>(() =>
    loadWorkflowDocs(loadWorkflowList())
  );

  // Refresh workflows list and docs
  const refresh = useCallback(() => {
    const next = listWorkflows();
    setPageState((prev) => ({
      items: next,
      selectedId:
        prev.selectedId && next.some((x) => x.id === prev.selectedId)
          ? prev.selectedId
          : (next[0]?.id ?? null),
    }));
    setWorkflowDocs(loadWorkflowDocs(next));
  }, []);

  // Set selected workflow
  const setSelectedId = useCallback((id: string | null) => {
    setPageState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  // Get currently selected workflow
  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId]
  );

  // Actions
  const createWorkflow = useCallback(
    (name: string = "New workflow") => {
      const created = createWorkflowSeed({ name });
      refresh();
      setSelectedId(created.id);
      return created;
    },
    [refresh, setSelectedId]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      duplicateWorkflow(id);
      refresh();
    },
    [refresh]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteWorkflow(id);
      refresh();
    },
    [refresh]
  );

  const handleRename = useCallback(
    (id: string, name: string) => {
      renameWorkflow(id, name);
      refresh();
    },
    [refresh]
  );

  const handleStatusChange = useCallback(
    (id: string, status: "draft" | "published") => {
      setWorkflowStatus(id, status);
      refresh();
    },
    [refresh]
  );

  return {
    items,
    selectedId,
    selected,
    workflowDocs,
    setSelectedId,
    createWorkflow,
    duplicateWorkflow: handleDuplicate,
    deleteWorkflow: handleDelete,
    renameWorkflow: handleRename,
    setWorkflowStatus: handleStatusChange,
    refresh,
  };
}
