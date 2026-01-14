import { useMemo, useState } from "react";
import type { WorkflowListItem } from "@/services/workflows.local";

export function useWorkflowSearch(items: WorkflowListItem[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((w) => w.name.toLowerCase().includes(q));
  }, [items, query]);

  return {
    query,
    setQuery,
    filtered,
  };
}
