"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      media.addEventListener("change", listener);

      return () => {
        window.removeEventListener("resize", listener);
        media.removeEventListener("change", listener);
      };
    }
  }, [query]);

  return matches;
}
