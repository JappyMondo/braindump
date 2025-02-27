import { ReactNode } from "react";
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
  const isMobile = useMediaQuery("(max-width: 990px)");

  // For mobile, we want to have fixed position strips that don't hide
  if (isMobile) {
    // For top positions, place at the top of the screen
    if (position.startsWith("top")) {
      return (
        <div
          className={cn("fixed top-0 left-0 right-0 z-30 py-2 px-4", className)}
        >
          <div className="flex items-center w-full justify-between">
            {position === "top-left" ? (
              // Left-aligned content
              <div className="flex items-center gap-2 bg-background/70 dark:bg-background/40 backdrop-blur-sm rounded-md shadow-sm px-2 py-1">
                {children}
              </div>
            ) : position === "top-right" ? (
              // Right-aligned content
              <>
                <div className="flex-1"></div> {/* Spacer */}
                <div className="flex items-center gap-2 bg-background/70 dark:bg-background/40 backdrop-blur-sm rounded-md shadow-sm px-2 py-1">
                  {children}
                </div>
              </>
            ) : (
              // Center-aligned content (fallback)
              <>
                <div className="flex-1"></div> {/* Spacer */}
                <div className="flex items-center gap-2 bg-background/70 dark:bg-background/40 backdrop-blur-sm rounded-md shadow-sm px-2 py-1">
                  {children}
                </div>
                <div className="flex-1"></div> {/* Spacer */}
              </>
            )}
          </div>
        </div>
      );
    }

    // For bottom positions, place at the bottom of the screen
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 py-2 px-4",
          className
        )}
      >
        <div className="flex items-center w-full justify-between">
          {position === "bottom-left" ? (
            // Left-aligned content
            <div className="flex items-center gap-2 bg-background/60 dark:bg-background/30 backdrop-blur-sm rounded-md shadow-sm px-2 py-1 flex-grow">
              {children}
            </div>
          ) : position === "bottom-right" ? (
            // Right-aligned content
            <>
              <div className="flex-1"></div> {/* Spacer */}
              <div className="flex items-center gap-2 bg-background/60 dark:bg-background/30 backdrop-blur-sm rounded-md shadow-sm px-2 py-1 flex-grow">
                {children}
              </div>
            </>
          ) : (
            // Center-aligned content (bottom-center)
            <>
              <div className="flex-1"></div> {/* Spacer */}
              <div className="flex items-center gap-2 justify-center bg-background/60 dark:bg-background/30 backdrop-blur-sm rounded-md shadow-sm px-2 py-1 w-full">
                {children}
              </div>
              <div className="flex-1"></div> {/* Spacer */}
            </>
          )}
        </div>
      </div>
    );
  }

  // Map position to the appropriate classes for desktop
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  // Desktop layout (unchanged)
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
  const isMobile = useMediaQuery("(max-width: 990px)");

  // On mobile, always show labels if they exist
  if (isMobile && label) {
    return (
      <Button
        variant="outline"
        onClick={onClick}
        title={title}
        className={cn(
          "flex items-center gap-1.5 px-2 h-10 text-xs font-medium",
          className
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    );
  }

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
