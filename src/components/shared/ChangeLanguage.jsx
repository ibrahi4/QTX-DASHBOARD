import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n from "@/lib/i18n";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { MdGTranslate } from "react-icons/md";
import { Button } from "../ui/button";

function ChangeLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState(Cookies.get("lang") || "ar");

  // useEffect(() => {
  //   i18n.changeLanguage(currentLanguage);
  //   window.document.dir = i18n.dir();
  //   Cookies.set("lang", currentLanguage);
  // }, [currentLanguage]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "ar" ? "en" : "ar";
    setCurrentLanguage(newLang);
  };

  return (
    <>
      <div className="max-lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className={"!gradient-border !bg-transparent"}>
            <Button variant="outline" size="icon">
              {currentLanguage.includes("ar") ? "EN" : "AR"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleLanguage}>English</DropdownMenuItem>

            <DropdownMenuItem onClick={toggleLanguage}>عربى</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="lg:hidden">
        {currentLanguage === "ar" ? (
          <Button onClick={toggleLanguage} variant="outlined" className="p-0">
            <span className="text-primary-1">
              <MdGTranslate />
            </span>
            <span className="text-grey-4">English</span>
          </Button>
        ) : (
          <Button onClick={toggleLanguage} variant="outlined" className="p-0">
            <span className="text-primary-1">
              <MdGTranslate />
            </span>
            <span className="text-grey-4">عربى</span>
          </Button>
        )}
      </div>
    </>
  );
}

export default ChangeLanguage;
