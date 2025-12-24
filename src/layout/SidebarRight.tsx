import { useMemo } from "react";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { defaultConfigByType } from "@types";
import { useToastStore } from "@/components/ui/toast/toast.store";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-xs font-medium text-zinc-300">{children}</div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
    />
  );
}

function pill(text: string) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-200">
      {text}
    </span>
  );
}

export default function SidebarRight() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectedEdgeId = useWorkflowStore((s) => s.selectedEdgeId);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteSelected = useWorkflowStore((s) => s.deleteSelected);

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

  // NOTHING selected
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-3">
        <div className="mb-2 text-sm font-semibold">Inspector</div>
        <div className="text-sm text-zinc-400">
          Select a node or connection to edit.
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">
          Tip: click a node or a line (edge) on the canvas.
        </div>
      </div>
    );
  }

  // EDGE selected (show edge inspector)
  if (!selectedNode && selectedEdge) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="p-3">
          <div className="mb-3">
            <div className="text-sm font-semibold">Inspector</div>
            <div className="text-xs text-zinc-400">
              edge • {selectedEdge.id}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel>Source</FieldLabel>
              <div className="flex flex-wrap items-center gap-2">
                {pill(selectedEdge.source)}
                {edgeSourceNode?.type ? pill(edgeSourceNode.type) : null}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {edgeSourceNode?.data?.label
                  ? `Label: ${edgeSourceNode.data.label}`
                  : "Node label not set"}
              </div>
            </div>

            <div>
              <FieldLabel>Target</FieldLabel>
              <div className="flex flex-wrap items-center gap-2">
                {pill(selectedEdge.target)}
                {edgeTargetNode?.type ? pill(edgeTargetNode.type) : null}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {edgeTargetNode?.data?.label
                  ? `Label: ${edgeTargetNode.data.label}`
                  : "Node label not set"}
              </div>
            </div>

            <div>
              <FieldLabel>Handles</FieldLabel>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                {pill(`sourceHandle: ${selectedEdge.sourceHandle ?? "—"}`)}
                {pill(`targetHandle: ${selectedEdge.targetHandle ?? "—"}`)}
              </div>
            </div>
          </div>
        </div>

        <div className="my-3 mx-2">
          <button
            onClick={() => {
              deleteSelected();
              useToastStore.getState().success("Deleted Edge Successfully");
            }}
            className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            Delete Edge
          </button>
        </div>
      </div>
    );
  }

  // NODE selected (your current node inspector)
  const data = selectedNode!.data ?? { label: "Step" };
  const config = (data.config ??
    defaultConfigByType(selectedNode!.type)) as any;

  const setLabel = (label: string) =>
    updateNodeData(selectedNode!.id, { label });
  const setConfig = (nextConfig: Record<string, unknown>) =>
    updateNodeData(selectedNode!.id, { config: nextConfig });

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="p-3">
        <div className="mb-3">
          <div className="text-sm font-semibold">Inspector</div>
          <div className="text-xs text-zinc-400">
            {selectedNode!.type ?? "step"} • {selectedNode!.id}
          </div>
        </div>

        {/* Label */}
        <div className="mb-4">
          <FieldLabel>Label</FieldLabel>
          <Input
            value={data.label ?? ""}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Step label"
          />
        </div>

        {/* Node-specific config */}
        <div className="space-y-4">
          {selectedNode!.type === "trigger" && (
            <>
              <div>
                <FieldLabel>Trigger Type</FieldLabel>
                <Select
                  value={config.triggerType ?? "event"}
                  onChange={(e) =>
                    setConfig({ ...config, triggerType: e.target.value })
                  }
                >
                  <option value="event">Event (webhook)</option>
                  <option value="schedule">Schedule</option>
                  <option value="manual">Manual</option>
                </Select>
              </div>

              {config.triggerType === "event" && (
                <div>
                  <FieldLabel>Event Name</FieldLabel>
                  <Input
                    value={config.eventName ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, eventName: e.target.value })
                    }
                    placeholder="salary_paid"
                  />
                </div>
              )}

              {config.triggerType === "schedule" && (
                <div>
                  <FieldLabel>Run At (ISO or simple)</FieldLabel>
                  <Input
                    value={config.schedule?.at ?? ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        schedule: {
                          ...(config.schedule ?? {}),
                          at: e.target.value,
                          timezone: "Africa/Cairo",
                        },
                      })
                    }
                    placeholder="2025-12-31 09:00"
                  />
                </div>
              )}
            </>
          )}

          {selectedNode!.type === "audience" && (
            <>
              <div>
                <FieldLabel>Audience</FieldLabel>
                <Select
                  value={config.audienceType ?? "all"}
                  onChange={(e) =>
                    setConfig({ ...config, audienceType: e.target.value })
                  }
                >
                  <option value="all">All contacts</option>
                  <option value="list">Specific list</option>
                </Select>
              </div>

              {config.audienceType === "list" && (
                <div>
                  <FieldLabel>List ID</FieldLabel>
                  <Input
                    value={config.listId ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, listId: e.target.value })
                    }
                    placeholder="employees"
                  />
                </div>
              )}
            </>
          )}

          {selectedNode!.type === "sms" && (
            <>
              <div>
                <FieldLabel>Sender ID</FieldLabel>
                <Input
                  value={config.senderId ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, senderId: e.target.value })
                  }
                  placeholder="Dreams"
                />
              </div>

              <div>
                <FieldLabel>Message</FieldLabel>
                <Textarea
                  rows={6}
                  value={config.text ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, text: e.target.value })
                  }
                  placeholder="Your salary has been sent."
                />
                <div className="mt-1 text-xs text-zinc-400">
                  (Later we’ll add SMS segments + GSM/UCS-2 detection)
                </div>
              </div>
            </>
          )}

          {selectedNode!.type === "whatsapp" && (
            <>
              <div>
                <FieldLabel>Template ID</FieldLabel>
                <Input
                  value={config.templateId ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, templateId: e.target.value })
                  }
                  placeholder="salary_notification_v1"
                />
              </div>

              <div className="text-xs text-zinc-400">
                Next: we’ll add template variable mapping UI.
              </div>
            </>
          )}

          {selectedNode!.type === "delay" && (
            <div>
              <FieldLabel>Delay (minutes)</FieldLabel>
              <Input
                type="number"
                value={config.minutes ?? 10}
                onChange={(e) =>
                  setConfig({ ...config, minutes: Number(e.target.value) })
                }
                min={0}
              />
            </div>
          )}
        </div>
      </div>

      <div className="my-3 mx-2">
        <button
          onClick={() => {
            deleteSelected();
            useToastStore.getState().success("Deleted Node Successfully");
          }}
          className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
