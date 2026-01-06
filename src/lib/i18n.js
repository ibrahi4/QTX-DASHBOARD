import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "../components/i18n/en.json";
import arLang from "../components/i18n/ar.json";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: arLang,
  },
  en: {
    translation: enLang,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    // lng: "en",

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [

        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },
  });

export default i18n;