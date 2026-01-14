import { useTranslation } from "react-i18next";
import { Card } from "@components/ui";

export default function ActivityTab() {
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <Card>
        <div className="text-sm font-medium">{t("workflows.activity")}</div>
        <div className="mt-1 text-sm text-ui-muted">
          {t("workflows.noActivity")}
        </div>
      </Card>
    </div>
  );
}
