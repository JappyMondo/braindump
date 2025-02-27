import * as React from "react";
import { Moon, Sun, WandSparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { CanvasToolboxButton } from "@/components/canvas-toolbox";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ToolboxThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else if (theme === "system") {
      setTheme("dark");
    } else {
      throw new Error(`Invalid theme: ${theme}`);
    }
  };

  // Get theme display name
  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "Auto";
      default:
        return "Theme";
    }
  };

  // Render the icon based on current theme
  const renderThemeIcon = () => {
    // Use consistent icon sizing for all devices
    const iconSize = isMobile ? "h-4 w-4" : "h-4 w-4";

    if (isMobile) {
      // Use a simplified approach for mobile - just show the current theme icon
      if (theme === "light") {
        return <Sun className={iconSize} />;
      } else if (theme === "dark") {
        return <Moon className={iconSize} />;
      } else {
        return <WandSparkles className={iconSize} />;
      }
    }

    // For desktop, use the stacked animated icons
    return (
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute h-4 w-4 transition-all ${
            theme === "light" ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all ${
            theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
        <WandSparkles
          className={`absolute h-4 w-4 transition-all ${
            theme === "system" ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
      </div>
    );
  };

  const currentTheme = theme || "system";

  return (
    <CanvasToolboxButton
      icon={renderThemeIcon()}
      title={`Theme: ${currentTheme} (click to cycle)`}
      onClick={toggleTheme}
      showLabel={isMobile}
      label={isMobile ? getThemeLabel() : undefined}
      className={isMobile ? "flex-1 h-9" : ""}
    />
  );
}
