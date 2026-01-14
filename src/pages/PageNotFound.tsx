import { Card } from "@components/ui";
import { useLanguage, useMoveBack } from "@hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PageNotFound() {
  const moveBack = useMoveBack();
  const { t } = useTranslation();
  const { isArabic, dir } = useLanguage();

  useEffect(() => {
    document.title = t("pageNotFound.title");
  }, [t]);

  return (
    <main className="h-screen w-screen bg-ui-canvas text-ui-text flex items-center justify-center p-16">
      <Card
        className="max-w-lg w-full text-center space-y-8 shadow-md p-12!"
        padding="lg"
      >
        <h1 className="text-2xl font-semibold">{t("pageNotFound.message")}</h1>

        <button
          onClick={moveBack}
          className="text-ui-link cursor-pointer group flex items-center justify-center w-full gap-2"
        >
          <span
            className={`inline-block transition-transform duration-300 ${dir === "rtl" ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"} ${isArabic ? "rotate-180" : ""}`}
          >
            &larr;
          </span>
          <span>{t("pageNotFound.goBack")}</span>
        </button>
      </Card>
    </main>
  );
}
