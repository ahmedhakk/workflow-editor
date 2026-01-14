import { useTranslation } from "react-i18next";
import { Badge } from "@components/ui";

interface ValidationBadgeProps {
  count: number;
}

export default function ValidationBadge({ count }: ValidationBadgeProps) {
  const { t } = useTranslation();

  if (count <= 0) return null;

  return (
    <Badge variant="error">
      {count === 1
        ? t("canvas.issue", { count })
        : t("canvas.issues", { count })}
    </Badge>
  );
}
