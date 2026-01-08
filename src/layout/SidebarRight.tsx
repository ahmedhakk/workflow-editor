import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkflowStore } from "@features/workflow/workflow.store";
import { defaultConfigByType } from "@types";
import { useToastStore } from "@/components/ui/toast/toast.store";
import { useLanguage } from "@hooks";

function Badge({
  count,
  t,
}: {
  count: number;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-200">
      {count === 1
        ? t("canvas.issue", { count })
        : t("canvas.issues", { count })}
    </span>
  );
}

function hintFor(messageKey: string, t: (key: string) => string) {
  const m = messageKey.toLowerCase();
  if (m.includes("trigger") && m.includes("only one"))
    return t("hints.deleteExtraTrigger");
  if (m.includes("workflow must have a trigger")) return t("hints.dragTrigger");
  if (m.includes("trigger") && m.includes("incoming"))
    return t("hints.removeIncomingEdge");
  if (m.includes("not reachable")) return t("hints.connectToFlow");
  if (m.includes("if branch") && m.includes("not connected"))
    return t("hints.connectIfBranch");
  if (m.includes("else branch") && m.includes("not connected"))
    return t("hints.connectElseBranch");
  if (m.includes("sms") && m.includes("message"))
    return t("hints.fillSmsMessage");
  if (m.includes("whatsapp") && m.includes("template"))
    return t("hints.setTemplateId");
  if (m.includes("audience") && m.includes("listid"))
    return t("hints.fillListId");
  if (m.includes("delay") && m.includes("minutes"))
    return t("hints.setDelayMinutes");
  if (m.includes("notification") && (m.includes("title") || m.includes("body")))
    return t("hints.fillNotification");
  if (m.includes("cycle")) return t("hints.removeCycle");
  return "";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-xs font-medium text-ui-text2">{children}</div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-ui-border bg-ui-card px-3 py-2 text-sm text-ui-text placeholder:text-ui-muted focus:outline-none focus:ring-2 focus:ring-ui-border-soft"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-md border border-ui-border bg-ui-card px-3 py-2 text-sm text-ui-text placeholder:text-ui-muted focus:outline-none focus:ring-2 focus:ring-ui-border-soft"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-md border border-ui-border bg-ui-card px-3 py-2 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-ui-border-soft"
    />
  );
}

function pill(text: string) {
  return (
    <span className="inline-flex items-center rounded-md border border-ui-border bg-ui-card px-2 py-0.5 text-xs text-ui-text2">
      {text}
    </span>
  );
}

