import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  // Map position to the appropriate classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        "absolute flex items-center gap-2 z-30 transition-all duration-300",
        positionClasses[position],
        isIdle ? "opacity-0 translate-y-1" : "opacity-90 hover:opacity-100",
        className
      )}
    >
      <div className="bg-background/70 dark:bg-background/40 backdrop-blur-sm p-2 rounded-lg shadow-md flex items-center gap-2">
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
  // Use a button with icon only for the standard look
  if (!showLabel) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        title={title}
        className={cn("flex items-center justify-center", className)}
      >
        {icon}
      </Button>
    );
  }

  // Use a flex container with icon and label for the labeled version
  return (
    <Button
      variant="outline"
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-medium",
        className
      )}
    >
      {icon}
      {label && <span>{label}</span>}
    </Button>
  );
}
