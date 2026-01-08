import { useTranslation } from "react-i18next";

type Language = "en" | "ar";

type LanguageHook = {
  isArabic: boolean;
  dir: "ltr" | "rtl";
  currentLanguage: string;
  changeLanguage: (lang: Language) => void;
};

export const useLanguage = (): LanguageHook => {
  const { i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const changeLanguage = (lang: Language) => i18n.changeLanguage(lang);

  return {
    isArabic,
    dir,
    currentLanguage: i18n.language,
    changeLanguage,
  };
};