function InlineError({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className="mt-1 text-xs text-red-200">{text}</div>;
}

export default function SidebarRight() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { dir, isArabic } = useLanguage();
  const { t } = useTranslation();

  const validationIssues = useWorkflowStore((s) => s.validationIssues);
  const validateWorkflowNow = useWorkflowStore((s) => s.validateWorkflowNow);
  const clearValidation = useWorkflowStore((s) => s.clearValidation);
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

  const fieldError = (key: string) => {
    const hit = issuesForSelected.find((i) =>
      i.messageKey.toLowerCase().includes(key.toLowerCase())
    );
    return hit ? t(hit.messageKey, hit.messageParams) : null;
  };

  // NOTHING selected
  if (!selectedNode && !selectedEdge) {
    return (
      <aside
        className={`relative h-full border-l border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute ${dir === "rtl" ? "-right-3" : "-left-3"} top-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg hover:bg-ui-hover hover:text-ui-text`}
          title={
            isCollapsed
              ? t("canvas.expandSidebar")
              : t("canvas.collapseSidebar")
          }
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              isArabic ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              )
            ) : isArabic ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
        </button>

        <div
          className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 p-3"}`}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">{t("canvas.inspector")}</div>
            <Badge count={issueCount} t={t} />
          </div>

          {/* Validation panel */}
          <div className="mb-3 rounded-lg border border-ui-border bg-ui-card p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">
                {t("canvas.validation")}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const r = validateWorkflowNow();
                    if (r.valid)
                      useToastStore
                        .getState()
                        .success(t("toasts.noValidationIssues"));
                    else
                      useToastStore
                        .getState()
                        .error(
                          t("toasts.foundIssues", { count: r.issues.length })
                        );
                  }}
                  className="rounded-md border border-ui-border bg-ui-panel px-2 py-1 text-xs hover:bg-ui-hover"
                >
                  {t("canvas.run")}
                </button>

                {issueCount > 0 && (
                  <button
                    onClick={() => clearValidation()}
                    className="rounded-md border border-ui-border bg-ui-panel px-2 py-1 text-xs hover:bg-ui-hover"
                  >
                    {t("canvas.clear")}
                  </button>
                )}
              </div>
            </div>

            {issueCount === 0 ? (
              <div className="mt-2 text-sm text-ui-muted">
                {t("canvas.noIssues")}
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                {issuesForSelected.slice(0, 8).map((iss, idx) => {
                  const message = t(iss.messageKey, iss.messageParams);
                  const hint = hintFor(iss.messageKey, t);
                  return (
                    <button
                      key={`${iss.target}-${iss.id ?? "wf"}-${idx}`}
                      onClick={() => {
                        if (iss.target === "node" && iss.id) {
                          selectEdge(null);
                          selectNode(iss.id);
                        } else if (iss.target === "edge" && iss.id) {
                          selectNode(null);
                          selectEdge(iss.id);
                        }
                      }}
                      className="w-full rounded-md border border-red-500/25 bg-red-500/5 p-2 text-left hover:bg-red-500/10"
                      title={hint ? `Tip: ${hint}` : ""}
                    >
                      <div className="text-xs text-red-200 text-left rtl:text-right">
                        {message}
                      </div>
                      {hint ? (
                        <div className="mt-1 text-[11px] text-red-200/70 text-left rtl:text-right">
                          {hint}
                        </div>
                      ) : null}
                    </button>
                  );
                })}

                {issuesForSelected.length > 8 ? (
                  <div className="text-xs text-ui-muted">
                    {t("canvas.moreIssues", {
                      count: issuesForSelected.length - 8,
                    })}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="text-sm text-ui-muted">
            {t("canvas.selectNodeOrConnection")}
          </div>

          <div className="mt-4 rounded-lg border border-ui-border bg-ui-card p-3 text-sm text-ui-text2">
            {t("canvas.tipClickNode")}
          </div>
        </div>
      </aside>
    );
  }

  // EDGE selected
  if (!selectedNode && selectedEdge) {
    return (
      <aside
        className={`relative h-full border-l border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute ${dir === "rtl" ? "-right-3" : "-left-3"} top-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg hover:bg-ui-hover hover:text-ui-text`}
          title={
            isCollapsed
              ? t("canvas.expandSidebar")
              : t("canvas.collapseSidebar")
          }
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              isArabic ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              )
            ) : isArabic ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
        </button>

        <div
          className={`flex h-full flex-col justify-between transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="p-3">
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">
                  {t("canvas.inspector")}
                </div>
                <Badge count={issueCount} t={t} />
              </div>
              <div className="text-xs text-ui-muted">
                {t("canvas.edge")} • {selectedEdge.id}
              </div>
            </div>

            {issuesForSelected.length > 0 && (
              <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
                <div className="text-sm font-medium">
                  {t("canvas.validation")}
                </div>
                <div className="mt-2 space-y-2">
                  {issuesForSelected.map((iss, idx) => {
                    const message = t(iss.messageKey, iss.messageParams);
                    const hint = hintFor(iss.messageKey, t);
                    return (
                      <div
                        key={`${iss.id}-${idx}`}
                        className="rounded-md border border-red-500/20 bg-red-500/5 p-2"
                      >
                        <div className="text-xs text-red-200">{message}</div>
                        {hint ? (
                          <div className="mt-1 text-[11px] text-red-200/70">
                            {hint}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <FieldLabel>{t("canvas.source")}</FieldLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {pill(selectedEdge.source)}
                  {edgeSourceNode?.type ? pill(edgeSourceNode.type) : null}
                </div>
              </div>

              <div>
                <FieldLabel>{t("canvas.target")}</FieldLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {pill(selectedEdge.target)}
                  {edgeTargetNode?.type ? pill(edgeTargetNode.type) : null}
                </div>
              </div>

              <div>
                <FieldLabel>{t("canvas.handles")}</FieldLabel>
                <div className="flex flex-wrap gap-2 text-xs text-ui-text2">
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
                useToastStore.getState().success(t("toasts.deletedEdge"));
              }}
              className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              {t("canvas.deleteEdge")}
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // NODE selected
  const data = selectedNode!.data ?? { label: "Step" };
  const config = (data.config ??
    defaultConfigByType(selectedNode!.type)) as any;

  const setLabel = (label: string) =>
    updateNodeData(selectedNode!.id, { label });
  const setConfig = (nextConfig: Record<string, unknown>) =>
    updateNodeData(selectedNode!.id, { config: nextConfig });

  return (
    <aside
      className={`relative h-full border-l border-ui-border bg-ui-panel transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute ${dir === "rtl" ? "-right-3" : "-left-3"} top-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ui-border bg-ui-card text-ui-muted shadow-lg hover:bg-ui-hover hover:text-ui-text`}
        title={
          isCollapsed ? t("canvas.expandSidebar") : t("canvas.collapseSidebar")
        }
      >
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCollapsed ? (
            isArabic ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            )
          ) : isArabic ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          )}
        </svg>
      </button>

      <div
        className={`flex h-full flex-col justify-between transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="p-3">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">
                {t("canvas.inspector")}
              </div>
              <Badge count={issueCount} t={t} />
            </div>
            <div className="text-xs text-ui-muted">
              {selectedNode!.type ?? t("canvas.step")} • {selectedNode!.id}
            </div>
          </div>

          {/* Node validation box */}
          {issuesForSelected.length > 0 && (
            <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
              <div className="text-sm font-medium">
                {t("canvas.validation")}
              </div>
              <div className="mt-2 space-y-2">
                {issuesForSelected.map((iss, idx) => {
                  const message = t(iss.messageKey, iss.messageParams);
                  const hint = hintFor(iss.messageKey, t);
                  return (
                    <div
                      key={`${iss.id}-${idx}`}
                      className="rounded-md border border-red-500/20 bg-red-500/5 p-2"
                    >
                      <div className="text-xs text-red-200">{message}</div>
                      {hint ? (
                        <div className="mt-1 text-[11px] text-red-200/70">
                          {hint}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Label */}
          <div className="mb-4">
            <FieldLabel>{t("canvas.label")}</FieldLabel>
            <Input
              value={data.label ?? ""}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("canvas.stepLabel")}
            />
          </div>

          {/* Node-specific config */}
          <div className="space-y-4">
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
                    <option value="list">{t("nodeConfig.specificList")}</option>
                  </Select>
                </div>

                {config.audienceType === "list" && (
                  <div>
                    <FieldLabel>{t("nodeConfig.listId")}</FieldLabel>
                    <Input
                      value={config.listId ?? ""}
                      onChange={(e) =>
                        setConfig({ ...config, listId: e.target.value })
                      }
                      placeholder="employees"
                    />
                    <InlineError text={fieldError("listId")} />
                  </div>
                )}
              </>
            )}

            {selectedNode!.type === "sms" && (
              <>
                <div>
                  <FieldLabel>{t("nodeConfig.senderId")}</FieldLabel>
                  <Input
                    value={config.senderId ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, senderId: e.target.value })
                    }
                    placeholder="Dreams"
                  />
                </div>

                <div>
                  <FieldLabel>{t("nodeConfig.message")}</FieldLabel>
                  <Textarea
                    rows={6}
                    value={config.text ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, text: e.target.value })
                    }
                    placeholder="Your salary has been sent."
                  />
                  <InlineError text={fieldError("message")} />
                </div>
              </>
            )}

            {selectedNode!.type === "whatsapp" && (
              <div>
                <FieldLabel>{t("nodeConfig.templateId")}</FieldLabel>
                <Input
                  value={config.templateId ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, templateId: e.target.value })
                  }
                  placeholder="salary_notification_v1"
                />
                <InlineError text={fieldError("template")} />
              </div>
            )}

            {selectedNode!.type === "delay" && (
              <div>
                <FieldLabel>{t("nodeConfig.delayMinutes")}</FieldLabel>
                <Input
                  type="number"
                  value={config.minutes}
                  onChange={(e) =>
                    setConfig({ ...config, minutes: Number(e.target.value) })
                  }
                  min={0}
                />
                <InlineError text={fieldError("minutes")} />
              </div>
            )}

            {selectedNode!.type === "notification" && (
              <>
                <div>
                  <FieldLabel>{t("nodeConfig.title")}</FieldLabel>
                  <Input
                    value={config.title ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                    placeholder="Salary sent"
                  />
                  <InlineError text={fieldError("title")} />
                </div>
                <div>
                  <FieldLabel>{t("nodeConfig.body")}</FieldLabel>
                  <Textarea
                    rows={5}
                    value={config.body ?? ""}
                    onChange={(e) =>
                      setConfig({ ...config, body: e.target.value })
                    }
                    placeholder="Your salary has been sent successfully."
                  />
                  <InlineError text={fieldError("body")} />
                </div>
              </>
            )}

            {/* Keep other node UIs as you already have */}
          </div>
        </div>

        <div className="my-3 mx-2">
          <button
            onClick={() => {
              deleteSelected();
              useToastStore.getState().success(t("toasts.deletedNode"));
            }}
            className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            {t("canvas.deleteNode")}
          </button>
        </div>
      </div>
    </aside>
  );
}
