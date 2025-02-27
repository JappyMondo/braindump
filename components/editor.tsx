"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Editor({ onChange, className, value }: EditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const prevValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Keep the onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update internal value when prop value changes significantly
  useEffect(() => {
    // Skip small changes as they might be coming from our own edits
    // Only update when the change is significant or from a different document
    const isDifferentDoc =
      value !== prevValueRef.current &&
      (value.length === 0 ||
        Math.abs(value.length - prevValueRef.current.length) > 5);

    if (isDifferentDoc) {
      console.log(
        "[Editor] external value changed significantly, updating internal state",
        {
          oldValueLength: prevValueRef.current.length,
          newValueLength: value.length,
          oldPreview: prevValueRef.current.substring(0, 20) + "...",
          newPreview: value.substring(0, 20) + "...",
        }
      );

      setInternalValue(value);
    }

    prevValueRef.current = value;
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      // Emit change immediately
      console.log("[Editor] textarea changed, emitting onChange", {
        newValueLength: newValue.length,
        preview: newValue.substring(0, 20) + "...",
      });

      onChangeRef.current(newValue);
    },
    []
  );

  return (
    <div className={cn("h-full relative group overflow-hidden", className)}>
      {/* Top fade gradient */}
      <div
        className={`absolute top-0 left-0 right-0 ${
          isMobile ? "h-10" : "h-12"
        } bg-gradient-to-b from-background to-transparent z-10 pointer-events-none`}
      ></div>

      <textarea
        value={internalValue}
        onChange={handleChange}
        className={`w-full min-h-full h-full resize-none bg-background p-4 ${
          isMobile ? "pt-10 pb-12" : "pt-12 pb-12"
        } text-lg leading-relaxed outline-none overflow-auto`}
        placeholder="Start brainstorming... (Markdown supported)"
        spellCheck="false"
        autoFocus
      />

      {/* Bottom fade gradient */}
      <div
        className={`absolute bottom-0 left-0 right-0 ${
          isMobile ? "h-8" : "h-12"
        } bg-gradient-to-t from-background to-transparent z-10 pointer-events-none`}
      ></div>
    </div>
  );
}
