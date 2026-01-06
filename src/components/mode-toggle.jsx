// import { Moon, Sun } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "@/components/theme-provider";

// export function ModeToggle() {
//   const { setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild className={"!gradient-border !"}>
//         <Button variant="" size="icon" className="bg-primary-1">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white  " />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>

//         <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center min-w-20 w-20 h-10 rounded-full bg-[#F9F9F9] dark:bg-gray-800 transition-colors duration-300 `}
    >
      <div
        className={`absolute top-1 left-1 w-8 h-8 rounded-full  bg-blue-600 flex items-center justify-center shadow transition-all duration-300
          ${isDark ? "translate-x-0" : " translate-x-10"}
        `}
      ></div>

      <div className="absolute left-[10px]">
        <Moon
          size={20}
          fill={isDark ? "white" : "#2563eb"}
          color={isDark ? "white" : "#2563eb"}
        />
      </div>
      <div
        className={`absolute right-[10px] ${isDark ? "text-primary-1" : "text-white"}`}
      >
        <Sun size={20} />
      </div>
    </button>
  );
}
