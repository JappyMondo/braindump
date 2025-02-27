import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CanvasToolboxProps {
  children: ReactNode;
  className?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
  isIdle?: boolean;
}

/**
 * A unified toolbox component for canvas actions
 * Consistent with the app's existing toolbox styling and behavior
 */
export function CanvasToolbox({
  children,
  className,
  position = "bottom-right",
  isIdle = false,
}: CanvasToolboxProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Map position to the appropriate classes for desktop
  const desktopPositionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  // For mobile, we'll stack toolboxes vertically to avoid overlap
  // Document selection/creation at bottom, logout and theme at top
  const getMobilePosition = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-0 left-0 right-0"; // Bottom bar for document selection
      case "bottom-center":
        return "top-0 left-0 right-0"; // Top bar for theme toggle and actions
      case "bottom-right":
        return "top-16 left-0 right-0"; // Below top bar if needed
      case "top-left":
        return "bottom-16 left-0 right-0"; // Above bottom bar if needed
      case "top-right":
        return "top-0 left-0 right-0"; // Top position
      default:
        return "bottom-0 left-0 right-0"; // Default to bottom
    }
  };

  return (
    <div
      className={cn(
        "flex items-center z-30 transition-all duration-300",
        !isMobile && "absolute gap-2",
        !isMobile && desktopPositionClasses[position],
        isMobile && "fixed py-2 px-2",
        isMobile && getMobilePosition(),
        // Don't hide on mobile, regardless of idle state
        !isMobile && isIdle
          ? "opacity-0 translate-y-1"
          : "opacity-90 hover:opacity-100",
        className
      )}
    >
      <div
        className={cn(
          "bg-background/70 dark:bg-background/40 backdrop-blur-sm rounded-lg shadow-md flex items-center",
          isMobile ? "w-full p-2 justify-around" : "p-2 gap-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface CanvasToolboxButtonProps {
  label?: string;
  icon: ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * Button specifically styled for the canvas toolbox
 * Can optionally display a text label
 */
export function CanvasToolboxButton({
  label,
  icon,
  onClick,
  title,
  className,
  showLabel = false,
}: CanvasToolboxButtonProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Use a button with icon only for the standard look
  if (!showLabel) {
    return (
      <Button
        variant="outline"
        size={isMobile ? "sm" : "icon"}
        onClick={onClick}
        title={title}
        className={cn(
          "flex items-center justify-center",
          isMobile && "h-9 w-auto min-w-9",
          className
        )}
      >
        {icon}
      </Button>
    );
  }

  // Use a flex container with icon and label for the labeled version
  return (
    <Button
      variant="outline"
      size={isMobile ? "sm" : undefined}
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 h-9 text-xs font-medium",
        className
      )}
    >
      {icon}
      {label && <span>{label}</span>}
    </Button>
  );
}
