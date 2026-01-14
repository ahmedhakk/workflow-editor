import { useTranslation } from "react-i18next";
import type { Node } from "reactflow";
import {
  Input,
  Textarea,
  Select,
  FieldLabel,
  FieldError,
} from "@components/ui";
import { useToastStore } from "@components/ui/toast/toast.store";
import { defaultConfigByType } from "@types";
import type { ValidationIssue } from "@features/workflow/workflow.rules";
import ValidationBadge from "./ValidationBadge";
import { hintFor } from "./utils";

interface NodeInspectorProps {
  node: Node;
  issues: ValidationIssue[];
  issueCount: number;
  onUpdateData: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}

export default function NodeInspector({
  node,
  issues,
  issueCount,
  onUpdateData,
  onDelete,
}: NodeInspectorProps) {
  const { t } = useTranslation();

  const data = node.data ?? { label: "Step" };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = (data.config ?? defaultConfigByType(node.type)) as Record<
    string,
    any
  >;

  const setLabel = (label: string) => onUpdateData({ label });
  const setConfig = (nextConfig: Record<string, unknown>) =>
    onUpdateData({ config: nextConfig });

  const fieldError = (key: string) => {
    const hit = issues.find((i) =>
      i.messageKey.toLowerCase().includes(key.toLowerCase())
    );
    return hit ? t(hit.messageKey, hit.messageParams) : null;
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="p-3">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">{t("canvas.inspector")}</div>
            <ValidationBadge count={issueCount} />
          </div>
          <div className="text-xs text-ui-muted">
            {node.type ?? t("canvas.step")} • {node.id}
          </div>
        </div>

        {/* Validation Issues */}
        {issues.length > 0 && (
          <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
            <div className="text-sm font-medium">{t("canvas.validation")}</div>
            <div className="mt-2 space-y-2">
              {issues.map((issue, idx) => {
                const message = t(issue.messageKey, issue.messageParams);
                const hint = hintFor(issue.messageKey, t);
                return (
                  <div
                    key={`${issue.id}-${idx}`}
                    className="rounded-md border border-red-500/20 bg-red-500/5 p-2"
                  >
                    <div className="text-xs text-red-200">{message}</div>
                    {hint && (
                      <div className="mt-1 text-[11px] text-red-200/70">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Label Input */}
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
          <NodeConfigFields
            nodeType={node.type}
            config={config}
            setConfig={setConfig}
            fieldError={fieldError}
          />
        </div>
      </div>

      {/* Delete Button */}
      <div className="my-3 mx-2">
        <button
          onClick={() => {
            onDelete();
            useToastStore.getState().success(t("toasts.deletedNode"));
          }}
          className="mt-3 w-full cursor-pointer rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          {t("canvas.deleteNode")}
        </button>
      </div>
    </div>
  );
}

// Node-specific configuration fields
interface NodeConfigFieldsProps {
  nodeType: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  setConfig: (config: Record<string, unknown>) => void;
  fieldError: (key: string) => string | null;
}

function NodeConfigFields({
  nodeType,
  config,
  setConfig,
  fieldError,
}: NodeConfigFieldsProps) {
  const { t } = useTranslation();

  switch (nodeType) {
    case "audience":
      return (
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
              <FieldError error={fieldError("listId")} />
            </div>
          )}
        </>
      );

    case "sms":
      return (
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
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              placeholder="Your salary has been sent."
            />
            <FieldError error={fieldError("message")} />
          </div>
        </>
      );

    case "whatsapp":
      return (
        <div>
          <FieldLabel>{t("nodeConfig.templateId")}</FieldLabel>
          <Input
            value={config.templateId ?? ""}
            onChange={(e) =>
              setConfig({ ...config, templateId: e.target.value })
            }
            placeholder="salary_notification_v1"
          />
          <FieldError error={fieldError("template")} />
        </div>
      );

    case "delay":
      return (
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
          <FieldError error={fieldError("minutes")} />
        </div>
      );

    case "notification":
      return (
        <>
          <div>
            <FieldLabel>{t("nodeConfig.title")}</FieldLabel>
            <Input
              value={config.title ?? ""}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Salary sent"
            />
            <FieldError error={fieldError("title")} />
          </div>
          <div>
            <FieldLabel>{t("nodeConfig.body")}</FieldLabel>
            <Textarea
              rows={5}
              value={config.body ?? ""}
              onChange={(e) => setConfig({ ...config, body: e.target.value })}
              placeholder="Your salary has been sent successfully."
            />
            <FieldError error={fieldError("body")} />
          </div>
        </>
      );

    default:
      return null;
  }
}
