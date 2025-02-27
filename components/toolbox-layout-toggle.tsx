import { Eye, PencilLine } from "lucide-react";
import { CanvasToolboxButton } from "@/components/canvas-toolbox";

interface ToolboxLayoutToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToolboxLayoutToggle({
  value,
  onChange,
}: ToolboxLayoutToggleProps) {
  return (
    <CanvasToolboxButton
      onClick={() => onChange(!value)}
      title={value ? "Show Preview" : "Show Editor"}
      icon={
        value ? <Eye className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />
      }
    />
  );
}
