import { useMemo, useState } from "react";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import type { ValidationIssue } from "@features/workflow/workflow.rules";
import SidebarToggle from "../shared/SidebarToggle";
import EmptyInspector from "./EmptyInspector";
import EdgeInspector from "./EdgeInspector";
import NodeInspector from "./NodeInspector";
import { useTranslation } from "react-i18next";

export default function PropertiesPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  const validationIssues = useWorkflowStore((s) => s.validationIssues);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);

  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectedEdgeId = useWorkflowStore((s) => s.selectedEdgeId);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteSelected = useWorkflowStore((s) => s.deleteSelected);

  const issueCount = validationIssues.filter(
    (i) => i.severity === "error"
  ).length;

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId]
  );

  const edgeSourceNode = useMemo(() => {
    if (!selectedEdge) return null;
    return nodes.find((n) => n.id === selectedEdge.source) ?? null;
  }, [nodes, selectedEdge]);

  const edgeTargetNode = useMemo(() => {
    if (!selectedEdge) return null;
    return nodes.find((n) => n.id === selectedEdge.target) ?? null;
  }, [nodes, selectedEdge]);

  const issuesForSelected = useMemo(() => {
    if (selectedNodeId) {
      return validationIssues.filter(
        (i) =>
          i.severity === "error" &&
          i.target === "node" &&
          i.id === selectedNodeId
      );
    }
    if (selectedEdgeId) {
      return validationIssues.filter(
        (i) =>
          i.severity === "error" &&
          i.target === "edge" &&
          i.id === selectedEdgeId
      );
    }
    return validationIssues.filter((i) => i.severity === "error");
  }, [validationIssues, selectedNodeId, selectedEdgeId]);

  const handleIssueClick = (issue: ValidationIssue) => {
    if (issue.target === "node" && issue.id) {
      selectEdge(null);
      selectNode(issue.id);
    } else if (issue.target === "edge" && issue.id) {
      selectNode(null);
      selectEdge(issue.id);
    }
  };

  const renderContent = () => {
    // No selection - show empty inspector
    if (!selectedNode && !selectedEdge) {
      return (
        <EmptyInspector
          issues={issuesForSelected}
          issueCount={issueCount}
          onIssueClick={handleIssueClick}
        />
      );
    }

    // Edge selected
    if (!selectedNode && selectedEdge) {
      return (
        <EdgeInspector
          edge={selectedEdge}
          sourceNode={edgeSourceNode}
          targetNode={edgeTargetNode}
          issues={issuesForSelected}
          issueCount={issueCount}
          onDelete={deleteSelected}
        />
      );
    }

    // Node selected
    if (selectedNode) {
      return (
        <NodeInspector
          node={selectedNode}
          issues={issuesForSelected}
          issueCount={issueCount}
          onUpdateData={(data) => updateNodeData(selectedNode.id, data)}
          onDelete={deleteSelected}
        />
      );
    }

    return null;
  };

  return (
    <aside
      className={`relative h-full border-l border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
    >
      <SidebarToggle
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        position="right"
        expandLabel={t("canvas.expandSidebar")}
        collapseLabel={t("canvas.collapseSidebar")}
      />

      <div
        className={`h-full transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        {renderContent()}
      </div>
    </aside>
  );
}
