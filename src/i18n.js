import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAR from "./locale/ar.json";
import translationEN from "./locale/en.json";
import LanguageDetector from "i18next-browser-languagedetector";
const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "customLocalStorage",
  lookup() {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang) {
      return savedLang.split("-")[0];
    }
    return null;
  },
  cacheUserLanguage(lng) {
    localStorage.setItem("i18nextLng", lng.split("-")[0]);
  },
});
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,

    detection: {
      order: [
        "customLocalStorage",
        "localStorage",
        "cookie",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["customLocalStorage"],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
