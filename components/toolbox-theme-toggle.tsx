import * as React from "react";
import { Moon, Sun, WandSparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { CanvasToolboxButton } from "@/components/canvas-toolbox";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ToolboxThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 990px)");

  // Load theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("system");
    }
  }, [setTheme]);

  // Save theme to localStorage on change
  React.useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Toggle function - for direct toggle
  const toggleTheme = React.useCallback(() => {
    let nextTheme = theme;
    if (theme === "dark") {
      nextTheme = "light";
    } else if (theme === "light") {
      nextTheme = "system";
    } else if (theme === "system") {
      nextTheme = "dark";
    } else {
      throw new Error(`Invalid theme: ${theme}`);
    }

    setTheme(nextTheme);
  }, [theme, setTheme]);

  const baseClass = "h-4 w-4 transition-all absolute";
  const visibleClass = "rotate-0 scale-100 dark:-rotate-90 dark:scale-100";
  const hiddenClass = "rotate-90 scale-0 dark:rotate-0 dark:scale-0";

  // Get theme label for mobile display
  const getThemeLabel = () => {
    if (isMobile) {
      if (theme === "dark") return "Dark";
      if (theme === "light") return "Light";
      return "System";
    }
    return undefined;
  };

  return (
    <CanvasToolboxButton
      icon={
        <div className="relative w-4 h-4">
          <Sun
            className={
              baseClass + " " + (theme === "light" ? visibleClass : hiddenClass)
            }
          />
          <Moon
            className={
              baseClass + " " + (theme === "dark" ? visibleClass : hiddenClass)
            }
          />
          <WandSparkles
            className={
              baseClass +
              " " +
              (!theme || theme === "system" ? visibleClass : hiddenClass)
            }
          />
        </div>
      }
      label={getThemeLabel()}
      title={`Current theme: ${theme} (click to cycle)`}
      onClick={toggleTheme}
    />
  );
}
