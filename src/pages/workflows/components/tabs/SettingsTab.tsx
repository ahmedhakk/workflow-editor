import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, Input } from "@components/ui";
import type { WorkflowListItem } from "@/services/workflows.local";

interface SettingsTabProps {
  workflow: WorkflowListItem;
  onRename: (name: string) => void;
  onStatusChange: (status: "draft" | "published") => void;
}

export default function SettingsTab({
  workflow,
  onRename,
  onStatusChange,
}: SettingsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-3">
      <Card>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Settings className="h-4 w-4" />
          {t("common.settings")}
        </div>

        <div className="mt-3 space-y-2">
          {/* Name input */}
          <label className="text-xs text-ui-muted">{t("common.name")}</label>
          <Input
            defaultValue={workflow.name}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) {
                onRename(value);
              }
            }}
          />

          {/* Status toggle */}
          <label className="mt-2 block text-xs text-ui-muted">
            {t("common.status")}
          </label>
          <StatusToggle
            currentStatus={workflow.status}
            onStatusChange={onStatusChange}
          />
        </div>
      </Card>

      <div className="text-xs text-ui-muted">{t("workflows.settingsNote")}</div>
    </div>
  );
}

interface StatusToggleProps {
  currentStatus: "draft" | "published";
  onStatusChange: (status: "draft" | "published") => void;
}

function StatusToggle({ currentStatus, onStatusChange }: StatusToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onStatusChange("draft")}
        className={[
          "flex-1 rounded-md border px-3 py-2 text-sm cursor-pointer",
          currentStatus === "draft"
            ? "border-white/20 bg-ui-panel"
            : "border-ui-border hover:bg-ui-hover",
        ].join(" ")}
      >
        {t("common.draft")}
      </button>
      <button
        onClick={() => onStatusChange("published")}
        className={[
          "flex-1 rounded-md border px-3 py-2 text-sm cursor-pointer",
          currentStatus === "published"
            ? "border-white/20 bg-ui-panel"
            : "border-ui-border hover:bg-ui-hover",
        ].join(" ")}
      >
        {t("common.published")}
      </button>
    </div>
  );
}
