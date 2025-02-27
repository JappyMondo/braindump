"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useTheme } from "next-themes";
function PwaThemeColorManager() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.setAttribute("name", "theme-color");
    }

    const darkBackground = "hsl(220, 10%, 10%)";
    const lightBackground = "hsl(0, 0%, 100%)";

    metaTheme.setAttribute(
      "content",
      resolvedTheme === "dark" ? darkBackground : lightBackground
    );
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <PwaThemeColorManager />
      {children}
    </NextThemesProvider>
  );
}
