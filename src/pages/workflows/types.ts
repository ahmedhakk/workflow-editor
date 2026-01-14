import type { WorkflowListItem } from "@/services/workflows.local";
import type { WorkflowPayload } from "@features/workflow/workflow.serializer";

export type TabKey = "overview" | "settings" | "activity";

export type PageState = {
  items: WorkflowListItem[];
  selectedId: string | null;
};

export type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
};

export type WorkflowDocsMap = Record<string, WorkflowPayload>;
