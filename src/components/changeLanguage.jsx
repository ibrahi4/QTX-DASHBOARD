import { CiGlobe } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const ChangeLang = () => {
  const { i18n } = useTranslation();

  const setDirAndClass = (lang) => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.classList.remove("rtl", "ltr");
    document.documentElement.classList.add(dir);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setDirAndClass(newLang);
  };

  useEffect(() => {
    setDirAndClass(i18n.language);
  }, [i18n.language]);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 focus:outline-none"
    >
      <CiGlobe className="size-[18px] text-[#888888] dark:text-white" />
      <span className="capitalize text-[#888888] dark:text-white">
        {i18n.language === "en" ? "English" : "العربية"}
      </span>
    </button>
  );
};

export default ChangeLang;
