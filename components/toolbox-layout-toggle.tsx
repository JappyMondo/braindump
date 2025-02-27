import { Eye, PencilLine } from "lucide-react";
import { CanvasToolboxButton } from "@/components/canvas-toolbox";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ToolboxLayoutToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToolboxLayoutToggle({
  value,
  onChange,
}: ToolboxLayoutToggleProps) {
  const isMobile = useMediaQuery("(max-width: 990px)");

  // For mobile, we should show what we'll switch TO, not the current state
  // This makes more sense from UX perspective (e.g., "Switch to Preview" when in Editor mode)
  const buttonLabel = isMobile ? (value ? "Preview" : "Editor") : undefined;
  const buttonTitle = value ? "Switch to Preview" : "Switch to Editor";
  const buttonIcon = value ? (
    <Eye className="h-4 w-4" />
  ) : (
    <PencilLine className="h-4 w-4" />
  );

  const handleToggle = () => {
    console.log("Toggle layout from", value, "to", !value);
    onChange(!value);
  };

  return (
    <CanvasToolboxButton
      onClick={handleToggle}
      title={buttonTitle}
      label={buttonLabel}
      icon={buttonIcon}
    />
  );
}
